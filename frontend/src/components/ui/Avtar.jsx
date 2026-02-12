import React from "react";

/**
 * Generate initials from name (first letter of first name)
 */
const getInitials = (name) => {
  if (!name) return "U";
  const trimmedName = name.trim();
  if (trimmedName.length === 0) return "U";
  return trimmedName.charAt(0).toUpperCase();
};

/**
 * Generate a consistent color based on name
 */
const getAvatarColor = (name) => {
  if (!name) return "#6366f1";

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

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

/**
 * Avatar component that shows either a profile photo or initials
 */
export const Avatar = ({ user, size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-16 h-16 text-2xl",
    lg: "w-24 h-24 text-4xl",
    xl: "w-32 h-32 text-5xl",
  };

  const initials = getInitials(user?.name);
  const bgColor = getAvatarColor(user?.name);

  if (user?.profilePhoto) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden ${className}`}
      >
        <img
          src={user.profilePhoto}
          alt={user.name}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold text-white ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {initials}
    </div>
  );
};

export default Avatar;