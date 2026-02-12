import prisma from "../db/prisma.js";
import crypto from "crypto";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  ValidationError,
  AuthenticationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
} from "../utils/errors.js";
import {
  hashPassword,
  comparePassword,
  validatePassword,
  generateEmailChangeToken,
  verifyEmailChangeToken,
} from "../utils/jwt.js";
import { sendMail } from "../utils/mail.js";
import { emailChangeVerificationTemplate } from "../templates/emailChangeEmail.js";

/**
 * Get user profile
 * @route GET /api/profile
 * @access Private
 */
export const getProfile = asyncHandler(async (req, res) => {
  // req.user is already set by authenticate middleware
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      bio: true,
      profilePhoto: true,
      verified: true,
      hasCompletedOnboarding: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.json({
    success: true,
    user,
  });
});

/**
 * Update user profile
 * @route PUT /api/profile
 * @access Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio } = req.body;

  // Validate inputs
  const updateData = {};

  if (name !== undefined) {
    if (!name || name.trim().length === 0) {
      throw new ValidationError("Name cannot be empty");
    }
    if (name.length > 100) {
      throw new ValidationError("Name must be less than 100 characters");
    }
    updateData.name = name.trim();
  }

  if (bio !== undefined) {
    if (bio && bio.length > 500) {
      throw new ValidationError("Bio must be less than 500 characters");
    }
    updateData.bio = bio ? bio.trim() : null;
  }

  // Update timestamp
  updateData.updatedAt = new Date();

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      bio: true,
      profilePhoto: true,
      verified: true,
      hasCompletedOnboarding: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.json({
    success: true,
    message: "Profile updated successfully",
    user: updatedUser,
  });
});

/**
 * Request email change (sends verification to new email)
 * @route POST /api/profile/email/request
 * @access Private
 */
export const requestEmailChange = asyncHandler(async (req, res) => {
  const { newEmail, password } = req.body;

  if (!newEmail || !password) {
    throw new ValidationError("New email and password are required");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newEmail)) {
    throw new ValidationError("Invalid email format");
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Check if new email is same as current
  if (user.email.toLowerCase() === newEmail.toLowerCase()) {
    throw new ValidationError("New email must be different from current email");
  }

  // Verify password (if user has password - might not if Google signup)
  if (user.password) {
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new AuthenticationError("Incorrect password");
    }
  }

  // Check if new email is already taken
  const existingUser = await prisma.user.findUnique({
    where: { email: newEmail },
  });

  if (existingUser) {
    throw new ConflictError("Email is already in use");
  }

  // Rate limiting - max 3 email change requests per day
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const requestsToday = await prisma.emailChangeToken.count({
    where: {
      userId: user.id,
      createdAt: {
        gte: startOfDay,
      },
    },
  });

  if (requestsToday >= 3) {
    throw new RateLimitError(
      "Maximum email change requests reached for today. Please try again tomorrow."
    );
  }

  // Invalidate any pending email change requests
  await prisma.emailChangeToken.updateMany({
    where: {
      userId: user.id,
      used: false,
    },
    data: {
      used: true,
    },
  });

  // Create email change token
  const changeToken = generateEmailChangeToken(user.id, user.email, newEmail);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  const tokenHash = crypto
    .createHash("sha256")
    .update(changeToken)
    .digest("hex");

  await prisma.emailChangeToken.create({
    data: {
      token: changeToken,
      tokenHash: tokenHash,
      userId: user.id,
      oldEmail: user.email,
      newEmail: newEmail,
      expiresAt,
      createdAt: new Date(),
    },
  });

  // Send verification email to NEW email address
  const frontendUrl = process.env.FRONTEND_URL;
  const verificationLink = `${frontendUrl}/verify-email-change?token=${changeToken}`;

  const emailContent = emailChangeVerificationTemplate({
    name: user.name,
    oldEmail: user.email,
    newEmail: newEmail,
    verificationLink,
  });

  try {
    await sendMail({
      to: newEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });
  } catch (emailError) {
    console.error("Failed to send email change verification:", emailError);
    throw new Error("Failed to send verification email. Please try again.");
  }

  res.json({
    success: true,
    message: `Verification email sent to ${newEmail}. Please check your inbox.`,
  });
});

/**
 * Verify and confirm email change
 * @route POST /api/profile/email/verify
 * @access Public (uses token)
 */
export const verifyEmailChange = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new ValidationError("Verification token is required");
  }

  const decoded = verifyEmailChangeToken(token);

  if (!decoded || decoded.type !== "emailChange") {
    throw new ValidationError("Invalid or expired verification token");
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const storedToken = await prisma.emailChangeToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!storedToken) {
    throw new NotFoundError("Verification token not found");
  }

  if (storedToken.used) {
    throw new ValidationError("This verification link has already been used");
  }

  if (new Date() > storedToken.expiresAt) {
    throw new ValidationError(
      "Verification link has expired. Please request a new email change."
    );
  }

  // Verify token data matches
  if (
    storedToken.userId !== decoded.userId ||
    storedToken.oldEmail !== decoded.oldEmail ||
    storedToken.newEmail !== decoded.newEmail
  ) {
    throw new ValidationError("Invalid verification token");
  }

  // Check if new email is still available
  const existingUser = await prisma.user.findUnique({
    where: { email: storedToken.newEmail },
  });

  if (existingUser && existingUser.id !== storedToken.userId) {
    throw new ConflictError(
      "This email is no longer available. Please request a new email change."
    );
  }

  // Update user email
  const updatedUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: storedToken.userId },
      data: {
        email: storedToken.newEmail,
        verified: true,
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
        updatedAt: true,
      },
    });

    // Mark token as used
    await tx.emailChangeToken.update({
      where: { tokenHash },
      data: {
        used: true,
        verified: true,
      },
    });

    // Invalidate all other pending tokens for this user
    await tx.emailChangeToken.updateMany({
      where: {
        userId: storedToken.userId,
        used: false,
        id: { not: storedToken.id },
      },
      data: {
        used: true,
      },
    });

    return user;
  });

  res.json({
    success: true,
    message: "Email changed successfully",
    user: updatedUser,
  });
});

/**
 * Upload profile photo
 * @route POST /api/profile/photo
 * @access Private
 */
export const uploadProfilePhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ValidationError("No photo file provided");
  }

  const photoUrl = req.file.path || `/uploads/${req.file.filename}`;

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      profilePhoto: photoUrl,
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
      updatedAt: true,
    },
  });

  res.json({
    success: true,
    message: "Profile photo uploaded successfully",
    user: updatedUser,
    photoUrl,
  });
});

/**
 * Delete profile photo
 * @route DELETE /api/profile/photo
 * @access Private
 */
export const deleteProfilePhoto = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { profilePhoto: true },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      profilePhoto: null,
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
      updatedAt: true,
    },
  });

  res.json({
    success: true,
    message: "Profile photo deleted successfully",
    user: updatedUser,
  });
});

/**
 * Change password
 * @route PUT /api/profile/password
 * @access Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ValidationError("Current password and new password are required");
  }

  if (!validatePassword(newPassword)) {
    throw new ValidationError(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one special character (@$!%*?&)"
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Check if user has a password
  if (!user.password) {
    throw new ValidationError(
      "Cannot change password. This account was created using Google sign-in."
    );
  }

  // Verify current password
  const isValidPassword = await comparePassword(currentPassword, user.password);
  if (!isValidPassword) {
    throw new AuthenticationError("Current password is incorrect");
  }

  // Check if new password is different
  const isSamePassword = await comparePassword(newPassword, user.password);
  if (isSamePassword) {
    throw new ValidationError(
      "New password must be different from your current password"
    );
  }

  // Hash and update password
  const hashedPassword = await hashPassword(newPassword);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: req.user.id },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    // Invalidate all refresh tokens for security
    await tx.refreshToken.deleteMany({
      where: { userId: req.user.id },
    });
  });

  res.json({
    success: true,
    message:
      "Password changed successfully. Please log in again with your new password.",
  });
});

/**
 * Delete account
 * @route DELETE /api/profile
 * @access Private
 */
export const deleteAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Verify password if user has one
  if (user.password) {
    if (!password) {
      throw new ValidationError("Password is required to delete your account");
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new AuthenticationError("Incorrect password");
    }
  }

  // Delete user and all related data
  await prisma.$transaction(async (tx) => {
    await tx.refreshToken.deleteMany({
      where: { userId: req.user.id },
    });

    await tx.verificationToken.deleteMany({
      where: { userId: req.user.id },
    });

    await tx.passwordResetToken.deleteMany({
      where: { userId: req.user.id },
    });

    await tx.emailChangeToken.deleteMany({
      where: { userId: req.user.id },
    });

    await tx.user.delete({
      where: { id: req.user.id },
    });
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.json({
    success: true,
    message: "Account deleted successfully",
  });
});

/**
 * Get user statistics
 * @route GET /api/profile/stats
 * @access Private
 */
export const getStats = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      createdAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Calculate account age
  const accountAge = Math.floor(
    (new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
  );

  const stats = {
    totalRuns: 24,
    averageDuration: "3.2m",
    accountAgeDays: accountAge,
    lastActive: new Date().toISOString(),
  };

  res.json({
    success: true,
    stats,
  });
});