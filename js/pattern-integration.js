/**
 * Pattern Integration Module
 * 
 * Manages the visual patterns used across the platform for:
 * - Knowledge visualization
 * - Achievement markers
 * - Progress indicators
 * - Course and lesson identity
 */

/**
 * Initialize the pattern integration
 * @param {Object} appState - The global application state
 */
function initPatternIntegration(appState) {
  console.log('Initializing Pattern Integration...');
  
  // Apply patterns to all pattern elements on the page
  applyPatterns(appState);
  
  // Initialize pattern visualization if on a lesson page
  if (window.location.pathname.includes('lesson.html')) {
    initPatternVisualization(appState);
  }
}

/**
 * Apply patterns to all pattern elements on the page
 * @param {Object} appState - The global application state
 */
function applyPatterns(appState) {
  // Apply patterns to course cards
  applyCoursePatterns(appState);
  
  // Apply patterns to learning path cards
  applyLearningPathPatterns(appState);
  
  // Apply patterns to lesson elements
  applyLessonPatterns(appState);
  
  // Apply patterns to achievement cards
  applyAchievementPatterns(appState);
}

/**
 * Apply patterns to course cards
 * @param {Object} appState - The global application state
 */
function applyCoursePatterns(appState) {
  const coursePatternElements = document.querySelectorAll('.course-card__pattern');
  
  coursePatternElements.forEach(element => {
    // Get course ID from parent element
    const courseCard = element.closest('.course-card');
    if (!courseCard) {
      return;
    }
    
    const courseLink = courseCard.querySelector('a[href*="course-detail.html"]');
    if (!courseLink) {
      return;
    }
    
    const courseIdMatch = courseLink.getAttribute('href').match(/id=(\d+)/);
    if (!courseIdMatch) {
      return;
    }
    
    const courseId = courseIdMatch[1];
    
    // Find course data
    const course = appState.courseData.find(c => c.id.toString() === courseId);
    if (!course) {
      return;
    }
    
    // Apply pattern based on course data
    applyPattern(element, course.pattern);
  });
}

/**
 * Apply patterns to learning path cards
 * @param {Object} appState - The global application state
 */
function applyLearningPathPatterns(appState) {
  const pathPatternElements = document.querySelectorAll('.learning-path-card__pattern');
  
  pathPatternElements.forEach(element => {
    // Get course ID from parent element
    const pathCard = element.closest('.learning-path-card');
    if (!pathCard) {
      return;
    }
    
    const courseLink = pathCard.querySelector('a[href*="course-detail.html"]');
    if (!courseLink) {
      return;
    }
    
    const courseIdMatch = courseLink.getAttribute('href').match(/id=(\d+)/);
    if (!courseIdMatch) {
      return;
    }
    
    const courseId = courseIdMatch[1];
    
    // Find course data
    const course = appState.courseData.find(c => c.id.toString() === courseId);
    if (!course) {
      return;
    }
    
    // Apply pattern based on course data
    applyPattern(element, course.pattern);
  });
}

/**
 * Apply patterns to lesson elements
 * @param {Object} appState - The global application state
 */
function applyLessonPatterns(appState) {
  // Apply pattern to course info in sidebar
  const courseInfoPattern = document.querySelector('.course-info__pattern');
  if (courseInfoPattern) {
    // Get course ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('course');
    
    if (courseId) {
      // Find course data
      const course = appState.courseData.find(c => c.id.toString() === courseId);
      if (course) {
        // Apply pattern based on course data
        applyPattern(courseInfoPattern, course.pattern);
      }
    }
  }
  
  // Apply pattern to lesson header
  const lessonPattern = document.querySelector('.lesson-pattern');
  if (lessonPattern) {
    // Get lesson ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('course');
    const lessonId = urlParams.get('lesson');
    
    if (courseId && lessonId) {
      // Find lesson data
      const lesson = appState.lessonData.find(
        l => l.courseId.toString() === courseId && l.id.toString() === lessonId
      );
      
      if (lesson) {
        // Apply pattern based on lesson data
        applyPattern(lessonPattern, lesson.pattern);
      }
    }
  }
}

/**
 * Apply patterns to achievement cards
 * @param {Object} appState - The global application state
 */
function applyAchievementPatterns(appState) {
  const achievementPatterns = document.querySelectorAll('.achievement-card__pattern');
  
  achievementPatterns.forEach(element => {
    // Get achievement ID from parent element
    const achievementCard = element.closest('.achievement-card');
    if (!achievementCard) {
      return;
    }
    
    // Get achievement ID from data attribute
    const achievementId = achievementCard.dataset.achievementId;
    if (!achievementId) {
      return;
    }
    
    // Find achievement data
    const achievement = appState.achievementData.find(a => a.id.toString() === achievementId);
    if (!achievement) {
      return;
    }
    
    // Apply pattern based on achievement data
    applyPattern(element, achievement.pattern);
  });
}

/**
 * Apply a pattern to an element
 * @param {HTMLElement} element - The element to apply the pattern to
 * @param {string} patternId - The ID of the pattern to apply
 */
function applyPattern(element, patternId) {
  if (!element || !patternId) {
    return;
  }
  
  // In a real app, this would use SVG patterns from assets/patterns/
  // For now, we'll use CSS gradients as placeholders
  
  // Map pattern IDs to CSS gradients
  const patternStyles = {
    pattern1: 'repeating-linear-gradient(45deg, #4361ee, #4361ee 10px, #738dff 10px, #738dff 20px)',
    pattern2: 'repeating-linear-gradient(-45deg, #ff5e78, #ff5e78 10px, #ff8a9a 10px, #ff8a9a 20px)',
    pattern3: 'repeating-linear-gradient(90deg, #4caf50, #4caf50 10px, #66bb6a 10px, #66bb6a 20px)',
    pattern4: 'repeating-linear-gradient(to right, #ffb74d, #ffb74d 10px, #ffc77d 10px, #ffc77d 20px)',
    pattern5: 'repeating-linear-gradient(to bottom, #03a9f4, #03a9f4 10px, #29b6f6 10px, #29b6f6 20px)',
    pattern6: 'repeating-radial-gradient(circle at 10px 10px, #f44336, #f44336 5px, #ef5350 5px, #ef5350 10px)',
    pattern7: 'repeating-radial-gradient(circle at 10px 10px, #9c27b0, #9c27b0 5px, #ab47bc 5px, #ab47bc 10px)',
    pattern8: 'repeating-radial-gradient(circle at 10px 10px, #2196f3, #2196f3 5px, #42a5f5 5px, #42a5f5 10px)',
    pattern9: 'repeating-radial-gradient(circle at 10px 10px, #009688, #009688 5px, #26a69a 5px, #26a69a 10px)',
    pattern10: 'repeating-radial-gradient(circle at 10px 10px, #ff9800, #ff9800 5px, #ffa726 5px, #ffa726 10px)'
  };
  
  // Apply the pattern
  const patternStyle = patternStyles[patternId];
  if (patternStyle) {
    element.style.backgroundImage = patternStyle;
  } else {
    // Default pattern
    element.style.backgroundImage = 'linear-gradient(to right, #4361ee, #738dff)';
  }
}

/**
 * Initialize pattern visualization in lessons
 * @param {Object} appState - The global application state
 */
function initPatternVisualization(appState) {
  const visualizationContainer = document.querySelector('.pattern-visualization__container');
  
  if (!visualizationContainer) {
    return;
  }
  
  // Get lesson ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('course');
  const lessonId = urlParams.get('lesson');
  
  if (!courseId || !lessonId) {
    return;
  }
  
  // Find lesson data
  const lesson = appState.lessonData.find(
    l => l.courseId.toString() === courseId && l.id.toString() === lessonId
  );
  
  if (!lesson) {
    return;
  }
  
  // Create visualization based on lesson content
  createPatternVisualization(visualizationContainer, lesson, appState);
}

/**
 * Create a pattern visualization for a lesson
 * @param {HTMLElement} container - The container element
 * @param {Object} lesson - The lesson data
 * @param {Object} appState - The global application state
 */
function createPatternVisualization(container, lesson, appState) {
  // Clear the container
  container.innerHTML = '';
  
  // For this example, we'll create a simple pattern visualization
  // In a real app, this would be more sophisticated and customized to the lesson content
  
  // Get course data
  const course = appState.courseData.find(c => c.id === lesson.courseId);
  
  if (!course) {
    return;
  }
  
  // Create a heading
  const heading = document.createElement('h3');
  heading.textContent = 'Knowledge Pattern Visualization';
  container.appendChild(heading);
  
  // Create a description
  const description = document.createElement('p');
  description.textContent = 'This visualization represents the key concepts from this lesson.';
  container.appendChild(description);
  
  // Create the visualization
  const visualization = document.createElement('div');
  visualization.className = 'pattern-visualization__graphic';
  container.appendChild(visualization);
  
  // Create pattern elements based on lesson content
  // This is a simplified example - a real app would analyze the lesson content
  // to determine the most important concepts and their relationships
  
  // For now, we'll create a simple pattern with circles representing key concepts
  const conceptCount = Math.min(5, lesson.content.length);
  
  for (let i = 0; i < conceptCount; i++) {
    const concept = document.createElement('div');
    concept.className = 'concept-node';
    
    // Position the concept in a circular pattern
    const angle = (i / conceptCount) * Math.PI * 2;
    const radius = 120;
    const x = Math.cos(angle) * radius + radius;
    const y = Math.sin(angle) * radius + radius;
    
    concept.style.left = `${x}px`;
    concept.style.top = `${y}px`;
    
    // Apply a pattern
    applyPattern(concept, lesson.pattern);
    
    // Add a label
    const label = document.createElement('div');
    label.className = 'concept-label';
    label.textContent = `Concept ${i + 1}`;
    concept.appendChild(label);
    
    // Add to visualization
    visualization.appendChild(concept);
  }
  
  // Create connections between concepts
  for (let i = 0; i < conceptCount; i++) {
    for (let j = i + 1; j < conceptCount; j++) {
      // Only connect some concepts to avoid overcrowding
      if (Math.random() > 0.6) {
        continue;
      }
      
      const connection = document.createElement('div');
      connection.className = 'concept-connection';
      
      // Position the connection
      const angle1 = (i / conceptCount) * Math.PI * 2;
      const angle2 = (j / conceptCount) * Math.PI * 2;
      const radius = 120;
      
      const x1 = Math.cos(angle1) * radius + radius;
      const y1 = Math.sin(angle1) * radius + radius;
      const x2 = Math.cos(angle2) * radius + radius;
      const y2 = Math.sin(angle2) * radius + radius;
      
      // Calculate angle and length
      const connectionAngle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
      const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      
      // Apply styles
      connection.style.width = `${length}px`;
      connection.style.left = `${x1}px`;
      connection.style.top = `${y1}px`;
      connection.style.transform = `rotate(${connectionAngle}deg)`;
      
      // Add to visualization
      visualization.appendChild(connection);
    }
  }
  
  // Add some styles for the visualization
  const style = document.createElement('style');
  style.textContent = `
    .pattern-visualization__graphic {
      position: relative;
      width: 100%;
      height: 300px;
      margin-top: var(--spacing-4);
    }
    
    .concept-node {
      position: absolute;
      width: 60px;
      height: 60px;
      border-radius: var(--radius-full);
      display: flex;
      justify-content: center;
      align-items: center;
      transform: translate(-50%, -50%);
      box-shadow: var(--shadow-md);
      cursor: pointer;
      transition: transform var(--transition-fast) ease, box-shadow var(--transition-fast) ease;
    }
    
    .concept-node:hover {
      transform: translate(-50%, -50%) scale(1.1);
      box-shadow: var(--shadow-lg);
    }
    
    .concept-label {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: var(--spacing-2);
      white-space: nowrap;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }
    
    .concept-connection {
      position: absolute;
      height: 2px;
      background-color: var(--color-gray-400);
      transform-origin: left center;
    }
  `;
  
  document.head.appendChild(style);
}

// Export functions
export { 
  initPatternIntegration,
  applyPatterns,
  createPatternVisualization
};