/**
 * Utility functions for generating avatar images from user initials
 */

/**
 * Generate initials from name (first letter of first name)
 * @param {string} name - User's full name
 * @returns {string} - First letter of first name in uppercase
 */
export const getInitials = (name) => {
  if (!name) return "U";
  
  const trimmedName = name.trim();
  if (trimmedName.length === 0) return "U";
  
  // Get first letter of first name
  return trimmedName.charAt(0).toUpperCase();
};

/**
 * Generate a consistent color based on name
 * @param {string} name - User's name
 * @returns {string} - Hex color code
 */
export const getAvatarColor = (name) => {
  if (!name) return "#6366f1"; // Default indigo color
  
  const colors = [
    "#ef4444", // red
    "#f97316", // orange
    "#f59e0b", // amber
    "#84cc16", // lime
    "#10b981", // emerald
    "#06b6d4", // cyan
    "#3b82f6", // blue
    "#6366f1", // indigo
    "#8b5cf6", // violet
    "#d946ef", // fuchsia
    "#ec4899", // pink
  ];
  
  // Generate consistent index from name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

/**
 * Generate SVG data URL for avatar
 * @param {string} name - User's name
 * @returns {string} - Data URL of SVG image
 */
export const generateAvatarDataUrl = (name) => {
  const initials = getInitials(name);
  const bgColor = getAvatarColor(name);
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
      <rect width="128" height="128" fill="${bgColor}"/>
      <text
        x="50%"
        y="50%"
        dominant-baseline="middle"
        text-anchor="middle"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="64"
        font-weight="600"
        fill="white"
      >${initials}</text>
    </svg>
  `;
  
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
};

/**
 * Browser-compatible version (no Buffer)
 * @param {string} name - User's name
 * @returns {string} - Data URL of SVG image
 */
export const generateAvatarDataUrlBrowser = (name) => {
  const initials = getInitials(name);
  const bgColor = getAvatarColor(name);
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
      <rect width="128" height="128" fill="${bgColor}"/>
      <text
        x="50%"
        y="50%"
        dominant-baseline="middle"
        text-anchor="middle"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="64"
        font-weight="600"
        fill="white"
      >${initials}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};