# CLAUDE.md - Subsystem Architecture

## 1. Overview
This document outlines the high-level architecture of the Cooper Educational Platform, describing how the major subsystems connect and interact to create a cohesive learning experience. Understanding these connections is crucial for maintaining and extending the platform.

## 2. Subsystem Map

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                      HTML Templates                        │
│  ┌─────────┐  ┌──────────────┐  ┌─────────┐  ┌─────────┐   │
│  │ index   │  │ course-detail│  │ lesson  │  │ profile │   │
│  └─────────┘  └──────────────┘  └─────────┘  └─────────┘   │
│         │            │               │            │        │
▼─────────▼────────────▼───────────────▼────────────▼───────▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                        CSS System                          │
│  ┌─────────────┐ ┌─────────────┐  ┌─────────────────────┐  │
│  │ variables   │ │ typography  │  │ components & layout │  │
│  └─────────────┘ └─────────────┘  └─────────────────────┘  │
│         │               │                    │             │
▼─────────▼───────────────▼────────────────────▼─────────────▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    JavaScript Modules                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ data-service│ │ interactive │ │ progress    │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│         │              │                │                  │
│         ▼              ▼                ▼                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ course      │ │ quiz        │ │ pattern     │           │
│  │ modules     │ │ modules     │ │ modules     │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│         │              │                │                  │
▼─────────▼──────────────▼────────────────▼──────────────────▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                        Data Store                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ courses.json│ │ lessons.json│ │ quizzes.json│           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                             │
│  ┌─────────────────────────┐    ┌─────────────┐            │
│  │ user progress (storage) │    │ achiev.json │            │
│  └─────────────────────────┘    └─────────────┘            │
│                                                             │
▼─────────────────────────────────────────────────────────────▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                       Asset Library                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ images      │ │ icons       │ │ patterns    │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 3. Core Subsystems and Their Responsibilities

### 3.1 Presentation Layer
- **HTML Templates**: Responsible for structure and semantic markup
- **CSS System**: Responsible for styling, layout, and visual design
- Together they create the platform's user interface and experience

### 3.2 Application Layer
- **JavaScript Modules**: Handle all dynamic functionality and interactivity
- Organized by domain (course, quiz, progress, etc.)
- Communicate through a custom event system

### 3.3 Data Layer
- **JSON Data Store**: Static content and structure definitions
- **Browser Storage**: User-specific data like progress and preferences

### 3.4 Asset Layer
- **Images and Icons**: Visual elements for the interface
- **Pattern Library**: SVG patterns for knowledge visualization

## 4. Key Integration Patterns

### 4.1 Data Binding
JS modules fetch data from JSON files and bind it to HTML templates:
```javascript
// Example from course-catalog.js
async function renderCourses() {
  const courses = await fetchCourses();
  const courseContainer = document.querySelector('.course-cards-container');
  
  courses.forEach(course => {
    const courseCard = createCourseCard(course);
    courseContainer.appendChild(courseCard);
  });
}
```

### 4.2 Event-Based Communication
Modules communicate through a custom event system:
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

### 4.3 Pattern Visualization
Integration of SVG patterns with user progress:
```javascript
// Example from pattern-visualizer.js
function updatePattern(progressData) {
  const patternElement = document.querySelector('#knowledge-pattern');
  const completionPercentage = calculateCompletion(progressData);
  
  // Modify pattern opacity, scale, or color based on progress
  patternElement.style.opacity = 0.3 + (completionPercentage * 0.7);
  // Additional pattern transformations
}
```

## 5. Data Flow Diagrams

### 5.1 Course Loading Flow
```
┌──────────────┐     ┌───────────────┐     ┌─────────────────┐
│              │     │               │     │                 │
│ HTML Template│────►│ data-service.js│────►│ courses.json    │
│              │     │               │     │                 │
└──────────────┘     └───────────────┘     └─────────────────┘
       ▲                     │                      │
       │                     ▼                      │
┌──────────────┐     ┌───────────────┐             │
│              │     │               │             │
│ DOM Updates  │◄────│ course-catalog.js◄──────────┘
│              │     │               │
└──────────────┘     └───────────────┘
```

### 5.2 Quiz Assessment Flow
```
┌──────────────┐     ┌───────────────┐     ┌─────────────────┐
│              │     │               │     │                 │
│ User Input   │────►│ quiz-system.js│────►│ quiz-handler.js │
│              │     │               │     │                 │
└──────────────┘     └───────────────┘     └─────────────────┘
                             │                      │
                             ▼                      ▼
                     ┌───────────────┐     ┌─────────────────┐
                     │               │     │                 │
                     │progress-tracker.js│◄────│ Feedback Display│
                     │               │     │                 │
                     └───────────────┘     └─────────────────┘
                             │
                             ▼
                     ┌───────────────┐
                     │               │
                     │pattern-visual.js│
                     │               │
                     └───────────────┘
```

## 6. Subsystem Dependencies

### 6.1 Direct Dependencies
- HTML Templates → CSS System (styling)
- HTML Templates → JavaScript Modules (functionality)
- JavaScript Modules → Data Store (content)
- CSS System → Asset Library (visual elements)
- JavaScript Modules → Asset Library (pattern manipulation)

### 6.2 Module Dependencies
```
main.js
├── data-service.js
├── course-catalog.js
│   └── data-service.js
├── course-navigator.js
│   ├── data-service.js
│   └── progress-tracker.js
├── lesson-content.js
│   ├── data-service.js
│   ├── interaction-engine.js
│   └── pattern-integration.js
├── quiz-system.js
│   ├── data-service.js
│   ├── quiz-handler.js
│   └── code-editor.js (for coding questions)
└── profile-manager.js
    ├── data-service.js
    ├── progress-manager.js
    └── pattern-visualizer.js
```

## 7. Cross-Cutting Concerns

### 7.1 Responsive Design
All subsystems must support responsive layouts:
- HTML: Uses semantic structure
- CSS: Implements mobile-first approach with media queries
- JS: Adjusts functionality based on screen size
- Assets: Scales appropriately for different devices

### 7.2 Accessibility
All subsystems implement accessibility features:
- HTML: Semantic elements and ARIA attributes
- CSS: Sufficient contrast and focus states
- JS: Keyboard navigation and screen reader support
- Assets: Alternative text and high contrast options

### 7.3 Performance
Performance optimizations across subsystems:
- HTML: Minimal DOM depth and efficient structure
- CSS: Optimized selectors and minimal repaints
- JS: Efficient DOM operations and event handling
- Assets: Optimized SVGs and compressed images

## 8. Extension Points

### 8.1 Adding New Content Types
1. Update data schemas in JSON files
2. Extend data-service.js to support new types
3. Add rendering logic in appropriate JS modules
4. Create CSS styles for new content types
5. Update HTML templates to accommodate new types

### 8.2 Creating New Interactive Elements
1. Extend interaction-engine.js with new interaction types
2. Add supporting styles in CSS
3. Update lesson-content.js to render new interactions
4. Add data schema support in lessons.json

### 8.3 Implementing New Visual Patterns
1. Add new SVG patterns to assets/patterns/
2. Update pattern-visualizer.js to support new patterns
3. Add CSS for pattern integration
4. Update related achievements or progress indicators

## 9. Subsystem Communication Protocols

### 9.1 Data Attribute Protocol
HTML elements use data attributes for JS interaction:
```html
<div class="course-card" data-course-id="course-123" data-difficulty="intermediate">
  <!-- Course content -->
</div>
```

### 9.2 Event Naming Convention
Events follow a consistent naming pattern:
- Entity + Action (e.g., "lessonComplete", "quizSubmit")
- Entity + State (e.g., "courseLoaded", "progressUpdated")

### 9.3 Data Schema Validation
All data passing between subsystems should be validated:
```javascript
function validateCourse(course) {
  const requiredFields = ['id', 'title', 'description', 'lessons'];
  return requiredFields.every(field => course.hasOwnProperty(field));
}
```

## 10. Subsystem Testing Strategy

### 10.1 HTML & CSS Testing
- Visual regression testing across device sizes
- Accessibility audits using automated tools
- Browser compatibility testing

### 10.2 JavaScript Module Testing
- Unit tests for individual functions
- Integration tests for module interaction
- End-to-end tests for user flows

### 10.3 Data Layer Testing
- Schema validation tests
- Data integrity checks
- Performance testing with large datasets

## 11. Deployment and Integration

### 11.1 Build Process
1. Lint and test all subsystems
2. Optimize assets (minify CSS/JS, compress images)
3. Bundle modules as needed
4. Generate production build

### 11.2 Deployment Checklist
- Verify all subsystems are properly bundled
- Ensure data files are correctly formatted
- Confirm all assets are optimized
- Test critical user flows in production environment

## 12. Future Subsystem Extensions

### 12.1 Potential New Subsystems
- **User Authentication**: Login, registration, and profile management
- **Social Learning**: Collaboration features and community integration
- **Analytics Dashboard**: Learning metrics and progress insights
- **Content Management**: Tools for creating and editing courses

### 12.2 Legacy Subsystem Migration
When upgrading or replacing subsystems:
1. Maintain data compatibility
2. Create adapters for legacy interfaces
3. Implement graceful degradation
4. Provide migration utilities for user data