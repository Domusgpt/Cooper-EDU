# CLAUDE.md - JavaScript Directory

## 1. Overview
The JavaScript directory contains all the client-side functionality for the Cooper Educational Platform. These modules work together to create an interactive, dynamic learning experience, handling everything from data fetching to quiz assessment, progress tracking, and pattern visualization.

## 2. Module Structure
- **main.js**: Entry point that initializes the application and loads required modules
- **data-service.js**: Core service for fetching and managing data from JSON files
- **course-catalog.js**: Handles rendering and interaction with the course catalog
- **course-navigator.js**: Manages course navigation and structure
- **lesson-content.js**: Renders and manages interactive lesson content
- **quiz-system.js**: Comprehensive quiz management system
- **quiz-handler.js**: Handles quiz submission and evaluation
- **code-editor.js**: Provides interactive code editing capabilities
- **progress-tracker.js**: Tracks and persists user learning progress
- **progress-manager.js**: Manages progress data and achievement unlocking
- **profile-manager.js**: Handles user profile data and preferences
- **pattern-visualizer.js**: Visualizes learning patterns based on progress
- **pattern-integration.js**: Integrates patterns into the UI
- **interaction-engine.js**: Powers interactive learning elements

## 3. Module Interactions

### Initialization Flow
```
main.js
├── Initializes data-service.js
├── Sets up event listeners
└── Loads page-specific modules based on current route
    ├── index.html → course-catalog.js
    ├── course-detail.html → course-navigator.js
    ├── lesson.html → lesson-content.js, progress-tracker.js
    ├── quiz.html → quiz-system.js, quiz-handler.js
    └── profile.html → profile-manager.js, progress-manager.js
```

### Data Flow
```
data-service.js
├── Fetches data from JSON files
├── Provides data to other modules
│
course-catalog.js
├── Receives course data
├── Renders course cards
│
course-navigator.js
├── Receives course structure
├── Builds navigation tree
│
lesson-content.js
├── Receives lesson data
├── Renders content blocks
├── Integrates interactive elements
│
quiz-system.js
├── Receives quiz questions
└── Handles user responses
```

### Progress & Achievement System
```
progress-tracker.js
├── Tracks user interactions
├── Records completion status
│
progress-manager.js
├── Evaluates progress against criteria
├── Triggers achievement unlocks
│
pattern-visualizer.js
└── Updates visual patterns based on progress
```

## 4. Module Detailed Specifications

### data-service.js
- **Purpose**: Central data management service
- **Exports**:
  - `fetchCourses()`: Returns all courses
  - `fetchCourse(id)`: Returns specific course data
  - `fetchLessons(courseId)`: Returns lessons for a course
  - `fetchQuiz(id)`: Returns quiz data
  - `fetchAchievements()`: Returns all achievements
- **Dependencies**: None
- **Usage**:
  ```javascript
  import { fetchCourse, fetchLessons } from './data-service.js';
  
  async function loadCourseData(courseId) {
    const course = await fetchCourse(courseId);
    const lessons = await fetchLessons(courseId);
    // Process course and lessons
  }
  ```

### course-navigator.js
- **Purpose**: Manages course navigation and structure
- **Exports**:
  - `initNavigator(courseId)`: Initializes the navigator
  - `navigateToLesson(lessonId)`: Navigates to a specific lesson
  - `markLessonComplete(lessonId)`: Marks a lesson as complete
- **Dependencies**: data-service.js, progress-tracker.js
- **Events**:
  - `lessonChange`: Fired when navigating to a new lesson
  - `courseComplete`: Fired when all lessons are complete
- **Usage**:
  ```javascript
  import { initNavigator } from './course-navigator.js';
  
  // In course-detail.html
  document.addEventListener('DOMContentLoaded', () => {
    const courseId = new URLSearchParams(window.location.search).get('id');
    initNavigator(courseId);
  });
  ```

### quiz-system.js
- **Purpose**: Comprehensive quiz management system
- **Exports**:
  - `initQuiz(quizId)`: Sets up a quiz
  - `submitQuiz()`: Processes quiz submission
  - `navigateQuestion(direction)`: Navigates between questions
- **Dependencies**: data-service.js, quiz-handler.js, progress-tracker.js
- **Events**:
  - `quizStart`: Fired when a quiz begins
  - `quizComplete`: Fired when a quiz is submitted
  - `questionNavigation`: Fired when navigating between questions
- **Usage**:
  ```javascript
  import { initQuiz, submitQuiz } from './quiz-system.js';
  
  // In quiz.html
  document.addEventListener('DOMContentLoaded', () => {
    const quizId = new URLSearchParams(window.location.search).get('id');
    initQuiz(quizId);
    
    document.querySelector('#submit-quiz').addEventListener('click', submitQuiz);
  });
  ```

### pattern-visualizer.js
- **Purpose**: Visualizes learning patterns based on progress
- **Exports**:
  - `initPatternVisualizer(elementId, patternUrl)`: Initializes pattern
  - `updatePattern(progressData)`: Updates pattern based on progress
  - `animatePattern(type)`: Animates pattern for feedback
- **Dependencies**: progress-tracker.js
- **Usage**:
  ```javascript
  import { initPatternVisualizer, updatePattern } from './pattern-visualizer.js';
  
  // Initialize pattern on certificate element
  initPatternVisualizer('certificate-display', 'assets/patterns/certificate.svg');
  
  // Update pattern when progress changes
  progress.addEventListener('update', (progressData) => {
    updatePattern(progressData);
  });
  ```

## 5. Event System
The platform uses a custom event system for communication between modules:

```javascript
// Publishing an event
const progressEvent = new CustomEvent('progressUpdate', {
  detail: { lessonId: 'lesson-1', complete: true }
});
document.dispatchEvent(progressEvent);

// Subscribing to an event
document.addEventListener('progressUpdate', (event) => {
  const { lessonId, complete } = event.detail;
  // Handle progress update
});
```

## 6. Code Standards

### Naming Conventions
- Module names: kebab-case (e.g., `course-navigator.js`)
- Functions: camelCase (e.g., `initNavigator()`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_QUIZ_TIME`)
- Classes: PascalCase (e.g., `class QuizManager`)
- Private variables/methods: prefixed with underscore (e.g., `_processingData`)

### Coding Style
- ES6+ JavaScript with modules
- Async/await for asynchronous operations
- Functional programming approaches where appropriate
- Object-oriented design for complex components

### Documentation
- JSDoc comments for all exported functions
- Inline comments for complex logic
- Module-level documentation at the top of each file

## 7. Integration Guidelines

### Adding New Features
1. Identify the appropriate module or create a new one
2. Import dependencies and reuse existing services
3. Export clearly defined functions/classes
4. Connect to data sources via data-service.js
5. Use the event system for cross-module communication
6. Update this documentation when adding significant functionality

### Testing
- Test new modules in isolation before integration
- Ensure event listeners are properly registered and unregistered
- Verify data flow through the application
- Test across different browsers and devices

## 8. Performance Considerations
- Lazy load modules when possible
- Cache data from network requests
- Debounce event handlers for frequent events
- Use efficient DOM operations (DocumentFragment, etc.)
- Optimize animations for smooth performance

## 9. Security Best Practices
- Sanitize all user inputs before processing
- Avoid eval() and other unsafe practices
- Secure storage of user data (prefer Web Storage APIs)
- Implement proper error handling and fail gracefully