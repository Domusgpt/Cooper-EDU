# CLAUDE.md - CSS Architecture Guide

This file provides guidance to Claude Code (claude.ai/code) when working with the CSS architecture in this repository.

## CSS Architecture Overview

The Cooper Leadership Academy platform uses a modern, modular CSS architecture based on a design system approach with CSS variables and component-based styling. The system is built to be maintainable, scalable, and consistent across the entire platform.

### File Structure and Import Order

Files should be imported in the following order to ensure proper cascade and inheritance:

1. `modern-variables.css` - Contains all design tokens and CSS variables
2. `modern-typography.css` - Typography system and text utilities
3. `modern-components.css` - UI component styles
4. `modern-layout.css` - Layout systems and utilities
5. `modern-style.css` - The main stylesheet that imports all others and contains page-specific styles

### Design Token Management

All design values should be stored as CSS variables in `modern-variables.css` and referenced throughout the other files. Never hard-code values in component styles that should be derived from the design system.

## Core Files and Responsibilities

### modern-variables.css

This file serves as the single source of truth for all design tokens, including:

- Color palettes (primary, secondary, neutrals, status colors)
- Typography settings (font families, font sizes, line heights, letter spacing)
- Spacing scales
- Border radiuses
- Shadow definitions
- Z-index levels
- Breakpoint definitions

When adding new design tokens:
1. Group related tokens together
2. Use consistent naming patterns (e.g., `--color-primary-500`)
3. Include appropriate comments for complex tokens
4. Consider dark mode variants when relevant

### modern-typography.css

This file defines:
- Base typography settings
- Heading styles
- Text utilities
- Special text elements (blockquotes, code, etc.)
- Responsive typography adjustments

When modifying typography:
1. Ensure the typographic scale remains consistent
2. Test changes across different viewport sizes
3. Maintain appropriate contrast ratios for accessibility

### modern-components.css

This file contains discrete UI component styles:
- Buttons, forms, cards, navigation elements, etc.
- Component variations and states
- Each component should be self-contained without side effects

When adding or modifying components:
1. Create BEM-style class names (`.component__element--modifier`)
2. Use CSS variables for all visual properties
3. Include hover, focus, and active states for interactive elements
4. Add responsive behavior as needed
5. Test components in isolation and in context

### modern-layout.css

This file defines:
- Grid systems
- Flexbox utilities
- Spacing utilities
- Container definitions
- Responsive breakpoint behavior

When modifying layout styles:
1. Maintain consistent spacing using variables
2. Ensure that layouts are responsive
3. Test layouts with real content

### modern-style.css

This file serves as:
- The main entry point that imports all other CSS files
- Contains page-specific styles and overrides
- Implements dark mode and other global theme variations

## Integration Points

### HTML Integration

The CSS system is designed to be used with semantic HTML. When implementing new pages:

1. Begin with semantic HTML structure
2. Apply layout classes to define the page structure
3. Add component classes for UI elements
4. Use utility classes sparingly for fine adjustments

Example pattern:
```html
<main class="container py-8">
  <div class="grid grid--gap-lg">
    <div class="grid-col-12 grid-col-lg-8">
      <div class="card p-6">
        <h2 class="text-2xl font-bold mb-6">Section Title</h2>
        <!-- Component content here -->
      </div>
    </div>
  </div>
</main>
```

### JavaScript Integration

The CSS system is designed to work with the JavaScript modules in the platform:

1. Use data attributes for JS hooks instead of styling classes
2. JavaScript should toggle classes rather than manipulating styles directly
3. Animation states should be defined in CSS and toggled by JS

## Usage and Extension Guidelines

### Adding New Components

When adding new components:
1. First check if an existing component can be extended/modified
2. Create the component styles in `modern-components.css`
3. Use the existing design tokens from `modern-variables.css`
4. Follow the established naming conventions
5. Document the component usage in comments

### Page-Specific Styles

For page-specific styles:
1. Add them to the bottom of `modern-style.css` under a clearly labeled section
2. Use specificity carefully to avoid overriding global styles unintentionally
3. Consider if the styles could be abstracted into a reusable component

### Responsive Design

All styles should follow a mobile-first approach:
1. Define base styles for mobile
2. Add media queries for larger viewports
3. Use the breakpoint variables defined in `modern-variables.css`
4. Test all changes across the full range of screen sizes

### Dark Mode

Dark mode is implemented using CSS variables and media queries:
1. Define dark mode color variants in `modern-variables.css`
2. Use `@media (prefers-color-scheme: dark)` for automatic switching
3. Test all UI components in both light and dark modes

## Best Practices

1. **Simplicity** - Favor simple, explicit styles over complex, nested selectors
2. **Consistency** - Reuse design tokens and follow established patterns
3. **Accessibility** - Ensure sufficient color contrast and support for assistive technologies
4. **Performance** - Minimize specificity, avoid duplicated rules, and consider file size
5. **Maintainability** - Comment complex code and follow the established architecture

## Common Tasks

When implementing new page designs:
1. Start with semantic HTML structure
2. Apply layout components (grid, container)
3. Add UI components
4. Apply typography classes
5. Test responsive behavior
6. Verify accessibility
7. Check dark mode appearance

## Platform-Specific Styling Considerations

### Leadership Content Styling

For leadership-focused content:
1. Use the nature-inspired color palette for calming, trustworthy appearance
2. Implement professional typography with adequate white space
3. Ensure all interactive elements have clear affordances
4. Use subtle animations to enhance engagement without distraction