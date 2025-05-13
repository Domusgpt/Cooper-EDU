# Deployment Instructions for Interactive Learning Platform

## GitHub Pages Deployment Fix

The Interactive Learning Platform has been fixed to work correctly on GitHub Pages. The following changes were made:

### 1. Data Service Path Fix

Updated the `data-service.js` file to use relative paths instead of absolute paths:

```javascript
// Changed from:
fetch('/data/courses.json')

// Changed to:
fetch('./data/courses.json')
```

This change was applied to all data file references in the data service.

### 2. Assets and Patterns

Added SVG pattern files:
- `assets/patterns/knowledge.svg` - Used for course and lesson visualizations
- `assets/patterns/achievement.svg` - Used for achievement visualizations

### 3. Data Files 

Updated all references to pattern files in the data files:
- Changed "pattern1", "pattern2", etc. to use the actual SVG file names
- Updated in `courses.json`, `lessons.json`, `quizzes.json`, and `achievements.json`

## How to Deploy

1. **Push Changes to GitHub**
   ```bash
   git add .
   git commit -m "Fix: Update paths for GitHub Pages deployment"
   git push
   ```

2. **Enable GitHub Pages**
   - Go to https://github.com/Domusgpt/Cooper-EDU/settings/pages
   - Under "Source", select "Deploy from a branch"
   - Select "main" branch and "/" (root) folder
   - Click "Save"

3. **Access Your Site**
   After a few minutes, your site will be available at:
   https://domusgpt.github.io/Cooper-EDU/

## Troubleshooting

If you encounter any issues:

1. **404 Errors for Data Files**
   - Check the browser console for specific errors
   - Verify that data files exist in the correct locations
   - Make sure all paths in JavaScript files use relative paths (`./`)

2. **Missing SVG Patterns**
   - Ensure pattern files exist in the assets/patterns directory
   - Check that references in data files match the filenames exactly

3. **Blank Pages**
   - Look for JavaScript errors in the console
   - Try clearing browser cache and reloading

## Local Testing

To test locally before deploying to GitHub Pages:

```bash
cd /path/to/Cooper-EDU
python -m http.server
```

Then visit `http://localhost:8000` to verify everything works correctly.