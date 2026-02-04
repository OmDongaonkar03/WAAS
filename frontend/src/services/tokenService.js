import decodeToken from "../helpers/decodeToken";

const tokenService = {
  /**
   * Decode a JWT token
   * @param {string} token
   * @returns {object|null} Decoded token payload or null if invalid
   */
  decode: (token) => {
    return decodeToken(token);
  },

  /**
   * Calculate when to refresh the token (in milliseconds from now)
   * @param {string} token
   * @returns {number|null} Milliseconds until refresh, or null if invalid
   */
  calculateRefreshTime: (token) => {
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
  isExpired: (token) => {
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
  getTimeUntilExpiry: (token) => {
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