import prisma from "../db/prisma.js";
import crypto from "crypto";
import {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
  generatePasswordResetToken,
  verifyRefreshToken,
  verifyPasswordResetToken,
  verifyAccessToken,
  verifyVerificationToken,
  hashPassword,
  comparePassword,
  validatePassword,
} from "../utils/jwt.js";
import { verificationEmailTemplate } from "../templates/verificationEmail.js";
import { passwordResetEmailTemplate } from "../templates/passwordResetEmail.js";
import { sendMail } from "../utils/mail.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
} from "../utils/errors.js";

const sendVerificationEmail = async (user) => {
  const verificationToken = generateVerificationToken(user.id, user.email);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  const tokenHash = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const tokensSentToday = await prisma.verificationToken.count({
    where: {
      userId: user.id,
      createdAt: {
        gte: startOfDay,
      },
    },
  });

  if (tokensSentToday >= 3) {
    throw new RateLimitError(
      "Maximum verification emails sent for today. Please try again tomorrow.",
    );
  }

  await prisma.verificationToken.create({
    data: {
      token: verificationToken,
      tokenHash: tokenHash,
      userId: user.id,
      email: user.email,
      expiresAt,
      createdAt: new Date(),
    },
  });

  const frontendUrl = process.env.FRONTEND_URL;
  const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;

  const emailContent = verificationEmailTemplate({
    name: user.name,
    verificationLink,
  });

  await sendMail({
    to: user.email,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text,
  });
};

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ValidationError("All fields are required");
  }

  if (!validatePassword(password)) {
    throw new ValidationError(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one special character (@$!%*?&)",
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ConflictError("Email already registered");
  }

  const hashedPassword = await hashPassword(password);
  const now = new Date();

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verified: false,
        hasCompletedOnboarding: false,
        createdAt: now,
        updatedAt: now,
      },
      select: {
        id: true,
        email: true,
        name: true,
        profilePhoto: true,
        verified: true,
        hasCompletedOnboarding: true,
        createdAt: true,
      },
    });

    const refreshTokenValue = generateRefreshToken(user.id);
    
    await tx.refreshToken.create({
      data: {
        token: refreshTokenValue,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      },
    });

    return { user, refreshTokenValue };
  });

  try {
    await sendVerificationEmail(result.user);
  } catch (emailError) {
    console.error("Failed to send verification email:", emailError);
  }

  const finalAccessToken = generateAccessToken(result.user.id);

  res.cookie("refreshToken", result.refreshTokenValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    message:
      "User created successfully. Please check your email to verify your account.",
    token: finalAccessToken,
    user: result.user,
    verificationSent: true,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError("Email and password are required");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AuthenticationError("Invalid credentials");
  }

  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    throw new AuthenticationError("Invalid credentials");
  }

  if (!user.verified) {
    try {
      await sendVerificationEmail(user);
      return res.status(403).json({
        success: false,
        message:
          "Email not verified. A new verification link has been sent to your email.",
        verified: false,
        verificationSent: true,
      });
    } catch (emailError) {
      if (emailError instanceof RateLimitError) {
        return res.status(429).json({
          success: false,
          message: emailError.message,
          verified: false,
        });
      }
      return res.status(403).json({
        success: false,
        message: "Email not verified. Please contact support.",
        verified: false,
      });
    }
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    },
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userProfile = {
    id: user.id,
    email: user.email,
    name: user.name,
    bio: user.bio,
    profilePhoto: user.profilePhoto,
    verified: user.verified,
    hasCompletedOnboarding: user.hasCompletedOnboarding,
    createdAt: user.createdAt,
  };

  res.json({
    success: true,
    message: "Login successful",
    token: accessToken,
    user: userProfile,
  });
});

export const googleCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;

  if (!code) {
    const frontendUrl = process.env.FRONTEND_URL;
    return res.redirect(
      `${frontendUrl}/auth/callback?error=no_code`,
    );
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.API_URL}/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Google token exchange error:", tokenData);
      const frontendUrl = process.env.FRONTEND_URL;
      return res.redirect(
        `${frontendUrl}/auth/callback?error=token_exchange_failed`,
      );
    }

    const { access_token } = tokenData;

    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    const userInfo = await userInfoResponse.json();

    if (!userInfoResponse.ok) {
      console.error("Google user info error:", userInfo);
      const frontendUrl = process.env.FRONTEND_URL;
      return res.redirect(
        `${frontendUrl}/auth/callback?error=user_info_failed`,
      );
    }

    const { email, name, picture, id: googleId } = userInfo;

    let user = await prisma.user.findUnique({
      where: { email },
    });

    const now = new Date();
    const refreshTokenValue = generateRefreshToken(user?.id || "temp");

    if (!user) {
      user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            email,
            name,
            profilePhoto: picture || null,
            googleId,
            verified: true,
            hasCompletedOnboarding: false,
            createdAt: now,
            updatedAt: now,
          },
          select: {
            id: true,
            email: true,
            name: true,
            profilePhoto: true,
            verified: true,
            hasCompletedOnboarding: true,
            createdAt: true,
          },
        });

        const newRefreshToken = generateRefreshToken(newUser.id);
        
        await tx.refreshToken.create({
          data: {
            token: newRefreshToken,
            userId: newUser.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            createdAt: new Date(),
          },
        });

        return { user: newUser, refreshToken: newRefreshToken };
      });

      refreshTokenValue = user.refreshToken;
      user = user.user;
    } else {
      const newRefreshToken = generateRefreshToken(user.id);
      
      await prisma.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
        },
      });

      refreshTokenValue = newRefreshToken;
    }

    const accessToken = generateAccessToken(user.id);

    res.cookie("refreshToken", refreshTokenValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const frontendUrl = process.env.FRONTEND_URL;
    res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}`);
  } catch (error) {
    console.error("Google OAuth error:", error);
    const frontendUrl = process.env.FRONTEND_URL;
    return res.redirect(
      `${frontendUrl}/auth/callback?error=authentication_failed`,
    );
  }
});

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new AuthenticationError("No refresh token provided");
  }

  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    throw new AuthenticationError("Invalid or expired refresh token");
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!storedToken || new Date() > storedToken.expiresAt) {
    throw new AuthenticationError("Refresh token expired");
  }

  if (!storedToken.user) {
    throw new AuthenticationError("Invalid refresh token");
  }

  const newAccessToken = generateAccessToken(storedToken.userId);

  const userProfile = {
    id: storedToken.user.id,
    email: storedToken.user.email,
    name: storedToken.user.name,
    bio: storedToken.user.bio,
    profilePhoto: storedToken.user.profilePhoto,
    verified: storedToken.user.verified,
    hasCompletedOnboarding: storedToken.user.hasCompletedOnboarding,
    createdAt: storedToken.user.createdAt,
  };

  res.json({
    success: true,
    token: newAccessToken,
    user: userProfile,
  });
});

export const me = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new AuthenticationError("Not authenticated");
  }

  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    throw new AuthenticationError("Invalid or expired session");
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!storedToken || new Date() > storedToken.expiresAt) {
    throw new AuthenticationError("Session expired");
  }

  if (!storedToken.user) {
    throw new AuthenticationError("Session invalid");
  }

  const newAccessToken = generateAccessToken(storedToken.userId);

  const userProfile = {
    id: storedToken.user.id,
    email: storedToken.user.email,
    name: storedToken.user.name,
    bio: storedToken.user.bio,
    profilePhoto: storedToken.user.profilePhoto,
    verified: storedToken.user.verified,
    hasCompletedOnboarding: storedToken.user.hasCompletedOnboarding,
    createdAt: storedToken.user.createdAt,
  };

  res.json({
    success: true,
    token: newAccessToken,
    user: userProfile,
  });
});

export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.json({ 
    success: true,
    message: "Logged out successfully" 
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new ValidationError("Verification token is required");
  }

  const decoded = verifyVerificationToken(token);
  
  if (!decoded || decoded.type !== "verification") {
    throw new ValidationError("Invalid verification token");
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const storedToken = await prisma.verificationToken.findUnique({
    where: { tokenHash },
  });

  if (!storedToken) {
    throw new NotFoundError("Verification token not found");
  }

  if (storedToken.used) {
    throw new ValidationError("Verification token already used");
  }

  if (new Date() > storedToken.expiresAt) {
    throw new ValidationError("Verification token has expired");
  }

  if (storedToken.userId !== decoded.userId) {
    throw new ValidationError("Invalid verification token");
  }

  const updatedUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: decoded.userId },
      data: {
        verified: true,
        email: decoded.email,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        verified: true,
      },
    });

    await tx.verificationToken.update({
      where: { tokenHash },
      data: { used: true },
    });

    return user;
  });

  res.json({ 
    success: true,
    message: "Email verified successfully",
    user: updatedUser,
    verified: true,
  });
});

export const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ValidationError("Email is required");
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.json({
      success: true,
      message: "If your email is in our system, a verification link has been sent.",
    });
  }

  if (user.verified) {
    return res.json({
      success: true,
      message: "This email is already verified.",
      verified: true,
    });
  }

  try {
    await sendVerificationEmail(user);
    res.json({
      success: true,
      message: "Verification email sent successfully.",
    });
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error;
    }
    console.error("Failed to resend verification email:", error);
    res.json({
      success: true,
      message: "If your email is in our system, a verification link has been sent.",
    });
  }
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ValidationError("Email is required");
  }

  const successMessage =
    "If an account exists with this email, you will receive a password reset link.";

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.json({ 
      success: true,
      message: successMessage 
    });
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const tokensSentToday = await prisma.passwordResetToken.count({
    where: {
      userId: user.id,
      createdAt: {
        gte: startOfDay,
      },
    },
  });

  if (tokensSentToday >= 3) {
    console.log(`Rate limit hit for password reset: ${email}`);
    return res.json({ 
      success: true,
      message: successMessage 
    });
  }

  const resetToken = generatePasswordResetToken(user.id, user.email);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  const tokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  await prisma.passwordResetToken.create({
    data: {
      token: resetToken,
      tokenHash: tokenHash,
      userId: user.id,
      email: user.email,
      used: false,
      expiresAt,
      createdAt: new Date(),
    },
  });

  const frontendUrl = process.env.FRONTEND_URL;
  const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

  const emailContent = passwordResetEmailTemplate({
    name: user.name,
    resetLink,
  });

  try {
    await sendMail({
      to: user.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });
  } catch (emailError) {
    console.error("Failed to send password reset email:", emailError);
  }

  res.json({ 
    success: true,
    message: successMessage 
  });
});

export const validateResetToken = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new ValidationError("Token is required");
  }

  const decoded = verifyPasswordResetToken(token);
  if (!decoded) {
    return res.status(400).json({
      success: false,
      valid: false,
      message: "Invalid or expired reset token",
    });
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const storedToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (!storedToken) {
    return res.status(400).json({
      success: false,
      valid: false,
      message: "Invalid reset token",
    });
  }

  if (new Date() > storedToken.expiresAt) {
    return res.status(400).json({
      success: false,
      valid: false,
      message:
        "Reset token has expired. Please request a new password reset link.",
    });
  }

  if (storedToken.used) {
    return res.status(400).json({
      success: false,
      valid: false,
      message:
        "This reset link has already been used. Please request a new password reset if needed.",
    });
  }

  res.json({
    success: true,
    valid: true,
    message: "Token is valid",
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw new ValidationError("Token and new password are required");
  }

  if (!validatePassword(newPassword)) {
    throw new ValidationError(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one special character (@$!%*?&)"
    );
  }

  const decoded = verifyPasswordResetToken(token);
  if (!decoded) {
    throw new AuthenticationError("Invalid or expired reset token");
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const storedToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!storedToken) {
    throw new AuthenticationError("Invalid reset token");
  }

  if (new Date() > storedToken.expiresAt) {
    throw new AuthenticationError("Reset token has expired");
  }

  if (storedToken.used) {
    throw new AuthenticationError("Reset token has already been used");
  }

  if (
    storedToken.email !== decoded.email ||
    storedToken.userId !== decoded.userId
  ) {
    throw new AuthenticationError("Invalid reset token");
  }

  const isSamePassword = await comparePassword(
    newPassword,
    storedToken.user.password
  );

  if (isSamePassword) {
    throw new ValidationError(
      "New password must be different from your current password"
    );
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: storedToken.userId },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    const tokenUpdate = await tx.passwordResetToken.updateMany({
      where: {
        tokenHash,
        used: false,
      },
      data: { used: true },
    });

    if (tokenUpdate.count === 0) {
      throw new AuthenticationError("Reset token has already been used");
    }

    await tx.refreshToken.deleteMany({
      where: { userId: storedToken.userId },
    });
  });

  res.json({
    success: true,
    message: "Password reset successful. Please login with your new password.",
  });
});

export const completeOnboarding = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AuthenticationError("No access token provided");
  }

  const token = authHeader.substring(7);
  const decoded = verifyAccessToken(token);

  if (!decoded) {
    throw new AuthenticationError("Invalid access token");
  }

  const userId = decoded.userId;

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      hasCompletedOnboarding: true,
      updatedAt: new Date(),
    },
    select: {
      id: true,
      email: true,
      name: true,
      bio: true,
      profilePhoto: true,
      verified: true,
      hasCompletedOnboarding: true,
      createdAt: true,
    },
  });

  res.json({
    success: true,
    message: "Onboarding completed successfully",
    user,
  });
});