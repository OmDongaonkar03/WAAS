const API_URL = import.meta.env.VITE_API_URL;

const profileService = {
  /**
   * Get user profile
   * @param {string} token - Access token
   * @returns {Promise<{ok: boolean, data?: any}>}
   */
  getProfile: async (token) => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await response.json();

      return {
        ok: response.ok,
        data,
      };
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {string} token - Access token
   * @param {Object} profileData - Profile data to update
   * @param {string} profileData.name - User's name
   * @param {string} profileData.bio - User's bio
   * @returns {Promise<{ok: boolean, data?: any}>}
   */
  updateProfile: async (token, profileData) => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      return {
        ok: response.ok,
        data,
      };
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  },

  /**
   * Request email change
   * @param {string} token - Access token
   * @param {string} newEmail - New email address
   * @param {string} password - User's password for verification
   * @returns {Promise<{ok: boolean, data?: any}>}
   */
  requestEmailChange: async (token, newEmail, password) => {
    try {
      const response = await fetch(`${API_URL}/profile/email/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ newEmail, password }),
      });

      const data = await response.json();

      return {
        ok: response.ok,
        data,
      };
    } catch (error) {
      console.error("Email change request error:", error);
      throw error;
    }
  },

  /**
   * Verify email change
   * @param {string} token - Email change verification token
   * @returns {Promise<{ok: boolean, data?: any}>}
   */
  verifyEmailChange: async (token) => {
    try {
      const response = await fetch(`${API_URL}/profile/email/verify`, {
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
      console.error("Email verification error:", error);
      throw error;
    }
  },

  /**
   * Upload profile photo
   * @param {string} token - Access token
   * @param {File} file - Image file to upload
   * @returns {Promise<{ok: boolean, data?: any}>}
   */
  uploadProfilePhoto: async (token, file) => {
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await fetch(`${API_URL}/profile/photo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      return {
        ok: response.ok,
        data,
      };
    } catch (error) {
      console.error("Photo upload error:", error);
      throw error;
    }
  },

  /**
   * Delete profile photo
   * @param {string} token - Access token
   * @returns {Promise<{ok: boolean, data?: any}>}
   */
  deleteProfilePhoto: async (token) => {
    try {
      const response = await fetch(`${API_URL}/profile/photo`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await response.json();

      return {
        ok: response.ok,
        data,
      };
    } catch (error) {
      console.error("Photo delete error:", error);
      throw error;
    }
  },

  /**
   * Change user password
   * @param {string} token - Access token
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<{ok: boolean, data?: any}>}
   */
  changePassword: async (token, currentPassword, newPassword) => {
    try {
      const response = await fetch(`${API_URL}/profile/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      return {
        ok: response.ok,
        data,
      };
    } catch (error) {
      console.error("Password change error:", error);
      throw error;
    }
  },

  /**
   * Delete user account
   * @param {string} token - Access token
   * @param {string} password - User's password for confirmation
   * @returns {Promise<{ok: boolean, data?: any}>}
   */
  deleteAccount: async (token, password) => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      return {
        ok: response.ok,
        data,
      };
    } catch (error) {
      console.error("Account deletion error:", error);
      throw error;
    }
  },

  /**
   * Get user statistics
   * @param {string} token - Access token
   * @returns {Promise<{ok: boolean, data?: any}>}
   */
  getStats: async (token) => {
    try {
      const response = await fetch(`${API_URL}/profile/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await response.json();

      return {
        ok: response.ok,
        data,
      };
    } catch (error) {
      console.error("Error fetching stats:", error);
      throw error;
    }
  },
};

export default profileService;