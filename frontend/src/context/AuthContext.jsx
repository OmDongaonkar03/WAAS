import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import authService from "../services/authService";
import tokenService from "../services/tokenService";
import apiRequest from "../helpers/apiRequest";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const refreshTimeoutRef = useRef(null);
  const isRefreshingRef = useRef(false); // Prevent concurrent refresh requests

  /**
   * Schedule the next token refresh
   */
  const scheduleTokenRefresh = (token) => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    const refreshTime = tokenService.calculateRefreshTime(token);
    
    if (refreshTime && refreshTime > 0) {
      console.log(`Token refresh scheduled in ${Math.round(refreshTime / 1000)}s`);
      refreshTimeoutRef.current = setTimeout(() => {
        refreshToken();
      }, refreshTime);
    }
  };

  /**
   * Refresh the access token
   */
  const refreshToken = async () => {
    // Prevent concurrent refresh requests
    if (isRefreshingRef.current) {
      console.log("Token refresh already in progress, waiting...");
      return { success: false, error: "Refresh already in progress" };
    }

    isRefreshingRef.current = true;

    try {
      console.log("Refreshing access token...");
      const { ok, data } = await authService.refreshToken();

      if (!ok) {
        if (data.verified === false) {
          logout();
          return {
            success: false,
            error: data.message,
            needsVerification: true,
          };
        }
        throw new Error(data.message || "Token refresh failed");
      }

      if (data.token) {
        console.log("Token refreshed successfully");
        setAccessToken(data.token);
        scheduleTokenRefresh(data.token);
      }

      if (data.user) {
        setUser(data.user);
      }

      return { success: true, data };
    } catch (error) {
      console.error("Token refresh error:", error);
      logout();
      return { success: false, error: error.message };
    } finally {
      isRefreshingRef.current = false;
    }
  };

  /**
   * Get a valid token, refreshing if necessary
   * THIS IS THE KEY FUNCTION YOU WERE MISSING!
   */
  const getValidToken = async () => {
    if (!accessToken) {
      console.log("No access token available");
      return null;
    }

    // Check if token is expired or about to expire
    const isExpired = tokenService.isTokenExpired(accessToken);
    
    if (isExpired) {
      console.log("Token is expired, refreshing...");
      const result = await refreshToken();
      
      if (result.success && result.data.token) {
        return result.data.token;
      } else {
        console.error("Failed to refresh token");
        return null;
      }
    }

    // Token is still valid
    return accessToken;
  };

  /**
   * Update user data (for profile updates)
   */
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  /**
   * Check authentication status on mount
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { ok, data } = await authService.checkAuth();

        if (ok) {
          if (data.token) {
            setAccessToken(data.token);
            scheduleTokenRefresh(data.token);
          }

          if (data.user) {
            setUser(data.user);
          }
        } else {
          setUser(null);
          setAccessToken(null);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Sign up a new user
   */
  const signup = async (name, email, password) => {
    try {
      const { ok, data } = await authService.signup(name, email, password);

      if (!ok) {
        throw new Error(data.message || "Signup failed");
      }

      if (data.token) {
        setAccessToken(data.token);
        scheduleTokenRefresh(data.token);
      }

      if (data.user) {
        setUser(data.user);
      }

      return {
        success: true,
        data,
        verificationSent: data.verificationSent,
      };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Log in a user
   */
  const login = async (email, password) => {
    try {
      const { ok, data } = await authService.login(email, password);

      if (!ok) {
        if (data.verified === false) {
          return {
            success: false,
            error: data.message,
            needsVerification: true,
            verificationSent: data.verificationSent,
          };
        }
        throw new Error(data.message || "Login failed");
      }

      if (data.token) {
        setAccessToken(data.token);
        scheduleTokenRefresh(data.token);
      }

      if (data.user) {
        setUser(data.user);
      }

      return { success: true, data };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Log out the current user
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      setAccessToken(null);
      setUser(null);
    }
  };

  /**
   * Request a password reset email
   */
  const forgotPassword = async (email) => {
    try {
      const { ok, data } = await authService.forgotPassword(email);

      if (!ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      return {
        success: true,
        message: data.message || "Password reset email sent successfully",
      };
    } catch (error) {
      console.error("Forgot password error:", error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Validate a password reset token
   */
  const validateResetToken = async (token) => {
    try {
      const { ok, data } = await authService.validateResetToken(token);

      if (!ok) {
        return {
          valid: false,
          message: data.message || "Invalid token",
        };
      }

      return {
        valid: true,
        message: data.message,
      };
    } catch (error) {
      console.error("Validate reset token error:", error);
      return {
        valid: false,
        message: "Failed to validate token",
      };
    }
  };

  /**
   * Reset password with a valid token
   */
  const resetPassword = async (token, newPassword) => {
    try {
      const { ok, data } = await authService.resetPassword(token, newPassword);

      if (!ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      return {
        success: true,
        message: data.message || "Password reset successfully",
      };
    } catch (error) {
      console.error("Reset password error:", error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Check if user is logged in
   */
  const isLoggedIn = () => {
    return !!user;
  };

  /**
   * Get the current access token (may be expired - use getValidToken instead!)
   * @deprecated Use getValidToken() instead
   */
  const getToken = () => {
    return accessToken;
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    forgotPassword,
    validateResetToken,
    resetPassword,
    isLoggedIn,
    getToken, 
    getValidToken,
    refreshToken,
    updateUser, 
    apiRequest,
    token: accessToken, 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};