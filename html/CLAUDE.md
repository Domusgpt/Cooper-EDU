# CLAUDE.md - HTML Templates

## 1. Overview
The HTML templates serve as the structural foundation of the Cooper Educational Platform. These files define the user interface, provide semantic structure, and integrate CSS styling and JavaScript functionality. Each template is designed for a specific platform function while maintaining consistent branding and user experience.

## 2. Template Structure
- **index.html**: Main dashboard and entry point to the platform
- **course-catalog.html**: Displays available courses with filtering options
- **course-detail.html**: Shows detailed information about a specific course
- **lesson.html**: Presents lesson content with interactive elements
- **quiz.html**: Provides assessment interface with various question types
- **profile.html**: Shows user profile, progress, and achievements

## 3. Common Components

### Header Component
All pages include a consistent header with the following elements:
```html
<header class="platform-header">
  <div class="container">
    <div class="logo">
      <a href="index.html">
        <img src="assets/images/logo.svg" alt="Cooper Educational Platform">
      </a>
    </div>
    <nav class="main-nav">
      <ul>
        <li><a href="index.html">Dashboard</a></li>
        <li><a href="course-catalog.html">Courses</a></li>
        <li><a href="profile.html">My Profile</a></li>
      </ul>
    </nav>
    <div class="user-controls">
      <button class="theme-toggle" aria-label="Toggle dark mode">
        <svg><!-- SVG icon --></svg>
      </button>
      <div class="user-profile">
        <img src="assets/images/avatar.jpg" alt="User avatar">
        <span class="username">Username</span>
      </div>
    </div>
  </div>
</header>
```

### Footer Component
All pages include a consistent footer with the following elements:
```html
<footer class="platform-footer">
  <div class="container">
    <div class="footer-logo">
      <img src="assets/images/logo-footer.svg" alt="Cooper Educational Platform">
    </div>
    <div class="footer-links">
      <div class="footer-nav">
        <h4>Platform</h4>
        <ul>
          <li><a href="index.html">Dashboard</a></li>
          <li><a href="course-catalog.html">Courses</a></li>
          <li><a href="#">Help Center</a></li>
        </ul>
      </div>
      <div class="footer-nav">
        <h4>Legal</h4>
        <ul>
          <li><a href="#">Terms of Service</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Accessibility</a></li>
        </ul>
      </div>
    </div>
    <div class="copyright">
      <p>&copy; 2025 Cooper Educational Platform. All rights reserved.</p>
    </div>
  </div>
</footer>
```

## 4. Page-Specific Structure

### index.html (Dashboard)
```html
<main class="dashboard">
  <section class="hero-section">
    <!-- Dynamic hero content -->
  </section>
  
  <section class="in-progress-courses">
    <h2>Continue Learning</h2>
    <div class="course-cards-container">
      <!-- Dynamic course cards rendered by JS -->
    </div>
  </section>
  
  <section class="recommended-courses">
    <h2>Recommended For You</h2>
    <div class="course-cards-container">
      <!-- Dynamic course cards rendered by JS -->
    </div>
  </section>
  
  <section class="recent-achievements">
    <h2>Recent Achievements</h2>
    <div class="achievements-container">
      <!-- Dynamic achievements rendered by JS -->
    </div>
  </section>
</main>
```

### course-catalog.html
```html
<main class="course-catalog">
  <section class="catalog-header">
    <h1>Course Catalog</h1>
    <div class="search-filter-controls">
      <input type="text" id="search-courses" placeholder="Search courses...">
      <div class="filter-controls">
        <!-- Filter options rendered by JS -->
      </div>
    </div>
  </section>
  
  <section class="catalog-results">
    <div class="courses-grid">
      <!-- Dynamic course cards rendered by JS -->
    </div>
  </section>
  
  <div class="pagination-controls">
    <!-- Pagination rendered by JS -->
  </div>
</main>
```

### course-detail.html
```html
<main class="course-detail">
  <section class="course-header">
    <!-- Dynamic course header rendered by JS -->
  </section>
  
  <div class="course-content-container">
    <aside class="course-sidebar">
      <div class="course-info">
        <!-- Course info rendered by JS -->
      </div>
      
      <nav class="lesson-navigation">
        <!-- Dynamic lesson navigation rendered by JS -->
      </nav>
    </aside>
    
    <section class="course-main-content">
      <div class="course-description">
        <!-- Course description rendered by JS -->
      </div>
      
      <div class="course-syllabus">
        <h2>Syllabus</h2>
        <!-- Syllabus rendered by JS -->
      </div>
      
      <div class="instructor-info">
        <h2>Instructor</h2>
        <!-- Instructor info rendered by JS -->
      </div>
    </section>
  </div>
</main>
```

### lesson.html
```html
<main class="lesson-view">
  <div class="lesson-container">
    <aside class="lesson-sidebar">
      <nav class="lesson-navigation">
        <!-- Dynamic lesson navigation rendered by JS -->
      </nav>
      
      <div class="lesson-progress">
        <!-- Progress rendered by JS -->
      </div>
    </aside>
    
    <section class="lesson-content">
      <header class="lesson-header">
        <!-- Lesson header rendered by JS -->
      </header>
      
      <div class="lesson-body">
        <!-- Dynamic lesson content rendered by JS -->
      </div>
      
      <footer class="lesson-footer">
        <div class="lesson-navigation-controls">
          <button id="prev-lesson" class="btn btn-outline">Previous</button>
          <button id="next-lesson" class="btn btn-primary">Next</button>
        </div>
      </footer>
    </section>
  </div>
</main>
```

### quiz.html
```html
<main class="quiz-view">
  <div class="quiz-container">
    <header class="quiz-header">
      <!-- Quiz header rendered by JS -->
      <div class="quiz-timer" id="quiz-timer">
        <!-- Timer rendered by JS -->
      </div>
    </header>
    
    <section class="quiz-content">
      <div class="question-navigation">
        <!-- Question navigation rendered by JS -->
      </div>
      
      <div class="current-question" id="current-question">
        <!-- Current question rendered by JS -->
      </div>
    </section>
    
    <footer class="quiz-footer">
      <div class="quiz-navigation-controls">
        <button id="prev-question" class="btn btn-outline">Previous</button>
        <button id="next-question" class="btn btn-primary">Next</button>
      </div>
      
      <button id="submit-quiz" class="btn btn-success">Submit Quiz</button>
    </footer>
  </div>
</main>
```

### profile.html
```html
<main class="profile-view">
  <section class="profile-header">
    <div class="profile-info">
      <!-- Profile info rendered by JS -->
    </div>
  </section>
  
  <div class="profile-content">
    <nav class="profile-tabs">
      <ul>
        <li><button class="tab-btn active" data-tab="progress">My Progress</button></li>
        <li><button class="tab-btn" data-tab="achievements">Achievements</button></li>
        <li><button class="tab-btn" data-tab="certificates">Certificates</button></li>
        <li><button class="tab-btn" data-tab="settings">Settings</button></li>
      </ul>
    </nav>
    
    <section class="tab-content" id="progress-tab">
      <!-- Progress content rendered by JS -->
    </section>
    
    <section class="tab-content hidden" id="achievements-tab">
      <!-- Achievements rendered by JS -->
    </section>
    
    <section class="tab-content hidden" id="certificates-tab">
      <!-- Certificates rendered by JS -->
    </section>
    
    <section class="tab-content hidden" id="settings-tab">
      <!-- Settings form rendered by JS -->
    </section>
  </div>
</main>
```

## 5. JavaScript Integration
Each HTML template integrates with specific JavaScript modules:

- **index.html**: 
  - `main.js` for initialization
  - `course-catalog.js` for rendering course cards
  - `progress-manager.js` for displaying progress
  
- **course-catalog.html**:
  - `course-catalog.js` for search, filtering, and rendering courses
  
- **course-detail.html**:
  - `course-navigator.js` for course navigation
  - `progress-tracker.js` for course progress
  
- **lesson.html**:
  - `lesson-content.js` for rendering lesson content
  - `progress-tracker.js` for tracking lesson progress
  - `interaction-engine.js` for interactive elements
  
- **quiz.html**:
  - `quiz-system.js` for quiz setup and management
  - `quiz-handler.js` for processing responses
  - `code-editor.js` for coding questions
  
- **profile.html**:
  - `profile-manager.js` for profile management
  - `progress-manager.js` for displaying progress data
  - `pattern-visualizer.js` for achievement patterns

## 6. Data Integration
HTML templates connect to data through JavaScript modules:

- Course cards use `data/courses.json` via `course-catalog.js`
- Lesson content uses `data/lessons.json` via `lesson-content.js`
- Quiz questions use `data/quizzes.json` via `quiz-system.js`
- Achievement displays use `data/achievements.json` via `profile-manager.js`

## 7. Pattern Integration
SVG patterns are integrated into the HTML through:

- Background patterns via CSS 
- Dynamic pattern visualization via `pattern-visualizer.js`
- Achievement badges using pattern styles

## 8. Accessibility Guidelines
All HTML templates must adhere to these accessibility principles:

- Use semantic HTML elements (`<header>`, `<nav>`, `<main>`, etc.)
- Include appropriate ARIA attributes where needed
- Maintain proper heading hierarchy
- Ensure keyboard navigability
- Provide adequate color contrast
- Add alt text for all images
- Support screen readers with aria-labels and descriptions
- Design forms with proper labels and error handling
- Test with accessibility tools and screen readers

## 9. Responsive Design Integration
Templates integrate with CSS breakpoint systems:

- Mobile-first approach using responsive CSS
- Flexible layouts with CSS Grid and Flexbox
- Responsive navigation patterns
- Adapts to diverse screen sizes and devices

## 10. Best Practices for Template Modification
- Maintain semantic HTML structure
- Preserve class naming conventions (BEM methodology)
- Keep JavaScript integration points intact
- Follow accessibility guidelines
- Test cross-browser compatibility
- Validate HTML against W3C standards