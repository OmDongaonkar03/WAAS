/*import decodeToken from "../helpers/decodeToken";

const tokenService = {
  /**
   * Decode a JWT token
   * @param {string} token
   * @returns {object|null} Decoded token payload or null if invalid
   */
  /*decode: (token) => {
    return decodeToken(token);
  },

  /**
   * Calculate when to refresh the token (in milliseconds from now)
   * @param {string} token
   * @returns {number|null} Milliseconds until refresh, or null if invalid
   */
 /* calculateRefreshTime: (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      return null;
    }

    const currentTime = Date.now() / 1000;
    const expiresIn = decoded.exp - currentTime;

    // If token expires in more than 10 minutes, refresh 5 minutes before expiry
    // Otherwise, refresh at half the remaining time
    const refreshTime = expiresIn > 600 ? expiresIn - 300 : expiresIn / 2;

    return refreshTime > 0 ? refreshTime * 1000 : null;
  },

  /**
   * Check if a token is expired
   * @param {string} token
   * @returns {boolean}
   */
 /* isExpired: (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  },

  /**
   * Get time until token expires (in seconds)
   * @param {string} token
   * @returns {number|null} Seconds until expiry, or null if invalid
   */
  /*getTimeUntilExpiry: (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      return null;
    }

    const currentTime = Date.now() / 1000;
    const expiresIn = decoded.exp - currentTime;

    return expiresIn > 0 ? expiresIn : 0;
  },
};

export default tokenService;
*/

/**
 * Token Service
 * Place this file at: src/services/tokenService.js
 * 
 * Utilities for handling JWT tokens on the client side
 */

const tokenService = {
  /**
   * Decode a JWT token without verification (client-side only)
   * @param {string} token - JWT token
   * @returns {Object|null} - Decoded payload or null
   */
  decodeToken(token) {
    try {
      if (!token) return null;
      
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      // Decode the payload (second part of JWT)
      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  /**
   * Check if a token is expired or about to expire
   * @param {string} token - JWT token
   * @returns {boolean} - True if expired or expiring soon
   */
  isTokenExpired(token) {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      console.log('Token has no expiration');
      return true;
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    // Add 30 second buffer - refresh if expiring in next 30 seconds
    const bufferTime = 30;
    const isExpired = decoded.exp < (currentTime + bufferTime);
    
    if (isExpired) {
      console.log('Token is expired or expiring soon:', {
        expiresAt: new Date(decoded.exp * 1000),
        now: new Date(currentTime * 1000),
        timeRemaining: decoded.exp - currentTime,
      });
    }
    
    return isExpired;
  },

  /**
   * Calculate when to refresh the token (in milliseconds from now)
   * Strategy: Refresh at 75% of token lifetime or 5 minutes before expiry
   * @param {string} token - JWT token
   * @returns {number|null} - Milliseconds until refresh, or null if invalid
   */
  calculateRefreshTime(token) {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp || !decoded.iat) {
      console.log('Cannot calculate refresh time - invalid token');
      return null;
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    const tokenLifetime = decoded.exp - decoded.iat; // Total lifetime in seconds
    const timeRemaining = decoded.exp - currentTime; // Time left in seconds
    
    // If token is already expired or about to expire, refresh immediately
    if (timeRemaining <= 60) {
      console.log('Token expiring soon, refreshing immediately');
      return 100; // Refresh in 100ms
    }
    
    // Calculate when to refresh:
    // Option 1: At 75% of token lifetime
    const timeElapsed = currentTime - decoded.iat;
    const refreshAtPercentage = (tokenLifetime * 0.75) - timeElapsed;
    
    // Option 2: 5 minutes before expiry
    const refreshBeforeExpiry = timeRemaining - (5 * 60);
    
    // Use whichever comes first
    const refreshInSeconds = Math.max(
      Math.min(refreshAtPercentage, refreshBeforeExpiry),
      60 // At least 60 seconds from now
    );
    
    // Convert to milliseconds
    return refreshInSeconds * 1000;
  },

  /**
   * Get token expiration time
   * @param {string} token - JWT token
   * @returns {Date|null} - Expiration date or null
   */
  getExpirationTime(token) {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return null;
    
    return new Date(decoded.exp * 1000);
  },

  /**
   * Get detailed token info for debugging
   * @param {string} token - JWT token
   * @returns {Object|null} - Token info or null
   */
  getTokenInfo(token) {
    const decoded = this.decodeToken(token);
    if (!decoded) return null;
    
    const currentTime = Math.floor(Date.now() / 1000);
    const timeRemaining = decoded.exp - currentTime;
    
    return {
      userId: decoded.userId,
      email: decoded.email,
      expiresAt: new Date(decoded.exp * 1000),
      issuedAt: new Date(decoded.iat * 1000),
      isExpired: this.isTokenExpired(token),
      timeRemaining: timeRemaining,
      timeRemainingFormatted: this.formatTimeRemaining(timeRemaining),
    };
  },

  /**
   * Format time remaining in human-readable format
   * @param {number} seconds - Seconds remaining
   * @returns {string} - Formatted string
   */
  formatTimeRemaining(seconds) {
    if (seconds <= 0) return 'Expired';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  },
};

export default tokenService;