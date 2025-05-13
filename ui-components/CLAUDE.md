# CLAUDE.md - UI Components System

## 1. Overview
The UI Components system provides a comprehensive library of reusable interface elements for the Cooper Educational Platform. These components maintain consistent styling, behavior, and accessibility across the platform while allowing for contextual variations. This document outlines the component architecture, usage patterns, and integration points.

## 2. Component Architecture

### 2.1 Component Hierarchy
```
UI Components
├── Core Components
│   ├── Buttons
│   ├── Cards
│   ├── Forms
│   ├── Inputs
│   ├── Modals
│   ├── Navigation
│   └── Typography
│
├── Course Components
│   ├── Course Card
│   ├── Course Header
│   ├── Lesson Navigation
│   ├── Lesson Content Blocks
│   └── Course Progress Indicator
│
├── Quiz Components
│   ├── Quiz Timer
│   ├── Question Types
│   │   ├── Multiple Choice
│   │   ├── True/False
│   │   ├── Matching
│   │   ├── Fill-in-the-blank
│   │   └── Coding Question
│   ├── Quiz Navigation
│   └── Results Display
│
├── Profile Components
│   ├── Achievement Badge
│   ├── Progress Charts
│   ├── Certificate Display
│   └── Profile Header
│
└── Pattern Components
    ├── Knowledge Visualization
    ├── Achievement Patterns
    ├── Progress Indicators
    └── Pattern Animations
```

### 2.2 Component Structure
Each component follows a consistent structure:
- **HTML Structure**: Semantic markup defining the component
- **CSS Styling**: BEM-based classes for styling
- **JavaScript Behavior**: Optional enhanced functionality
- **Pattern Integration**: Visual pattern enhancement where applicable

## 3. Core Components

### 3.1 Button Component
```html
<button class="btn btn--primary">
  <span class="btn__text">Button Text</span>
</button>
```

**CSS Classes:**
- `btn`: Base button styling
- `btn--primary`, `btn--secondary`, `btn--success`, `btn--danger`: Button variants
- `btn--large`, `btn--small`: Size variants
- `btn--icon`: Icon button variant
- `btn--loading`: Loading state

**JavaScript Integration:**
- Loading state management
- Ripple effect on click
- Disabled state handling

### 3.2 Card Component
```html
<div class="card">
  <div class="card__header">
    <h3 class="card__title">Card Title</h3>
  </div>
  <div class="card__body">
    <p>Card content goes here...</p>
  </div>
  <div class="card__footer">
    <button class="btn btn--primary">Action</button>
  </div>
</div>
```

**CSS Classes:**
- `card`: Base card styling
- `card--elevated`: Adds shadow for elevation
- `card--interactive`: Adds hover state for clickable cards
- `card--featured`: Highlighted card style
- `card--pattern`: Includes a background pattern

**Pattern Integration:**
- Background pattern through CSS
- Pattern opacity based on card state or content

### 3.3 Form Components
```html
<form class="form">
  <div class="form__group">
    <label for="example" class="form__label">Label</label>
    <input type="text" id="example" class="form__input" />
    <p class="form__help">Help text</p>
  </div>
  <div class="form__controls">
    <button type="submit" class="btn btn--primary">Submit</button>
  </div>
</form>
```

**CSS Classes:**
- `form`: Base form styling
- `form__group`: Input group container
- `form__label`: Form label styling
- `form__input`: Input field styling
- `form__help`: Help text styling
- `form__error`: Error message styling
- `form--inline`: Inline form variant

**JavaScript Integration:**
- Form validation
- Error message display
- Input masking where needed

## 4. Course Components

### 4.1 Course Card Component
```html
<div class="course-card" data-course-id="course-123">
  <div class="course-card__image">
    <img src="path/to/image.jpg" alt="Course Name">
    <div class="course-card__difficulty">Intermediate</div>
  </div>
  <div class="course-card__content">
    <h3 class="course-card__title">Course Title</h3>
    <p class="course-card__description">Brief description of the course...</p>
    <div class="course-card__meta">
      <span class="course-card__duration">4 weeks</span>
      <span class="course-card__lessons">12 lessons</span>
    </div>
  </div>
  <div class="course-card__footer">
    <div class="course-card__progress">
      <div class="progress-bar">
        <div class="progress-bar__fill" style="width: 25%"></div>
      </div>
      <span class="progress-bar__text">25% Complete</span>
    </div>
    <button class="btn btn--primary">Continue</button>
  </div>
</div>
```

**CSS Classes:**
- `course-card`: Base course card styling
- `course-card__image`: Course image container
- `course-card__difficulty`: Difficulty badge
- `course-card__content`: Content container
- `course-card__meta`: Metadata container
- `course-card__progress`: Progress indicator

**JavaScript Integration:**
- Course data binding via data-service.js
- Progress updates via progress-tracker.js
- Navigation to course-detail.html on click

**Pattern Integration:**
- Course subject pattern as card background
- Progress visualization in progress bar

### 4.2 Lesson Content Block Components
Various content block types for lessons:

**Text Block:**
```html
<div class="content-block content-block--text">
  <h2 class="content-block__title">Section Title</h2>
  <div class="content-block__content">
    <p>Text content goes here...</p>
  </div>
</div>
```

**Image Block:**
```html
<div class="content-block content-block--image">
  <figure class="content-block__figure">
    <img src="path/to/image.jpg" alt="Image description" class="content-block__image">
    <figcaption class="content-block__caption">Image caption</figcaption>
  </figure>
</div>
```

**Video Block:**
```html
<div class="content-block content-block--video">
  <div class="content-block__video-container">
    <video class="content-block__video" controls>
      <source src="path/to/video.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </div>
  <p class="content-block__caption">Video caption</p>
</div>
```

**Code Block:**
```html
<div class="content-block content-block--code">
  <div class="code-editor" data-language="javascript">
    <div class="code-editor__header">
      <span class="code-editor__language">JavaScript</span>
      <button class="code-editor__run-btn">Run</button>
    </div>
    <pre class="code-editor__pre"><code class="code-editor__code">function example() {
  console.log("Hello world");
}</code></pre>
    <div class="code-editor__output hidden">
      <div class="code-editor__output-header">Output:</div>
      <pre class="code-editor__output-content"></pre>
    </div>
  </div>
</div>
```

**Interactive Block:**
```html
<div class="content-block content-block--interactive" data-interaction-type="drag-drop">
  <h3 class="content-block__title">Drag and Drop Exercise</h3>
  <div class="content-block__instruction">Match the items on the left with their definitions on the right.</div>
  <div class="drag-drop" id="drag-drop-1">
    <!-- Drag-drop content rendered by interaction-engine.js -->
  </div>
</div>
```

**JavaScript Integration:**
- Text blocks: Syntax highlighting for inline code
- Image blocks: Lightbox for enlarged view
- Video blocks: Custom video player controls
- Code blocks: Syntax highlighting and execution via code-editor.js
- Interactive blocks: Powered by interaction-engine.js

## 5. Quiz Components

### 5.1 Multiple Choice Question Component
```html
<div class="quiz-question quiz-question--multiple-choice" data-question-id="q1">
  <h3 class="quiz-question__prompt">Question text goes here?</h3>
  
  <div class="quiz-question__options">
    <div class="option-group">
      <input type="radio" name="q1" id="q1-option-a" value="0" class="option-group__input">
      <label for="q1-option-a" class="option-group__label">Option A</label>
    </div>
    <div class="option-group">
      <input type="radio" name="q1" id="q1-option-b" value="1" class="option-group__input">
      <label for="q1-option-b" class="option-group__label">Option B</label>
    </div>
    <div class="option-group">
      <input type="radio" name="q1" id="q1-option-c" value="2" class="option-group__input">
      <label for="q1-option-c" class="option-group__label">Option C</label>
    </div>
    <div class="option-group">
      <input type="radio" name="q1" id="q1-option-d" value="3" class="option-group__input">
      <label for="q1-option-d" class="option-group__label">Option D</label>
    </div>
  </div>
  
  <div class="quiz-question__feedback hidden">
    <div class="feedback feedback--success">
      <p>Correct! Option B is the right answer.</p>
      <p>Explanation text goes here...</p>
    </div>
  </div>
</div>
```

**CSS Classes:**
- `quiz-question`: Base question styling
- `quiz-question--multiple-choice`: Question type variant
- `option-group`: Option container
- `option-group__input`: Input element
- `option-group__label`: Label styling
- `quiz-question__feedback`: Feedback container
- `feedback--success`, `feedback--error`: Feedback variants

**JavaScript Integration:**
- Option selection handling
- Answer validation via quiz-handler.js
- Feedback display based on correctness
- Question state persistence

### 5.2 Coding Question Component
```html
<div class="quiz-question quiz-question--coding" data-question-id="q3">
  <h3 class="quiz-question__prompt">Write a function that returns the square of a number.</h3>
  
  <div class="quiz-question__code-editor">
    <div class="code-editor" data-language="javascript">
      <div class="code-editor__header">
        <span class="code-editor__language">JavaScript</span>
        <button class="code-editor__run-btn">Run</button>
        <button class="code-editor__reset-btn">Reset</button>
      </div>
      <pre class="code-editor__pre"><code class="code-editor__code">function square(num) {
  // Your code here
}</code></pre>
      <div class="code-editor__output hidden">
        <div class="code-editor__output-header">Output:</div>
        <pre class="code-editor__output-content"></pre>
      </div>
    </div>
  </div>
  
  <div class="quiz-question__test-cases">
    <h4>Test Cases:</h4>
    <ul class="test-cases">
      <li class="test-case">
        <code>square(5)</code> should return <code>25</code>
        <span class="test-case__status"></span>
      </li>
      <li class="test-case">
        <code>square(-3)</code> should return <code>9</code>
        <span class="test-case__status"></span>
      </li>
    </ul>
  </div>
  
  <div class="quiz-question__feedback hidden">
    <!-- Feedback shown after submission -->
  </div>
</div>
```

**JavaScript Integration:**
- Code editor powered by code-editor.js
- Test case execution and validation
- Syntax highlighting and code formatting
- Code execution in sandboxed environment

## 6. Profile Components

### 6.1 Achievement Badge Component
```html
<div class="achievement-badge" data-achievement-id="achievement-123">
  <div class="achievement-badge__icon">
    <svg class="achievement-badge__svg">
      <!-- SVG pattern integration -->
      <use xlink:href="#achievement-pattern"></use>
    </svg>
    <img src="assets/images/achievement.svg" alt="" class="achievement-badge__image">
  </div>
  <div class="achievement-badge__info">
    <h4 class="achievement-badge__title">Achievement Title</h4>
    <p class="achievement-badge__description">Achievement description text...</p>
    <div class="achievement-badge__date">Earned on Jan 15, 2025</div>
  </div>
</div>
```

**CSS Classes:**
- `achievement-badge`: Base badge styling
- `achievement-badge__icon`: Icon container
- `achievement-badge__info`: Text information
- `achievement-badge--locked`: Locked state styling
- `achievement-badge--highlighted`: Highlight styling for new achievements

**JavaScript Integration:**
- Achievement data binding via data-service.js
- Pattern integration via pattern-visualizer.js
- Unlock animation for newly earned achievements

**Pattern Integration:**
- SVG pattern as badge background
- Pattern animation on hover or unlock

### 6.2 Progress Chart Component
```html
<div class="progress-chart">
  <h3 class="progress-chart__title">Course Progress</h3>
  
  <div class="progress-chart__container">
    <div class="progress-chart__labels">
      <div class="progress-chart__label">HTML & CSS</div>
      <div class="progress-chart__label">JavaScript</div>
      <div class="progress-chart__label">React</div>
      <div class="progress-chart__label">Node.js</div>
    </div>
    
    <div class="progress-chart__bars">
      <div class="progress-chart__bar">
        <div class="progress-chart__fill" style="width: 80%"></div>
        <span class="progress-chart__value">80%</span>
      </div>
      <div class="progress-chart__bar">
        <div class="progress-chart__fill" style="width: 65%"></div>
        <span class="progress-chart__value">65%</span>
      </div>
      <div class="progress-chart__bar">
        <div class="progress-chart__fill" style="width: 45%"></div>
        <span class="progress-chart__value">45%</span>
      </div>
      <div class="progress-chart__bar">
        <div class="progress-chart__fill" style="width: 20%"></div>
        <span class="progress-chart__value">20%</span>
      </div>
    </div>
  </div>
</div>
```

**CSS Classes:**
- `progress-chart`: Base chart styling
- `progress-chart__container`: Chart container
- `progress-chart__bar`: Individual bar
- `progress-chart__fill`: Progress fill element

**JavaScript Integration:**
- Progress data binding via progress-manager.js
- Animated progress transitions
- Dynamic updates when progress changes

**Pattern Integration:**
- Fill patterns reflect course subject matter
- Pattern density changes with progress level

## 7. Pattern Components

### 7.1 Knowledge Pattern Integration
```html
<div class="knowledge-pattern" data-pattern="knowledge">
  <svg class="knowledge-pattern__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
    <!-- Pattern content from assets/patterns/knowledge.svg -->
    <defs>
      <pattern id="knowledge-dots" patternUnits="userSpaceOnUse" width="20" height="20">
        <!-- Pattern definition -->
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#knowledge-dots)" />
  </svg>
  
  <div class="knowledge-pattern__content">
    <!-- Content overlaid on pattern -->
  </div>
</div>
```

**CSS Classes:**
- `knowledge-pattern`: Base pattern container
- `knowledge-pattern__svg`: SVG container
- `knowledge-pattern__content`: Content overlay
- `knowledge-pattern--animated`: Adds animation to pattern

**JavaScript Integration:**
- Pattern manipulation via pattern-visualizer.js
- Progress-based pattern transformation
- Dynamic pattern color and opacity adjustments

### 7.2 Achievement Pattern Integration
```html
<div class="achievement-pattern" data-achievement-id="achievement-123">
  <svg class="achievement-pattern__svg" viewBox="0 0 100 100">
    <!-- Pattern from assets/patterns/achievement.svg -->
  </svg>
  
  <div class="achievement-pattern__icon">
    <img src="assets/images/achievement-icon.svg" alt="">
  </div>
  
  <div class="achievement-pattern__info">
    <!-- Achievement information -->
  </div>
</div>
```

**JavaScript Integration:**
- Pattern animation on achievement unlock
- Progression effects as user earns related achievements
- Pattern coloration based on achievement category

## 8. Component Usage Guidelines

### 8.1 Component Structure Best Practices
- Use semantic HTML elements appropriate to the component
- Maintain consistent class naming using BEM methodology
- Keep JavaScript functionality modular and separate from markup
- Ensure all components are accessible (ARIA attributes, keyboard navigation)
- Test components across different screen sizes

### 8.2 Extending Components
When extending existing components:
1. Start with the base component structure
2. Add or modify classes following BEM naming
3. Enhance with additional JavaScript as needed
4. Update CSS for visual modifications
5. Document new variants in component documentation

### 8.3 Creating New Components
When creating new components:
1. Follow the existing component pattern
2. Use BEM naming consistent with other components
3. Ensure accessibility from the start
4. Create responsive variants as needed
5. Document the new component structure and usage

## 9. Component Dependencies and Integration

### 9.1 HTML Template Integration
Components are integrated into HTML templates through include patterns:
```html
<div class="course-list">
  <!-- Course card component repeated for each course -->
  {{#each courses}}
    {{> course-card course=this}}
  {{/each}}
</div>
```

### 9.2 CSS Integration
Component styles are organized in the CSS system:
- Base component styles in `_components.css`
- Component variants in specific files (e.g., `_course-components.css`)
- Utility classes used across components in `_utilities.css`

### 9.3 JavaScript Behavior Integration
Component behaviors are implemented through:
- Event listeners attached to component elements
- Component-specific modules (e.g., `quiz-handler.js` for quiz components)
- Shared utilities for common functionality

## 10. Performance and Accessibility Considerations

### 10.1 Performance
- Use CSS for animations where possible
- Minimize DOM manipulations in JavaScript
- Lazy load components that are off-screen
- Optimize SVG patterns for performance

### 10.2 Accessibility
- Include appropriate ARIA roles and attributes
- Ensure keyboard navigability for all interactive components
- Maintain sufficient color contrast for all states
- Provide text alternatives for visual elements
- Test with screen readers and accessibility tools

## 11. Component Testing Strategy

### 11.1 Visual Testing
- Test component rendering across browsers
- Verify responsive behavior at all breakpoints
- Ensure consistent appearance in light and dark modes

### 11.2 Functional Testing
- Test interactive behaviors (clicks, hovers, etc.)
- Verify state changes and animations
- Test keyboard navigation and screen reader functionality

### 11.3 Integration Testing
- Verify components work correctly within templates
- Test data binding with actual content
- Ensure proper integration with related components