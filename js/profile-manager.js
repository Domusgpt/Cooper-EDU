/**
 * Profile Manager Module
 * 
 * Handles functionality for the user profile page, including:
 * - Tab navigation
 * - Progress display
 * - Achievement rendering
 * - Activity feed
 * - Settings management
 */

import { loadCourses, loadLessons, loadAchievements } from './data-service.js';

// DOM elements cache
let tabElements = null;
let tabContents = null;

/**
 * Initialize the profile page
 * @param {Object} appState - The global application state
 */
async function initProfilePage(appState) {
  console.log('Initializing Profile Page...');
  
  // Cache DOM elements
  cacheElements();
  
  // Initialize tabs
  initTabs();
  
  // Load data
  try {
    console.log('Loading profile data...');
    
    let courses = [], lessons = [], achievements = [];
    
    try {
      // Try to load data, but don't fail if individual requests fail
      const results = await Promise.allSettled([
        loadCourses(),
        loadLessons(),
        loadAchievements()
      ]);
      
      // Get successful results
      if (results[0].status === 'fulfilled') courses = results[0].value;
      if (results[1].status === 'fulfilled') lessons = results[1].value;
      if (results[2].status === 'fulfilled') achievements = results[2].value;
      
      // Log any failures
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Failed to load data for index ${index}:`, result.reason);
        }
      });
    } catch (dataError) {
      console.error('Error loading data:', dataError);
      // Continue with empty data rather than failing completely
    }
    
    console.log('Data loaded:', { 
      courseCount: courses.length,
      lessonCount: lessons.length,
      achievementCount: achievements.length
    });
    
    // If we have no courses data, create some placeholder data
    if (!courses || courses.length === 0) {
      console.log('Creating placeholder course data');
      courses = [
        {
          id: 1,
          title: "Strategic Leadership Fundamentals",
          description: "Master core leadership principles",
          lessons: 12
        },
        {
          id: 2,
          title: "Advanced Project Management",
          description: "Take your project management skills to the next level",
          lessons: 15
        },
        {
          id: 3,
          title: "Business Financial Analysis",
          description: "Understand the financial aspects of business",
          lessons: 10
        }
      ];
    }
    
    // Use a try/catch for each render function to prevent one failure from stopping everything
    try {
      renderProfileStats(appState, courses, lessons);
    } catch (e) {
      console.error('Error rendering profile stats:', e);
    }
    
    try {
      renderCourseProgress(appState, courses);
    } catch (e) {
      console.error('Error rendering course progress:', e);
    }
    
    try {
      renderAchievements(appState, achievements);
    } catch (e) {
      console.error('Error rendering achievements:', e);
    }
    
    try {
      renderCertificates(appState, courses);
    } catch (e) {
      console.error('Error rendering certificates:', e);
    }
    
    try {
      renderActivityFeed(appState);
    } catch (e) {
      console.error('Error rendering activity feed:', e);
    }
    
    try {
      initProfileSettings(appState);
    } catch (e) {
      console.error('Error initializing settings:', e);
    }
    
  } catch (error) {
    console.error('Error in profile page initialization:', error);
    showErrorMessage('Failed to initialize profile page. Please refresh and try again.');
  }
}

/**
 * Cache DOM elements for better performance
 */
function cacheElements() {
  tabElements = document.querySelectorAll('.profile-tab');
  tabContents = {
    progress: document.querySelector('.progress-content'),
    achievements: document.querySelector('.achievements-content'),
    certificates: document.querySelector('.certificates-content'),
    activity: document.querySelector('.activity-content'),
    settings: document.querySelector('.settings-content')
  };
}

/**
 * Initialize tab functionality
 */
function initTabs() {
  // Get all tab content sections
  const allTabContents = Object.values(tabContents).filter(el => el);
  
  // Hide all but the first tab content
  allTabContents.forEach((content, index) => {
    if (index > 0) {
      content.style.display = 'none';
    }
  });
  
  // Map of tab names to content keys
  const tabNameMap = {
    'Progress': 'progress',
    'Achievements': 'achievements',
    'Certificates': 'certificates',
    'Activity': 'activity',
    'Settings': 'settings'
  };
  
  // Add click event listeners to tabs
  tabElements.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabElements.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Get the tab name and map to content key
      const tabName = tab.textContent.trim();
      const contentKey = tabNameMap[tabName];
      
      // Hide all tab contents
      allTabContents.forEach(content => {
        content.style.display = 'none';
      });
      
      // Show the selected tab content
      if (contentKey && tabContents[contentKey]) {
        console.log(`Showing ${contentKey} tab content`);
        tabContents[contentKey].style.display = 'block';
      } else {
        console.error(`Tab content not found for ${tabName}`);
      }
    });
  });
}

/**
 * Render the profile statistics section
 * @param {Object} appState - The global application state
 * @param {Array} courses - The courses data
 * @param {Array} lessons - The lessons data
 */
function renderProfileStats(appState, courses, lessons) {
  // Count courses in progress
  const coursesInProgress = Object.keys(appState.userProgress.courseProgress || {}).length;
  
  // Count completed lessons
  const completedLessons = appState.userProgress.completedLessons.length;
  
  // Count earned achievements
  const earnedAchievements = appState.userProgress.achievements.length;
  
  // Count certificates
  const certificates = (appState.userProgress.certificates || []).length;
  
  // Update the stats in the profile header
  const statElements = document.querySelectorAll('.profile-stat__value');
  if (statElements.length >= 4) {
    statElements[0].textContent = coursesInProgress;
    statElements[1].textContent = completedLessons;
    statElements[2].textContent = earnedAchievements;
    statElements[3].textContent = certificates;
  }
}

/**
 * Render the course progress section
 * @param {Object} appState - The global application state
 * @param {Array} courses - The courses data
 */
function renderCourseProgress(appState, courses) {
  const progressList = document.querySelector('.course-progress-list');
  if (!progressList) return;
  
  // Get the course progress data
  const courseProgress = appState.userProgress.courseProgress || {};
  
  // Clear the current list
  progressList.innerHTML = '';
  
  // Get enrolled courses
  const enrolledCourses = courses.filter(course => courseProgress[course.id] !== undefined);
  
  // Render each course progress
  enrolledCourses.forEach(course => {
    const progress = courseProgress[course.id] || 0;
    
    // Create progress item
    const progressItem = document.createElement('div');
    progressItem.className = 'course-progress-item';
    
    // Get course lessons
    const totalLessons = course.lessons || 0;
    const completedCount = Math.round((progress / 100) * totalLessons);
    
    progressItem.innerHTML = `
      <div class="course-progress-title">
        <span>${course.title}</span>
        <span class="course-progress-percentage">${progress}%</span>
      </div>
      <div class="course-progress-bar">
        <div class="course-progress-fill" style="width: ${progress}%;"></div>
      </div>
      <div class="course-progress-details">
        <small>${completedCount} of ${totalLessons} lessons completed</small>
        <a href="course-detail.html?id=${course.id}" 
           class="button button--primary" 
           style="float: right; margin: 0; padding: 0.4rem 0.8rem; font-size: 0.875rem;">
          ${progress === 0 ? 'Start' : (progress === 100 ? 'Review' : 'Continue')}
        </a>
      </div>
    `;
    
    // Add to list
    progressList.appendChild(progressItem);
  });
  
  // If no enrolled courses, show message
  if (enrolledCourses.length === 0) {
    progressList.innerHTML = `
      <div class="empty-state">
        <p>You haven't enrolled in any courses yet.</p>
        <a href="course-catalog.html" class="button button--primary">Browse Courses</a>
      </div>
    `;
  }
}

/**
 * Render the achievements section
 * @param {Object} appState - The global application state
 * @param {Array} achievements - The achievements data
 */
function renderAchievements(appState, achievements) {
  const achievementsGrid = document.querySelector('.achievements-grid');
  if (!achievementsGrid) return;
  
  // Get the earned achievements
  const earnedAchievementIds = appState.userProgress.achievements || [];
  
  // Clear the current grid
  achievementsGrid.innerHTML = '';
  
  // Filter achievements to show
  // For the main view, show all earned and a few locked achievements
  const earnedAchievements = achievements.filter(a => earnedAchievementIds.includes(a.id));
  const lockedAchievements = achievements.filter(a => !earnedAchievementIds.includes(a.id));
  const achievementsToShow = [...earnedAchievements, ...lockedAchievements.slice(0, 4)];
  
  // Render each achievement
  achievementsToShow.forEach(achievement => {
    const isEarned = earnedAchievementIds.includes(achievement.id);
    
    const achievementItem = document.createElement('div');
    achievementItem.className = 'achievement-item';
    
    achievementItem.innerHTML = `
      <div class="achievement-icon ${isEarned ? '' : 'locked'}">
        <img src="assets/images/achievement.svg" alt="Achievement" width="60" height="60">
      </div>
      <div class="achievement-title">${achievement.title}</div>
      <div class="achievement-date">${isEarned ? 'May 10, 2025' : 'Locked'}</div>
    `;
    
    // Add to grid
    achievementsGrid.appendChild(achievementItem);
  });
}

/**
 * Render the certificates section
 * @param {Object} appState - The global application state
 * @param {Array} courses - The courses data
 */
function renderCertificates(appState, courses) {
  const certificatesList = document.querySelector('.certificates-list');
  if (!certificatesList) return;
  
  // Get the earned certificates (in a real app, these would be stored separately)
  // For now, we'll assume that completing a course (100% progress) earns a certificate
  const courseProgress = appState.userProgress.courseProgress || {};
  const completedCourseIds = Object.keys(courseProgress)
    .filter(courseId => courseProgress[courseId] === 100)
    .map(id => parseInt(id));
  
  // Clear the current list
  certificatesList.innerHTML = '';
  
  // Get completed courses with certificates
  const completedCourses = courses.filter(course => completedCourseIds.includes(course.id));
  
  // If no certificates, show message
  if (completedCourses.length === 0) {
    certificatesList.innerHTML = `
      <div class="empty-state">
        <p>You haven't earned any certificates yet. Complete a course to earn one!</p>
      </div>
    `;
    return;
  }
  
  // Render each certificate
  completedCourses.forEach((course, index) => {
    // Create completion date (mockup - in reality would come from backend)
    const completionDate = new Date();
    completionDate.setMonth(completionDate.getMonth() - index); // Stagger dates for demo
    
    const certificateItem = document.createElement('div');
    certificateItem.className = 'certificate-item';
    
    certificateItem.innerHTML = `
      <div class="certificate-icon">
        <img src="assets/images/leadership-icon.svg" alt="Certificate" width="24" height="24">
      </div>
      <div class="certificate-info">
        <div class="certificate-title">${course.title}</div>
        <div class="certificate-date">Completed on ${completionDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
      </div>
      <button class="certificate-download">Download</button>
    `;
    
    // Add to list
    certificatesList.appendChild(certificateItem);
  });
}

/**
 * Render the activity feed
 * @param {Object} appState - The global application state
 */
function renderActivityFeed(appState) {
  const activityFeed = document.querySelector('.activity-feed');
  if (!activityFeed) return;
  
  // In a real app, activity would be stored in the database
  // For now, we'll use mocked data
  const activities = [
    {
      type: 'lesson_completion',
      details: 'Completed "Leading High-Performance Teams" lesson',
      timestamp: new Date()
    },
    {
      type: 'achievement',
      details: 'Earned "Leadership Fundamentals" achievement',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      type: 'course_enrollment',
      details: 'Started "Advanced Project Management" course',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      type: 'quiz_completion',
      details: 'Completed Strategic Leadership quiz with score 85%',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    },
    {
      type: 'profile_update',
      details: 'Updated profile information',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
    }
  ];
  
  // Clear the current feed
  activityFeed.innerHTML = '';
  
  // Render each activity
  activities.forEach(activity => {
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    
    // Format the time string
    let timeString = 'Just now';
    const now = new Date();
    const timeDiff = now - activity.timestamp;
    
    if (timeDiff < 60 * 60 * 1000) {
      // Less than an hour
      const minutes = Math.floor(timeDiff / (60 * 1000));
      timeString = minutes === 0 ? 'Just now' : `${minutes} minutes ago`;
    } else if (timeDiff < 24 * 60 * 60 * 1000) {
      // Less than a day
      const hours = Math.floor(timeDiff / (60 * 60 * 1000));
      timeString = `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (timeDiff < 2 * 24 * 60 * 60 * 1000) {
      // Yesterday
      timeString = 'Yesterday';
    } else if (timeDiff < 7 * 24 * 60 * 60 * 1000) {
      // Less than a week
      const days = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
      timeString = `${days} days ago`;
    } else {
      // More than a week
      timeString = '1 week ago';
    }
    
    activityItem.innerHTML = `
      <div class="activity-icon">
        <img src="assets/images/leadership-icon.svg" alt="Activity" width="18" height="18">
      </div>
      <div class="activity-info">
        <div class="activity-text">${activity.details}</div>
        <div class="activity-time">${timeString}</div>
      </div>
    `;
    
    // Add to feed
    activityFeed.appendChild(activityItem);
  });
}

/**
 * Initialize settings form
 * @param {Object} appState - The global application state
 */
function initProfileSettings(appState) {
  const settingsForm = document.querySelector('.settings-form');
  if (!settingsForm) return;
  
  // In a real app, these settings would be saved to the backend
  // For now, we'll just add event listeners to show saving functionality
  
  const formInputs = settingsForm.querySelectorAll('input, select, textarea');
  const saveButton = settingsForm.querySelector('button[type="submit"]');
  
  if (!saveButton) return;
  
  saveButton.addEventListener('click', (event) => {
    event.preventDefault();
    
    // Show a saving indicator
    saveButton.textContent = 'Saving...';
    saveButton.disabled = true;
    
    // Simulate saving delay
    setTimeout(() => {
      // Update button to show success
      saveButton.textContent = 'Saved!';
      
      // Reset button after 2 seconds
      setTimeout(() => {
        saveButton.textContent = 'Save Changes';
        saveButton.disabled = false;
      }, 2000);
      
      // Show notification
      showNotification('Profile settings saved successfully!');
    }, 1000);
  });
}

/**
 * Show a notification message
 * @param {string} message - The message to display
 */
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `
    <div class="notification__content">
      <span>${message}</span>
    </div>
  `;
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .notification {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #2c3e50;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      animation: slide-in 0.3s ease-out, fade-out 0.3s ease-in 2.7s forwards;
    }
    
    @keyframes slide-in {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes fade-out {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.remove();
    style.remove();
  }, 3000);
}

/**
 * Show error message
 * @param {string} message - The error message to display
 */
function showErrorMessage(message) {
  // Create error element
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.innerHTML = `
    <div class="error-message__content">
      <div class="error-message__icon">⚠️</div>
      <span>${message}</span>
    </div>
  `;
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .error-message {
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #e74c3c;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      animation: slide-in 0.3s ease-out;
      display: flex;
      align-items: center;
    }
    
    .error-message__icon {
      margin-right: 8px;
    }
    
    @keyframes slide-in {
      from { transform: translateY(-100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(errorElement);
  
  // Remove after 5 seconds
  setTimeout(() => {
    errorElement.remove();
    style.remove();
  }, 5000);
}

// Export functions
export {
  initProfilePage,
  renderCourseProgress,
  renderAchievements,
  renderActivityFeed
};