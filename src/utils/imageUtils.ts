/**
 * Image utilities for consistent sizing and aspect ratios across the app
 */

export const AVATAR_SIZES = {
  xs: 'w-8 h-8',     // Compact layouts, minimal displays
  sm: 'w-10 h-10',   // List items, small cards
  md: 'w-12 h-12',   // Default cards, standard displays
  lg: 'w-16 h-16',   // Feature displays, emphasis
  xl: 'w-20 h-20'    // Upload previews, large displays
} as const;

export const AVATAR_TEXT_SIZES = {
  xs: 'text-xs',
  sm: 'text-sm', 
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
} as const;

export type AvatarSize = keyof typeof AVATAR_SIZES;

/**
 * Get consistent avatar sizing classes
 */
export const getAvatarSizeClasses = (size: AvatarSize) => ({
  container: AVATAR_SIZES[size],
  text: AVATAR_TEXT_SIZES[size]
});

/**
 * Standard image classes for consistent display
 */
export const IMAGE_CLASSES = {
  avatar: 'object-cover aspect-square',
  responsive: 'max-w-full h-auto',
  rounded: 'rounded-full',
  shadow: 'shadow-lg'
} as const;

/**
 * Get complete avatar classes for a given size
 */
export const getAvatarClasses = (size: AvatarSize, extraClasses?: string) => {
  const { container } = getAvatarSizeClasses(size);
  return `${container} shrink-0 ${extraClasses || ''}`.trim();
};