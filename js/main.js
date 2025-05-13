/**
 * Main JavaScript module for the Interactive Learning Platform
 * Responsible for initializing all other modules and core functionality
 */

// Import modules
import { initCourseNavigator } from './course-navigator.js';
import { initQuizSystem } from './quiz-system.js';
import { initInteractionEngine } from './interaction-engine.js';
import { loadAllData } from './data-service.js';
import { initProgressManager, loadUserProgress } from './progress-manager.js';
import { initPatternVisualizer } from './pattern-visualizer.js';

// Global state object
const appState = {
  currentUser: null,
  userProgress: {},
  courseData: [],
  lessonData: [],
  quizData: [],
  achievementData: []
};

/**
 * Initialize the application
 */
async function initApp() {
  console.log('Initializing Interactive Learning Platform...');
  
  // Show loading indicator
  showLoadingIndicator();
  
  // Load data
  try {
    // Load all data using the data service
    const data = await loadAllData();
    
    // Store data in app state
    appState.courseData = data.courses;
    appState.lessonData = data.lessons;
    appState.quizData = data.quizzes;
    appState.achievementData = data.achievements;
    
    // Load user data
    await loadUserData();
    
    // Load user progress from local storage
    await loadUserProgress(appState);
    
    // Initialize all modules
    initCourseNavigator(appState);
    initQuizSystem(appState);
    initProgressManager(appState);
    initInteractionEngine(appState);
    initPatternVisualizer(appState);
    
    // Initialize page-specific functionality
    initCurrentPage();
    
    console.log('Application initialized successfully!');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    showErrorMessage('Failed to load application data. Please refresh the page.');
  } finally {
    // Hide loading indicator
    hideLoadingIndicator();
  }
}

/**
 * Load user data and progress
 * In a real application, this would fetch from a backend service
 */
async function loadUserData() {
  // Mock user data for development (would come from authentication system in production)
  appState.currentUser = {
    id: 'user123',
    name: 'Demo User',
    email: 'demo@example.com'
  };
  
  // Mock user progress (would come from backend/database in production)
  appState.userProgress = {
    completedLessons: [1, 2],
    courseProgress: {
      1: 65, // Web Development Fundamentals - 65% complete
      2: 30  // Data Science Essentials - 30% complete
    },
    quizScores: {
      1: 85 // HTML & CSS Fundamentals quiz - score 85%
    },
    achievements: [1, 5, 8] // Achievement IDs that the user has earned
  };
  
  // This is where we would make an API call to get user data
  // For now, we'll just simulate a network delay
  return new Promise((resolve) => {
    setTimeout(resolve, 300);
  });
}

/**
 * Show application loading indicator
 */
function showLoadingIndicator() {
  // Create loading element if it doesn't exist
  let loader = document.getElementById('app-loader');
  
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'app-loader';
    loader.className = 'app-loader';
    loader.innerHTML = `
      <div class="app-loader__content">
        <div class="app-loader__spinner"></div>
        <p>Loading...</p>
      </div>
    `;
    
    // Add some styles
    const style = document.createElement('style');
    style.textContent = `
      .app-loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
      }
      
      .app-loader__content {
        text-align: center;
      }
      
      .app-loader__spinner {
        width: 50px;
        height: 50px;
        border: 5px solid var(--color-gray-200);
        border-top: 5px solid var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto var(--spacing-4);
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(loader);
  } else {
    loader.style.display = 'flex';
  }
}

/**
 * Hide application loading indicator
 */
function hideLoadingIndicator() {
  const loader = document.getElementById('app-loader');
  if (loader) {
    loader.style.display = 'none';
  }
}

/**
 * Show error message to user
 * @param {string} message - The error message to display
 */
function showErrorMessage(message) {
  // Create error element
  const errorElement = document.createElement('div');
  errorElement.className = 'app-error';
  errorElement.innerHTML = `
    <div class="app-error__content">
      <div class="app-error__icon">⚠️</div>
      <p>${message}</p>
      <button class="button button--primary app-error__button">Refresh</button>
    </div>
  `;
  
  // Add some styles
  const style = document.createElement('style');
  style.textContent = `
    .app-error {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
    
    .app-error__content {
      background-color: var(--bg-primary);
      border-radius: var(--radius-lg);
      padding: var(--spacing-6);
      max-width: 500px;
      text-align: center;
      box-shadow: var(--shadow-lg);
    }
    
    .app-error__icon {
      font-size: 48px;
      margin-bottom: var(--spacing-4);
    }
    
    .app-error__button {
      margin-top: var(--spacing-4);
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(errorElement);
  
  // Add event listener to refresh button
  const refreshButton = errorElement.querySelector('.app-error__button');
  if (refreshButton) {
    refreshButton.addEventListener('click', () => {
      window.location.reload();
    });
  }
}

/**
 * Initialize functionality specific to the current page
 */
function initCurrentPage() {
  // Determine current page based on URL path
  const currentPath = window.location.pathname;
  const filename = currentPath.split('/').pop();
  
  // Update UI elements with user data
  updateUserUI();
  
  // Initialize page-specific functionality
  switch (filename) {
    case '':
    case 'index.html':
      initDashboardPage();
      break;
    case 'course-catalog.html':
      import('./course-catalog.js')
        .then(module => {
          module.initCourseCatalog();
        })
        .catch(error => {
          console.error('Error loading course catalog module:', error);
        });
      break;
    case 'course-detail.html':
      initCourseDetailPage();
      break;
    case 'lesson.html':
      import('./lesson-content.js')
        .then(module => {
          module.initLessonContent(appState);
        })
        .catch(error => {
          console.error('Error loading lesson content module:', error);
        });
      break;
    case 'quiz.html':
      import('./quiz-handler.js')
        .then(module => {
          module.initQuizHandler(appState);
        })
        .catch(error => {
          console.error('Error loading quiz handler module:', error);
        });
      break;
    case 'profile.html':
      import('./progress-manager.js')
        .then(module => {
          module.renderUserProgress(appState);
        })
        .catch(error => {
          console.error('Error loading progress manager for profile page:', error);
        });
      break;
    default:
      console.log('No specific initialization for this page');
  }
}

/**
 * Update UI elements with user data
 */
function updateUserUI() {
  // Update user name in header
  const userNameElements = document.querySelectorAll('.user-name');
  userNameElements.forEach(element => {
    element.textContent = appState.currentUser.name;
  });
  
  // Update user avatar (in a real app, this would be a user image)
  // For now, we'll just use the first letter of their name as a placeholder
  const userAvatarElements = document.querySelectorAll('.user-avatar');
  userAvatarElements.forEach(element => {
    element.innerHTML = appState.currentUser.name.charAt(0);
    element.style.display = 'flex';
    element.style.justifyContent = 'center';
    element.style.alignItems = 'center';
    element.style.fontSize = '20px';
    element.style.fontWeight = 'bold';
    element.style.color = 'white';
  });
}

/**
 * Initialize Dashboard page functionality
 */
function initDashboardPage() {
  console.log('Initializing Dashboard page...');
  
  // Initialize dashboard progress
  import('./progress-manager.js')
    .then(module => {
      module.initDashboardProgress(appState);
    })
    .catch(error => {
      console.error('Error loading progress manager for dashboard:', error);
    });
}

/**
 * Initialize Course Catalog page functionality
 */
function initCatalogPage() {
  console.log('Initializing Course Catalog page...');
  
  // This would handle search and filtering functionality for courses
}

/**
 * Initialize Course Detail page functionality
 */
function initCourseDetailPage() {
  console.log('Initializing Course Detail page...');
  
  // Get course ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('id');
  
  // Load and display course details and lessons
}

/**
 * Initialize Lesson page functionality
 */
function initLessonPage() {
  console.log('Initializing Lesson page...');
  
  // Get course and lesson IDs from URL
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('course');
  const lessonId = urlParams.get('lesson');
  
  // Load and display lesson content
  // Initialize interactive elements
}

/**
 * Initialize Quiz page functionality
 */
function initQuizPage() {
  console.log('Initializing Quiz page...');
  
  // Get course and quiz IDs from URL
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('course');
  const quizId = urlParams.get('quiz');
  
  // Load and display quiz
}

/**
 * Initialize Profile page functionality
 */
function initProfilePage() {
  console.log('Initializing Profile page...');
  
  // Display user progress, achievements, etc.
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);

// Export functions and state for other modules
export { appState };