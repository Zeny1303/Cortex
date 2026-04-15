// Utility file for consistent dark mode class patterns

export const darkModeClasses = {
  // Backgrounds
  bgPrimary: 'bg-white dark:bg-black',
  bgMuted: 'bg-swiss-muted dark:bg-white/5',
  bgAccent: 'bg-swiss-accent',
  bgInverse: 'bg-black dark:bg-white',
  
  // Text colors
  textPrimary: 'text-black dark:text-white',
  textMuted: 'text-black/40 dark:text-white/40',
  textMutedHover: 'text-black/60 dark:text-white/60',
  textAccent: 'text-swiss-accent',
  textInverse: 'text-white dark:text-black',
  
  // Borders
  borderPrimary: 'border-black dark:border-white',
  borderMuted: 'border-black/10 dark:border-white/10',
  
  // Buttons
  btnPrimary: 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white hover:bg-swiss-accent hover:border-swiss-accent dark:hover:bg-swiss-accent dark:hover:border-swiss-accent dark:hover:text-white',
  btnSecondary: 'bg-white dark:bg-black text-black dark:text-white border-black dark:border-white hover:bg-swiss-muted dark:hover:bg-white/10',
  btnAccent: 'bg-swiss-accent text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black',
  
  // Hover states
  hoverBgPrimary: 'hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black',
  hoverBgMuted: 'hover:bg-swiss-muted dark:hover:bg-white/10',
  hoverBgAccent: 'hover:bg-swiss-accent hover:text-white',
  
  // Shadows
  shadowPrimary: 'shadow-[0_2px_0_0_#000] dark:shadow-[0_2px_0_0_#fff]',
};

// Helper function to combine classes
export const cn = (...classes) => classes.filter(Boolean).join(' ');
