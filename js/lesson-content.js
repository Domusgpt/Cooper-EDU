/**
 * Lesson Content Module
 * 
 * Handles the rendering and interactivity of lesson content:
 * - Loading lesson data
 * - Rendering different content types (text, code, interactive elements)
 * - Managing interactive components
 */

import { getFullLessonData } from './data-service.js';
import { initCodeEditor } from './code-editor.js';

/**
 * Initialize lesson content
 * @param {Object} appState - The global application state
 */
async function initLessonContent(appState) {
  try {
    console.log('Initializing Lesson Content...');
    
    // Get lesson and course IDs from URL
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('course');
    const lessonId = urlParams.get('lesson');
    
    if (!courseId || !lessonId) {
      throw new Error('Missing course ID or lesson ID in URL');
    }
    
    // Show loading indicator
    showLessonLoading();
    
    // Load lesson data
    const lessonData = await getFullLessonData(courseId, lessonId);
    
    // Render lesson content
    renderLessonContent(lessonData);
    
    // Initialize interactive elements
    initInteractiveElements(lessonData);
    
    // Update navigation
    updateLessonNavigation(lessonData);
    
    // Update lesson header
    updateLessonHeader(lessonData);
    
    // Hide loading indicator
    hideLessonLoading();
  } catch (error) {
    console.error('Error initializing lesson content:', error);
    showLessonError('Failed to load lesson content. Please try again later.');
  }
}

/**
 * Show lesson loading indicator
 */
function showLessonLoading() {
  const lessonContent = document.querySelector('.lesson-body');
  
  if (!lessonContent) {
    return;
  }
  
  lessonContent.innerHTML = `
    <div class="lesson-loading">
      <div class="lesson-loading__spinner"></div>
      <p>Loading lesson content...</p>
    </div>
  `;
  
  // Add some styles
  const style = document.createElement('style');
  style.textContent = `
    .lesson-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-8);
      text-align: center;
    }
    
    .lesson-loading__spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--color-gray-200);
      border-top: 4px solid var(--color-primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: var(--spacing-4);
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  
  document.head.appendChild(style);
}

/**
 * Hide lesson loading indicator
 */
function hideLessonLoading() {
  const loadingElement = document.querySelector('.lesson-loading');
  
  if (loadingElement) {
    loadingElement.remove();
  }
}

/**
 * Show lesson error message
 * @param {string} message - The error message to display
 */
function showLessonError(message) {
  const lessonContent = document.querySelector('.lesson-body');
  
  if (!lessonContent) {
    return;
  }
  
  lessonContent.innerHTML = `
    <div class="lesson-error">
      <div class="lesson-error__icon">⚠️</div>
      <p class="lesson-error__message">${message}</p>
      <button class="button button--primary reload-button">Reload</button>
    </div>
  `;
  
  // Add some styles
  const style = document.createElement('style');
  style.textContent = `
    .lesson-error {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-8);
      text-align: center;
      background-color: var(--bg-secondary);
      border-radius: var(--radius-lg);
    }
    
    .lesson-error__icon {
      font-size: 48px;
      margin-bottom: var(--spacing-4);
    }
    
    .lesson-error__message {
      margin-bottom: var(--spacing-4);
    }
  `;
  
  document.head.appendChild(style);
  
  // Add event listener to reload button
  const reloadButton = lessonContent.querySelector('.reload-button');
  if (reloadButton) {
    reloadButton.addEventListener('click', () => {
      window.location.reload();
    });
  }
}

/**
 * Render lesson content
 * @param {Object} lessonData - The lesson data
 */
function renderLessonContent(lessonData) {
  const lessonContent = document.querySelector('.lesson-body');
  
  if (!lessonContent) {
    console.error('Lesson content element not found');
    return;
  }
  
  // Clear existing content
  lessonContent.innerHTML = '';
  
  // If no content, show message
  if (!lessonData.content || lessonData.content.length === 0) {
    lessonContent.innerHTML = '<p>No content available for this lesson.</p>';
    return;
  }
  
  // Process each content item
  lessonData.content.forEach(item => {
    const section = document.createElement('section');
    section.className = 'lesson-section';
    
    // Process content based on type
    switch (item.type) {
      case 'text':
        section.innerHTML = item.content;
        break;
        
      case 'key-point':
        section.innerHTML = `
          <div class="key-point">
            <div class="key-point__icon"></div>
            <div class="key-point__content">
              <h3>${item.title || 'Key Point'}</h3>
              <p>${item.content}</p>
            </div>
          </div>
        `;
        break;
        
      case 'code':
        section.innerHTML = `
          <div class="code-example">
            <h3>${item.title || 'Example'}</h3>
            <pre><code class="language-${item.language || 'html'}">${item.content}</code></pre>
          </div>
        `;
        break;
        
      case 'interactive-code':
        const editorContainer = document.createElement('div');
        editorContainer.className = 'interactive-element interactive-code-editor';
        editorContainer.dataset.language = item.language || 'html';
        
        editorContainer.innerHTML = `
          <h3>${item.description || 'Try it yourself'}</h3>
          <textarea class="code-editor__starter-code" style="display: none;">${item.starterCode || ''}</textarea>
        `;
        
        section.appendChild(editorContainer);
        break;
        
      case 'interactive-matching':
        section.innerHTML = `
          <div class="interactive-element interactive-matching-game">
            <h3>${item.title || 'Matching Game'}</h3>
            <p>${item.description || 'Match the items on the left with their corresponding items on the right.'}</p>
            <div class="matching-game">
              <div class="matching-game__container" data-pairs='${JSON.stringify(item.pairs)}'>
                <div class="matching-game__placeholder">Interactive matching game will appear here</div>
              </div>
            </div>
          </div>
        `;
        break;
        
      case 'check-understanding':
        section.innerHTML = `
          <div class="question-container">
            <div class="question">
              <p>${item.question}</p>
              <div class="options">
                ${item.options.map((option, index) => `
                  <label class="option">
                    <input type="radio" name="question-${item.id || index}" value="${index}">
                    <span class="option__text">${option}</span>
                  </label>
                `).join('')}
              </div>
            </div>
            <div class="question-feedback" style="display: none;">
              <div class="question-feedback__correct">
                <p>${item.feedback?.correct || 'Correct!'}</p>
              </div>
              <div class="question-feedback__incorrect">
                <p>${item.feedback?.incorrect || 'Not quite. Try again!'}</p>
              </div>
            </div>
          </div>
        `;
        break;
        
      case 'table':
        section.innerHTML = `
          <div class="table-container">
            <table class="content-table">
              <thead>
                <tr>
                  ${item.headers.map(header => `<th>${header}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${item.rows.map(row => `
                  <tr>
                    ${row.map(cell => `<td>${cell}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
        break;
        
      default:
        section.innerHTML = `<p>Unknown content type: ${item.type}</p>`;
    }
    
    // Add the section to the content
    lessonContent.appendChild(section);
  });
  
  // Add lesson summary section if not already present
  if (!document.querySelector('.lesson-summary')) {
    const summarySection = document.createElement('section');
    summarySection.className = 'lesson-summary';
    summarySection.innerHTML = `
      <h2>Summary</h2>
      <ul class="summary-list">
        ${generateSummaryItems(lessonData).map(item => `<li>${item}</li>`).join('')}
      </ul>
      
      <div class="pattern-visualization">
        <div class="pattern-visualization__container">
          <div class="pattern-visualization__placeholder">Knowledge visualization pattern will appear here</div>
        </div>
      </div>
    `;
    
    lessonContent.appendChild(summarySection);
  }
}

/**
 * Generate summary items based on lesson content
 * @param {Object} lessonData - The lesson data
 * @returns {Array} The summary items
 */
function generateSummaryItems(lessonData) {
  // In a real app, this would analyze the lesson content to extract key points
  // For now, we'll return some placeholder items
  
  const title = lessonData.title || 'This Lesson';
  
  return [
    `${title} covers fundamental concepts for this subject`,
    'You learned how to apply these concepts in practical scenarios',
    'You practiced with interactive examples and exercises',
    'You can now proceed to the next lesson to continue learning'
  ];
}

/**
 * Initialize interactive elements in the lesson
 * @param {Object} lessonData - The lesson data
 */
function initInteractiveElements(lessonData) {
  // Initialize code editors
  const codeEditors = document.querySelectorAll('.interactive-code-editor');
  codeEditors.forEach(editor => {
    const language = editor.dataset.language || 'html';
    const codeElement = editor.querySelector('.code-editor__starter-code');
    const startingCode = codeElement ? codeElement.value : '';
    
    initCodeEditor(editor, {
      language,
      startingCode,
      autoRun: false,
      height: '200px'
    });
  });
  
  // Initialize matching games
  // This would be handled by the interaction-engine.js
  
  // Initialize check understanding questions
  initCheckUnderstandingQuestions(lessonData);
}

/**
 * Initialize check understanding questions
 * @param {Object} lessonData - The lesson data
 */
function initCheckUnderstandingQuestions(lessonData) {
  const questions = document.querySelectorAll('.question-container');
  
  questions.forEach((questionContainer, index) => {
    const options = questionContainer.querySelectorAll('.option input');
    const feedback = questionContainer.querySelector('.question-feedback');
    
    if (!options.length || !feedback) {
      return;
    }
    
    // Find the corresponding question in lesson data
    let correctAnswer = 0;
    
    if (lessonData.content) {
      const checkQuestions = lessonData.content.filter(item => item.type === 'check-understanding');
      if (checkQuestions[index]) {
        correctAnswer = checkQuestions[index].correctAnswer;
      }
    }
    
    // Add event listener to each option
    options.forEach(option => {
      option.addEventListener('change', () => {
        // Check if the correct option was chosen
        const isCorrect = parseInt(option.value) === correctAnswer;
        
        // Show feedback
        feedback.style.display = 'block';
        
        const correctFeedback = feedback.querySelector('.question-feedback__correct');
        const incorrectFeedback = feedback.querySelector('.question-feedback__incorrect');
        
        if (correctFeedback && incorrectFeedback) {
          correctFeedback.style.display = isCorrect ? 'block' : 'none';
          incorrectFeedback.style.display = isCorrect ? 'none' : 'block';
        }
      });
    });
  });
}

/**
 * Update lesson navigation based on lesson data
 * @param {Object} lessonData - The lesson data
 */
function updateLessonNavigation(lessonData) {
  const navigationButtons = document.querySelector('.lesson-navigation-buttons');
  
  if (!navigationButtons) {
    return;
  }
  
  const prevButton = navigationButtons.querySelector('a:first-child');
  const nextButton = navigationButtons.querySelector('a:last-child');
  
  // Update previous button
  if (prevButton && lessonData.previousLesson) {
    prevButton.href = `lesson.html?course=${lessonData.course.id}&lesson=${lessonData.previousLesson.id}`;
    prevButton.textContent = `Previous: ${lessonData.previousLesson.title}`;
    prevButton.style.display = 'inline-flex';
  } else if (prevButton) {
    prevButton.style.display = 'none';
  }
  
  // Update next button
  if (nextButton && lessonData.nextLesson) {
    nextButton.href = `lesson.html?course=${lessonData.course.id}&lesson=${lessonData.nextLesson.id}`;
    nextButton.textContent = `Next: ${lessonData.nextLesson.title}`;
    nextButton.style.display = 'inline-flex';
  } else if (nextButton) {
    nextButton.textContent = 'Complete Course';
    nextButton.href = `course-detail.html?id=${lessonData.course.id}`;
  }
}

/**
 * Update lesson header with lesson data
 * @param {Object} lessonData - The lesson data
 */
function updateLessonHeader(lessonData) {
  const lessonTitle = document.querySelector('.lesson-title');
  const lessonNumber = document.querySelector('.lesson-number');
  const lessonDuration = document.querySelector('.lesson-duration');
  
  if (lessonTitle) {
    lessonTitle.textContent = lessonData.title;
  }
  
  if (lessonNumber) {
    lessonNumber.textContent = `Lesson ${lessonData.number}`;
  }
  
  if (lessonDuration) {
    lessonDuration.textContent = formatDuration(lessonData.duration);
  }
  
  // Update course info in sidebar
  updateSidebarCourseInfo(lessonData);
  
  // Update active lesson in sidebar
  updateSidebarActiveLessonInfo(lessonData);
}

/**
 * Update sidebar course info
 * @param {Object} lessonData - The lesson data
 */
function updateSidebarCourseInfo(lessonData) {
  const courseTitle = document.querySelector('.course-info__title');
  const courseProgress = document.querySelector('.progress-bar__fill');
  const courseProgressText = document.querySelector('.progress-bar__text');
  
  if (courseTitle) {
    courseTitle.textContent = lessonData.course.title;
  }
  
  if (courseProgress && lessonData.course.progress !== undefined) {
    courseProgress.style.width = `${lessonData.course.progress}%`;
  }
  
  if (courseProgressText && lessonData.course.progress !== undefined) {
    courseProgressText.textContent = `${lessonData.course.progress}% Complete`;
  }
}

/**
 * Update sidebar active lesson info
 * @param {Object} lessonData - The lesson data
 */
function updateSidebarActiveLessonInfo(lessonData) {
  const lessonItems = document.querySelectorAll('.lesson-list__item');
  
  lessonItems.forEach(item => {
    // Remove active class
    item.classList.remove('lesson-list__item--active');
    
    // Check if this item corresponds to the current lesson
    const link = item.querySelector('a');
    if (link && link.href.includes(`lesson=${lessonData.id}`)) {
      item.classList.add('lesson-list__item--active');
    }
  });
}

/**
 * Format duration in minutes to human-readable format
 * @param {number} minutes - The duration in minutes
 * @returns {string} The formatted duration
 */
function formatDuration(minutes) {
  if (!minutes) {
    return 'N/A';
  }
  
  if (minutes < 60) {
    return `${minutes} minutes`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} min`;
    }
  }
}

// Export functions
export {
  initLessonContent
};