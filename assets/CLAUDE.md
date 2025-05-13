# CLAUDE.md - Assets Directory

## 1. Overview
The assets directory contains all visual resources used throughout the Cooper Educational Platform, organized into subdirectories by type. These assets are crucial for providing visual feedback, enhancing the user interface, and implementing knowledge visualization principles.

## 2. Directory Structure
- **images/**: Contains illustrations, icons, and other visual elements
  - `achievement.svg`: Vector graphic used for achievement badges
  - `leadership-hero.svg`: Hero illustration for leadership courses
  - `leadership-icon.svg`: Icon representing leadership category
- **patterns/**: SVG patterns used for knowledge visualization and UI decoration
  - `achievement.svg`: Pattern used in achievement badges
  - `certificate.svg`: Pattern used for course completion certificates
  - `dots.svg`: Decorative dot pattern for UI backgrounds
  - `knowledge.svg`: Pattern representing knowledge acquisition

## 3. Asset Usage Guidelines

### Pattern Integration
- Patterns should be used consistently to visually represent specific concepts:
  - `dots.svg`: For backgrounds, headers, and subtle UI decoration
  - `certificate.svg`: Exclusively for certificates and credentials
  - `achievement.svg`: For achievement badges and milestone indicators
  - `knowledge.svg`: For visualizing knowledge acquisition and learning progress

### Technical Implementation
- SVG patterns should be integrated via CSS or directly in HTML:
  ```css
  .profile-header {
    background-image: url('../assets/patterns/dots.svg');
    background-size: 300px;
    background-repeat: repeat;
    background-position: center;
  }
  ```
- For dynamic pattern manipulation, use the `pattern-visualizer.js` and `pattern-integration.js` modules
- SVG patterns should maintain their vector qualities for optimal scaling
- Pattern opacity should be adjustable via CSS for layering effects

### Connection with JavaScript Modules
- The `pattern-visualizer.js` module manipulates and animates patterns based on user progress
- The `pattern-integration.js` module handles the integration of patterns into the UI
- Both modules interact with progress data to dynamically adjust patterns

## 4. Adding New Assets
When adding new assets to the platform:
1. Maintain consistent naming conventions (kebab-case for filenames)
2. Optimize SVGs for web use (remove unnecessary metadata)
3. Document the purpose and usage of the asset in this file
4. Ensure the asset is responsive and maintains quality at different scales
5. Consider accessibility implications (contrast, visual alternatives)

## 5. Image Optimization Guidelines
- SVGs should be optimized using tools like SVGO
- Raster images should be appropriately sized and compressed
- Consider using responsive image techniques for raster images
- Provide WebP alternatives where appropriate

## 6. Connection Points with Other Systems
- **CSS System**: Assets are referenced in CSS files for backgrounds, decorations, and UI elements
- **JavaScript Modules**: The pattern assets are manipulated by JS for dynamic visualization
- **HTML Templates**: Assets are integrated into templates for UI enhancement
- **Data Store**: Achievement and certificate patterns connect with data from achievements.json

## 7. Best Practices
- Keep SVGs semantically structured for potential animation
- Maintain a consistent visual language across all assets
- Document the meaning and purpose of patterns in code comments
- Ensure assets work well in both light and dark mode
- Test asset rendering across different browsers and devices