const API_URL = import.meta.env.VITE_API_URL;

const authService = {
  /**
   * Check if user is authenticated
   * @returns {Promise<{ok: boolean, data?: any}>}
   */
  checkAuth: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      return {
        ok: response.ok,
        data,
      };
    } catch (error) {
      console.error("Error checking auth:", error);
      throw error;
    }
  },

  /**
   * Refresh the access token
   * @returns {Promise<{ok: boolean, data?: any}>}
   */
  refreshToken: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      return {
        ok: response.ok,
        data,
      };
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    }
  },

  /**
   * Sign up a new user
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ok: boolean, data?: any}>}
   */
  signup: async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      return {
        ok: response.ok,
        data,
      };
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },

  /**
   * Log in a user
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ok: boolean, data?: any}>}
   */
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      return {
        ok: response.ok,
        data,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  /**
   * Log out the current user
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Don't throw, logout should always succeed locally
    }
  },

  /**
   * Request a password reset email
   * @param {string} email
   * @returns {Promise<{ok: boolean, data?: any}>}
   */
  forgotPassword: async (email) => {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      return {
        ok: response.ok,
        data,
      };
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  },

  /**
   * Validate a password reset token
   * @param {string} token
   * @returns {Promise<{ok: boolean, data?: any}>}
   */
  validateResetToken: async (token) => {
    try {
      const response = await fetch(`${API_URL}/auth/validate-reset-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      return {
        ok: response.ok,
        data,
      };
    } catch (error) {
      console.error("Validate reset token error:", error);
      throw error;
    }
  },

  /**
   * Reset password with a valid token
   * @param {string} token
   * @param {string} newPassword
   * @returns {Promise<{ok: boolean, data?: any}>}
   */
  resetPassword: async (token, newPassword) => {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      return {
        ok: response.ok,
        data,
      };
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  },
};

export default authService;