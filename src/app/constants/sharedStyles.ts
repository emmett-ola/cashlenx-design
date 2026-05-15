/**
 * Shared UI Styles for CashLenX
 * Consistent styling classes across all components
 * Following Inter typography and 4px spacing grid
 */

// ==================== TYPOGRAPHY ====================

export const typography = {
  // Headings
  h1: 'text-2xl font-bold text-gray-900',
  h2: 'text-xl font-bold text-gray-900',
  h3: 'text-lg font-semibold text-gray-900',
  h4: 'text-base font-semibold text-gray-900',
  
  // Body Text
  body: 'text-base text-gray-700',
  bodySmall: 'text-sm text-gray-700',
  bodyMedium: 'text-base font-medium text-gray-700',
  
  // Labels & Captions
  label: 'text-sm font-medium text-gray-700',
  labelSmall: 'text-xs font-medium text-gray-700',
  caption: 'text-xs text-gray-500',
  captionSmall: 'text-[10px] text-gray-500',
  
  // Special Text
  username: 'font-semibold text-gray-900',
  greeting: 'text-sm text-gray-500',
  link: 'font-medium text-sm hover:opacity-80 transition-opacity',
  
  // Numbers/Amounts
  amount: 'font-semibold',
  amountLarge: 'text-2xl font-bold',
  amountMedium: 'text-lg font-semibold',
  amountSmall: 'text-base font-semibold',
};

// ==================== AVATAR ====================

export const avatar = {
  // Avatar Container
  container: 'rounded-full overflow-hidden shadow-md',
  containerHover: 'rounded-full overflow-hidden shadow-md hover:opacity-90 transition-opacity',
  
  // Avatar Sizes
  small: 'w-10 h-10',
  medium: 'w-14 h-14',
  large: 'w-20 h-20',
  
  // Avatar Image
  image: 'w-full h-full object-cover',
  
  // Avatar Fallback (initials)
  fallback: 'w-full h-full rounded-full flex items-center justify-center text-white font-semibold',
  fallbackSmall: 'text-sm',
  fallbackMedium: 'text-xl',
  fallbackLarge: 'text-3xl',
};

// Complete avatar classes for common use cases
export const avatarPresets = {
  small: {
    container: `${avatar.small} ${avatar.containerHover}`,
    image: avatar.image,
    fallback: `${avatar.small} ${avatar.fallback} ${avatar.fallbackSmall}`,
  },
  medium: {
    container: `${avatar.medium} ${avatar.containerHover}`,
    image: avatar.image,
    fallback: `${avatar.medium} ${avatar.fallback} ${avatar.fallbackMedium}`,
  },
  large: {
    container: `${avatar.large} ${avatar.containerHover}`,
    image: avatar.image,
    fallback: `${avatar.large} ${avatar.fallback} ${avatar.fallbackLarge}`,
  },
};

// ==================== BUTTONS ====================

export const button = {
  // Primary Buttons
  primary: 'w-full py-3 rounded-xl font-medium text-white shadow-md hover:shadow-lg transition-all',
  primarySmall: 'px-4 py-2 rounded-lg font-medium text-white shadow-sm hover:shadow-md transition-all',
  
  // Secondary Buttons
  secondary: 'w-full py-3 rounded-xl font-medium border-2 hover:bg-gray-50 transition-all',
  secondarySmall: 'px-4 py-2 rounded-lg font-medium border-2 hover:bg-gray-50 transition-all',
  
  // Ghost Buttons
  ghost: 'px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-all',
  ghostSmall: 'px-3 py-1 rounded-md font-medium hover:bg-gray-100 transition-all',
  
  // Icon Buttons
  icon: 'p-2 rounded-lg hover:bg-gray-100 transition-all',
  iconRound: 'p-2 rounded-full hover:bg-gray-100 transition-all',
};

// ==================== CARDS ====================

export const card = {
  // Basic Cards
  base: 'bg-white rounded-2xl shadow-sm',
  baseHover: 'bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow',
  
  // Card Padding
  padding: 'p-4',
  paddingLarge: 'p-5',
  paddingSmall: 'p-3',
  
  // Card with Gradient (glassmorphism)
  glass: 'backdrop-blur-lg bg-white/80 rounded-2xl shadow-lg',
};

// ==================== INPUTS ====================

export const input = {
  // Text Inputs
  base: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[var(--theme-color)] transition-colors',
  error: 'w-full px-4 py-3 border-2 border-red-400 rounded-xl focus:outline-none focus:border-red-500 transition-colors',
  
  // Labels
  label: 'block text-sm font-medium text-gray-700 mb-2',
  labelRequired: 'block text-sm font-medium text-gray-700 mb-2 after:content-["*"] after:text-red-500 after:ml-1',
  
  // Helper Text
  helperText: 'text-xs text-gray-500 mt-1',
  errorText: 'text-xs text-red-500 mt-1',
};

// ==================== ICONS ====================

export const icon = {
  // Icon Sizes
  small: 'w-4 h-4',
  medium: 'w-5 h-5',
  large: 'w-6 h-6',
  xlarge: 'w-8 h-8',
  
  // Icon Containers (circular backgrounds)
  containerSmall: 'w-8 h-8 rounded-full flex items-center justify-center',
  container: 'w-12 h-12 rounded-full flex items-center justify-center',
  containerLarge: 'w-16 h-16 rounded-full flex items-center justify-center',
};

// ==================== LAYOUT ====================

export const layout = {
  // Page Container
  page: 'min-h-screen bg-[#F9FAFB] pb-24',
  pageContent: 'max-w-lg mx-auto px-4 py-6 space-y-6',
  
  // Constrained container (for centered mobile-first pages)
  container: 'max-w-lg mx-auto px-4',
  
  // Screen Headers - Unified header pattern for all pages
  header: 'bg-white border-b border-gray-200 sticky top-0 z-20',
  headerContent: 'max-w-lg mx-auto px-4',
  headerInner: 'flex items-center justify-between py-4',
  
  // Header elements
  headerBackButton: 'p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors',
  headerTitle: 'font-semibold text-gray-900',
  headerAction: 'p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors',
  headerSpacer: 'w-9', // For centering title when no action button
  
  // Spacing
  section: 'space-y-6',
  sectionSmall: 'space-y-4',
  sectionTight: 'space-y-2',
  
  // Flex layouts
  flexBetween: 'flex items-center justify-between',
  flexCenter: 'flex items-center justify-center',
  flexStart: 'flex items-center',
};

// ==================== UTILITY ====================

export const utility = {
  // Transitions
  transition: 'transition-all duration-200',
  transitionFast: 'transition-all duration-150',
  transitionSlow: 'transition-all duration-300',
  
  // Shadows
  shadowSm: 'shadow-sm',
  shadow: 'shadow-md',
  shadowLg: 'shadow-lg',
  
  // Hover effects
  hoverScale: 'hover:scale-[1.02] transition-transform',
  hoverOpacity: 'hover:opacity-80 transition-opacity',
  hoverShadow: 'hover:shadow-md transition-shadow',
};