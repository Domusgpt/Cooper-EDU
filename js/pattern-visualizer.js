/**
 * Pattern Visualizer Module
 * 
 * Creates and manages visual patterns for knowledge representation:
 * - Generates SVG patterns for courses, lessons, and achievements
 * - Visualizes knowledge domains and connections
 * - Creates interactive pattern visualizations
 */

/**
 * Initialize pattern visualization
 * @param {Object} appState - The global application state
 */
function initPatternVisualizer(appState) {
  console.log('Initializing Pattern Visualizer...');
  
  // Apply patterns to all elements with pattern classes
  applyPatternsToElements();
  
  // Initialize knowledge visualization if on lesson page
  if (window.location.pathname.includes('lesson.html')) {
    initKnowledgeVisualization(appState);
  }
}

/**
 * Apply patterns to all elements with pattern attributes
 */
function applyPatternsToElements() {
  // Find all elements with data-pattern attribute
  const patternElements = document.querySelectorAll('[data-pattern]');
  
  patternElements.forEach(element => {
    const patternId = element.dataset.pattern;
    applyPattern(element, patternId);
  });
}

/**
 * Apply a pattern to an element
 * @param {HTMLElement} element - The element to apply the pattern to
 * @param {string} patternId - The ID of the pattern
 */
function applyPattern(element, patternId) {
  if (!element || !patternId) {
    return;
  }
  
  // Create pattern style
  const patternStyle = generatePatternStyle(patternId);
  
  // Apply style to element
  element.style.backgroundImage = patternStyle;
}

/**
 * Generate a pattern style based on pattern ID
 * @param {string} patternId - The ID of the pattern
 * @returns {string} CSS background style
 */
function generatePatternStyle(patternId) {
  // In a real application, this would use SVG patterns from files
  // For now, we'll use CSS gradients as placeholder patterns
  
  // Map pattern IDs to gradients
  const patterns = {
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
  
  return patterns[patternId] || 'linear-gradient(to right, #4361ee, #738dff)';
}

/**
 * Initialize knowledge visualization
 * @param {Object} appState - The global application state
 */
function initKnowledgeVisualization(appState) {
  // Get visualization container
  const container = document.querySelector('.pattern-visualization__container');
  
  if (!container) {
    return;
  }
  
  // Get lesson data from URL
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('course');
  const lessonId = urlParams.get('lesson');
  
  if (!courseId || !lessonId) {
    return;
  }
  
  // Find lesson and course data
  const lessonData = appState.lessonData.find(
    lesson => lesson.courseId.toString() === courseId && lesson.id.toString() === lessonId
  );
  
  const courseData = appState.courseData.find(
    course => course.id.toString() === courseId
  );
  
  if (!lessonData || !courseData) {
    return;
  }
  
  // Create visualization
  createKnowledgeVisualization(container, lessonData, courseData, appState);
}

/**
 * Create a knowledge visualization
 * @param {HTMLElement} container - The container for the visualization
 * @param {Object} lessonData - The lesson data
 * @param {Object} courseData - The course data
 * @param {Object} appState - The global application state
 */
function createKnowledgeVisualization(container, lessonData, courseData, appState) {
  // Clear container
  container.innerHTML = '';
  
  // Create heading
  const heading = document.createElement('h3');
  heading.textContent = 'Knowledge Map';
  heading.className = 'pattern-visualization__heading';
  container.appendChild(heading);
  
  // Create description
  const description = document.createElement('p');
  description.textContent = 'This visualization represents the key concepts from this lesson and how they relate to the overall course.';
  description.className = 'pattern-visualization__description';
  container.appendChild(description);
  
  // Create visualization element
  const visualization = document.createElement('div');
  visualization.className = 'knowledge-visualization';
  container.appendChild(visualization);
  
  // Create course node
  const courseNode = document.createElement('div');
  courseNode.className = 'knowledge-node knowledge-node--course';
  courseNode.textContent = courseData.title;
  courseNode.style.top = '20px';
  courseNode.style.left = '50%';
  visualization.appendChild(courseNode);
  
  // Apply pattern to course node
  applyPattern(courseNode, courseData.pattern);
  
  // Extract concept nodes from lesson content
  const concepts = extractConcepts(lessonData);
  
  // Create concept nodes
  concepts.forEach((concept, index) => {
    const angle = ((index / concepts.length) * Math.PI) + (Math.PI / 4);
    const radius = 150;
    const x = Math.cos(angle) * radius + 50;
    const y = Math.sin(angle) * radius + 150;
    
    const conceptNode = document.createElement('div');
    conceptNode.className = 'knowledge-node knowledge-node--concept';
    conceptNode.textContent = concept;
    conceptNode.style.top = `${y}px`;
    conceptNode.style.left = `${x}%`;
    visualization.appendChild(conceptNode);
    
    // Apply pattern to concept node
    applyPattern(conceptNode, lessonData.pattern);
    
    // Create connection between course and concept
    createConnection(visualization, 50, 20, x, y, courseData.pattern);
  });
  
  // Create connections between related concepts
  for (let i = 0; i < concepts.length; i++) {
    for (let j = i + 1; j < concepts.length; j++) {
      // Only create connections between some concepts (not all to avoid clutter)
      if (Math.random() > 0.7) {
        continue;
      }
      
      const angle1 = ((i / concepts.length) * Math.PI) + (Math.PI / 4);
      const angle2 = ((j / concepts.length) * Math.PI) + (Math.PI / 4);
      const radius = 150;
      
      const x1 = Math.cos(angle1) * radius + 50;
      const y1 = Math.sin(angle1) * radius + 150;
      const x2 = Math.cos(angle2) * radius + 50;
      const y2 = Math.sin(angle2) * radius + 150;
      
      createConnection(visualization, x1, y1, x2, y2, lessonData.pattern);
    }
  }
  
  // Add styles for visualization
  addVisualizationStyles();
}

/**
 * Create a connection between two points
 * @param {HTMLElement} container - The container for the connection
 * @param {number} x1 - The x coordinate of the first point
 * @param {number} y1 - The y coordinate of the first point
 * @param {number} x2 - The x coordinate of the second point
 * @param {number} y2 - The y coordinate of the second point
 * @param {string} patternId - The pattern ID for the connection
 */
function createConnection(container, x1, y1, x2, y2, patternId) {
  const connection = document.createElement('div');
  connection.className = 'knowledge-connection';
  
  // Calculate distance and angle
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Position and rotate connection
  connection.style.width = `${distance}px`;
  connection.style.left = `${x1}%`;
  connection.style.top = `${y1}px`;
  connection.style.transform = `rotate(${angle}deg)`;
  
  // Apply pattern
  applyPattern(connection, patternId);
  
  container.appendChild(connection);
}

/**
 * Extract concepts from lesson content
 * @param {Object} lessonData - The lesson data
 * @returns {Array} Extracted concepts
 */
function extractConcepts(lessonData) {
  // In a real application, this would analyze the lesson content
  // and extract key concepts. For now, we'll use placeholder concepts.
  
  // Get topic from lesson title
  const topic = lessonData.title;
  
  // Generate concepts based on topic
  const concepts = [];
  
  if (topic.includes('HTML')) {
    concepts.push('Structure', 'Elements', 'Attributes', 'Semantics', 'Accessibility');
  } else if (topic.includes('CSS')) {
    concepts.push('Selectors', 'Properties', 'Values', 'Box Model', 'Layout');
  } else if (topic.includes('JavaScript')) {
    concepts.push('Variables', 'Functions', 'Objects', 'Events', 'DOM');
  } else if (topic.includes('Data')) {
    concepts.push('Analysis', 'Visualization', 'Statistics', 'Patterns', 'Insights');
  } else if (topic.includes('Design')) {
    concepts.push('User Experience', 'Interface', 'Wireframing', 'Prototyping', 'Usability');
  } else {
    // Default concepts
    concepts.push('Concept 1', 'Concept 2', 'Concept 3', 'Concept 4', 'Concept 5');
  }
  
  return concepts;
}

/**
 * Add styles for visualization
 */
function addVisualizationStyles() {
  // Check if styles already exist
  if (document.getElementById('knowledge-visualization-styles')) {
    return;
  }
  
  const style = document.createElement('style');
  style.id = 'knowledge-visualization-styles';
  style.textContent = `
    .knowledge-visualization {
      position: relative;
      width: 100%;
      height: 350px;
      margin-top: var(--spacing-4);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      overflow: hidden;
      background-color: var(--bg-secondary);
    }
    
    .knowledge-node {
      position: absolute;
      transform: translate(-50%, -50%);
      padding: var(--spacing-2) var(--spacing-3);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      color: var(--color-white);
      box-shadow: var(--shadow-md);
      cursor: pointer;
      transition: transform var(--transition-fast) ease, box-shadow var(--transition-fast) ease;
      z-index: 2;
      text-align: center;
      min-width: 80px;
    }
    
    .knowledge-node:hover {
      transform: translate(-50%, -50%) scale(1.1);
      box-shadow: var(--shadow-lg);
    }
    
    .knowledge-node--course {
      padding: var(--spacing-2) var(--spacing-4);
      font-weight: var(--font-weight-bold);
      border-radius: var(--radius-lg);
      min-width: 120px;
    }
    
    .knowledge-connection {
      position: absolute;
      height: 2px;
      background-color: var(--color-gray-400);
      transform-origin: left center;
      z-index: 1;
      opacity: 0.6;
    }
    
    .pattern-visualization__heading {
      margin-bottom: var(--spacing-2);
    }
    
    .pattern-visualization__description {
      margin-bottom: var(--spacing-4);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }
  `;
  
  document.head.appendChild(style);
}

/**
 * Create a pattern legend for the lesson
 * @param {Object} appState - The global application state
 */
function createPatternLegend(appState) {
  // Get legend container
  const container = document.querySelector('.pattern-legend');
  
  if (!container) {
    return;
  }
  
  // Clear container
  container.innerHTML = '';
  
  // Create heading
  const heading = document.createElement('h3');
  heading.textContent = 'Pattern Legend';
  container.appendChild(heading);
  
  // Create description
  const description = document.createElement('p');
  description.textContent = 'Each pattern represents a different knowledge domain or skill area.';
  description.className = 'pattern-legend__description';
  container.appendChild(description);
  
  // Create pattern grid
  const grid = document.createElement('div');
  grid.className = 'pattern-legend__grid';
  container.appendChild(grid);
  
  // Add pattern items
  const patterns = [
    { id: 'pattern1', name: 'HTML & Structure' },
    { id: 'pattern2', name: 'CSS & Styling' },
    { id: 'pattern3', name: 'JavaScript & Interactivity' },
    { id: 'pattern4', name: 'Data & Analysis' },
    { id: 'pattern5', name: 'Design & UX' },
    { id: 'pattern6', name: 'Tools & Workflow' }
  ];
  
  patterns.forEach(pattern => {
    const item = document.createElement('div');
    item.className = 'pattern-legend__item';
    
    const swatch = document.createElement('div');
    swatch.className = 'pattern-legend__swatch';
    applyPattern(swatch, pattern.id);
    
    const name = document.createElement('span');
    name.className = 'pattern-legend__name';
    name.textContent = pattern.name;
    
    item.appendChild(swatch);
    item.appendChild(name);
    grid.appendChild(item);
  });
  
  // Add styles for legend
  const style = document.createElement('style');
  style.textContent = `
    .pattern-legend {
      margin-top: var(--spacing-8);
      padding: var(--spacing-4);
      background-color: var(--bg-secondary);
      border-radius: var(--radius-lg);
    }
    
    .pattern-legend__description {
      margin-bottom: var(--spacing-4);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }
    
    .pattern-legend__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: var(--spacing-3);
    }
    
    .pattern-legend__item {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }
    
    .pattern-legend__swatch {
      width: 20px;
      height: 20px;
      border-radius: var(--radius-sm);
    }
    
    .pattern-legend__name {
      font-size: var(--font-size-sm);
    }
  `;
  
  document.head.appendChild(style);
}

/**
 * Create an achievement visualization
 * @param {Object} appState - The global application state
 */
function createAchievementVisualization(appState) {
  // Get container
  const container = document.querySelector('.achievement-visualization');
  
  if (!container) {
    return;
  }
  
  // Clear container
  container.innerHTML = '';
  
  // Create heading
  const heading = document.createElement('h3');
  heading.textContent = 'Achievement Progress';
  container.appendChild(heading);
  
  // Get earned achievements
  const earnedAchievementIds = appState.userProgress.achievements || [];
  const allAchievements = appState.achievementData || [];
  
  // Calculate progress
  const progressPercentage = Math.round((earnedAchievementIds.length / allAchievements.length) * 100);
  
  // Create progress visualization
  const progressSection = document.createElement('div');
  progressSection.className = 'achievement-visualization__progress';
  progressSection.innerHTML = `
    <div class="achievement-progress">
      <div class="achievement-progress__bar">
        <div class="achievement-progress__fill" style="width: ${progressPercentage}%"></div>
      </div>
      <div class="achievement-progress__text">${earnedAchievementIds.length}/${allAchievements.length} Achievements (${progressPercentage}%)</div>
    </div>
  `;
  container.appendChild(progressSection);
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .achievement-visualization {
      margin-top: var(--spacing-8);
      padding: var(--spacing-4);
      background-color: var(--bg-secondary);
      border-radius: var(--radius-lg);
    }
    
    .achievement-visualization__progress {
      margin-top: var(--spacing-4);
    }
    
    .achievement-progress__bar {
      height: 10px;
      background-color: var(--color-gray-300);
      border-radius: var(--radius-full);
      overflow: hidden;
      margin-bottom: var(--spacing-2);
    }
    
    .achievement-progress__fill {
      height: 100%;
      background-color: var(--color-primary);
    }
    
    .achievement-progress__text {
      text-align: center;
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }
  `;
  
  document.head.appendChild(style);
}

// Export functions
export {
  initPatternVisualizer,
  applyPatternsToElements,
  createKnowledgeVisualization,
  createPatternLegend,
  createAchievementVisualization
};