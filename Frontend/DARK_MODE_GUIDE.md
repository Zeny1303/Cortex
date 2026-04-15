# Dark Mode Implementation Guide

## Overview
This application now supports dark and light mode with a consistent Swiss design aesthetic. The theme persists across sessions and respects user preferences.

## Features
- ✅ Manual theme toggle (Sun/Moon icon)
- ✅ Persistent theme storage (localStorage)
- ✅ System preference detection on first load
- ✅ Consistent styling across all components
- ✅ Smooth transitions between themes

## Implementation Details

### 1. Theme Context (`src/context/ThemeContext.jsx`)
Manages global theme state using React Context API:
- Checks localStorage for saved preference
- Falls back to system preference (`prefers-color-scheme`)
- Applies `dark` class to `<html>` element
- Provides `theme` and `toggleTheme` to all components

### 2. Tailwind Configuration
Updated `tailwind.config.js` with:
```javascript
darkMode: 'class'
```
This enables class-based dark mode (`.dark` prefix).

### 3. Theme Toggle Component (`src/components/ThemeToggle.jsx`)
Reusable toggle button with two variants:
- **default**: Full button with icon + text
- **minimal**: Icon-only button (used in navbar)

### 4. CSS Patterns (`src/index.css`)
Updated Swiss design patterns for dark mode:
- `.swiss-grid-pattern` - Grid lines (inverted in dark mode)
- `.swiss-dots` - Dot matrix (inverted in dark mode)
- `.swiss-diagonal` - Diagonal lines (inverted in dark mode)

## Usage in Components

### Basic Pattern
```jsx
<div className="bg-white dark:bg-black text-black dark:text-white">
  Content
</div>
```

### Borders
```jsx
<div className="border-2 border-black dark:border-white">
  Content
</div>
```

### Buttons
```jsx
<button className="bg-black dark:bg-white text-white dark:text-black
                   hover:bg-swiss-accent hover:text-white">
  Click me
</button>
```

### Muted Backgrounds
```jsx
<div className="bg-swiss-muted dark:bg-white/5">
  Content
</div>
```

### Muted Text
```jsx
<p className="text-black/40 dark:text-white/40">
  Muted text
</p>
```

## Utility Helper (`src/utils/darkModeClasses.js`)
Pre-defined class combinations for consistency:
- `bgPrimary`, `bgMuted`, `bgAccent`, `bgInverse`
- `textPrimary`, `textMuted`, `textAccent`, `textInverse`
- `borderPrimary`, `borderMuted`
- `btnPrimary`, `btnSecondary`, `btnAccent`
- `hoverBgPrimary`, `hoverBgMuted`, `hoverBgAccent`

## Components Updated
✅ App.js - Wrapped with ThemeProvider
✅ Navbar - Added theme toggle
✅ Home page - Full dark mode support
✅ Dashboard - Full dark mode support
✅ ThemeToggle - New component

## Adding Dark Mode to New Components

### Step 1: Import useTheme (optional)
```jsx
import { useTheme } from '../context/ThemeContext';
```

### Step 2: Add dark mode classes
Use Tailwind's `dark:` prefix for all color-related classes:
```jsx
<div className="bg-white dark:bg-black 
                text-black dark:text-white 
                border-black dark:border-white">
```

### Step 3: Test both modes
Toggle between light and dark mode to ensure:
- All text is readable
- Borders are visible
- Hover states work correctly
- Accent color (red) remains consistent

## Design Principles

### Colors
- **Light mode**: White background, black text, black borders
- **Dark mode**: Black background, white text, white borders
- **Accent**: `#FF3000` (red) - consistent in both modes
- **Muted backgrounds**: 
  - Light: `#F2F2F2` (swiss-muted)
  - Dark: `rgba(255,255,255,0.05)` (white/5)

### Opacity Levels
- Primary text: 100%
- Muted text: 40% opacity
- Hover text: 60% opacity
- Borders (subtle): 10% opacity

### Transitions
All color transitions use:
```css
transition-colors duration-150
```

## Testing Checklist
- [ ] Theme persists on page reload
- [ ] System preference detected on first visit
- [ ] Toggle works on all pages
- [ ] All text is readable in both modes
- [ ] Borders visible in both modes
- [ ] Hover states work correctly
- [ ] Accent color consistent
- [ ] No flash of wrong theme on load

## Browser Support
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

## Future Enhancements
- [ ] Add theme transition animations
- [ ] Add more theme options (auto/light/dark)
- [ ] Add theme-specific illustrations
- [ ] Add reduced motion support for theme transitions
