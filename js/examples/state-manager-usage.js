/**
 * State Manager Usage Examples
 * 
 * This file demonstrates how to use the state-manager.js system
 * in different components of the Cooper Educational Platform.
 */

import stateManager from '../state-manager.js';

/**
 * Example 1: Initializing the application with data
 */
function initializeApplication() {
  // Initial data for the application
  const initialData = {
    course: {
      courses: [
        {
          id: 'course-1',
          title: 'Introduction to Web Development',
          description: 'Learn the basics of web development with HTML, CSS, and JavaScript.',
          category: 'web-development',
          difficulty: 'beginner',
          lessons: ['lesson-1-1', 'lesson-1-2', 'lesson-1-3']
        },
        {
          id: 'course-2',
          title: 'JavaScript Fundamentals',
          description: 'Master the core concepts of JavaScript programming.',
          category: 'programming',
          difficulty: 'intermediate',
          lessons: ['lesson-2-1', 'lesson-2-2', 'lesson-2-3', 'lesson-2-4']
        }
      ],
      filters: {
        category: null,
        difficulty: null,
        search: ''
      }
    },
    user: {
      preferences: {
        theme: 'light',
        notifications: true
      }
    }
  };
  
  // Initialize the state manager
  stateManager.initialize(initialData);
  
  console.log('Application initialized with initial data');
}

/**
 * Example 2: Course catalog with filtering
 */
function initCourseCatalog() {
  const courseStore = stateManager.getStore('course');
  const filtersForm = document.querySelector('#course-filters');
  const courseContainer = document.querySelector('.course-cards-container');
  
  // Subscribe to filtered courses changes
  const unsubscribe = courseStore.subscribe('filteredCourses', (filteredCourses) => {
    // Clear existing courses
    courseContainer.innerHTML = '';
    
    // Render each course card
    filteredCourses.forEach(course => {
      const courseCard = createCourseCard(course);
      courseContainer.appendChild(courseCard);
    });
    
    // Update empty state if no courses match filters
    if (filteredCourses.length === 0) {
      courseContainer.innerHTML = `
        <div class="empty-state">
          <h3>No courses match your filters</h3>
          <p>Try adjusting your search criteria.</p>
          <button class="btn btn--outline" id="reset-filters">Reset Filters</button>
        </div>
      `;
      
      // Add reset filters button handler
      document.querySelector('#reset-filters').addEventListener('click', () => {
        courseStore.setState('filters', {
          category: null,
          difficulty: null,
          search: ''
        });
        
        // Reset form inputs
        filtersForm.reset();
      });
    }
  });
  
  // Handle filter form changes
  filtersForm.addEventListener('change', (event) => {
    const categorySelect = filtersForm.querySelector('#category-filter');
    const difficultySelect = filtersForm.querySelector('#difficulty-filter');
    
    // Update filters in state
    courseStore.setState('filters', {
      category: categorySelect.value || null,
      difficulty: difficultySelect.value || null,
      search: courseStore.getValue('filters').search
    });
  });
  
  // Handle search input
  const searchInput = filtersForm.querySelector('#search-filter');
  searchInput.addEventListener('input', (event) => {
    // Debounce search input
    clearTimeout(searchInput._timeout);
    searchInput._timeout = setTimeout(() => {
      courseStore.updateState('filters', {
        search: searchInput.value
      });
    }, 300);
  });
  
  // Create a course card element
  function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.dataset.courseId = course.id;
    
    card.innerHTML = `
      <div class="course-card__image">
        <img src="assets/images/courses/${course.id}.jpg" alt="${course.title}">
        <div class="course-card__difficulty">${course.difficulty}</div>
      </div>
      <div class="course-card__content">
        <h3 class="course-card__title">${course.title}</h3>
        <p class="course-card__description">${course.description}</p>
        <div class="course-card__meta">
          <span class="course-card__lessons">${course.lessons.length} lessons</span>
        </div>
      </div>
      <div class="course-card__footer">
        <a href="course-detail.html?id=${course.id}" class="btn btn--primary">View Course</a>
      </div>
    `;
    
    return card;
  }
  
  // Return cleanup function
  return unsubscribe;
}

/**
 * Example 3: User preferences with theme toggle
 */
function initThemeToggle() {
  const userStore = stateManager.getStore('user');
  const themeToggle = document.querySelector('.theme-toggle');
  
  // Apply initial theme
  const currentTheme = userStore.getValue('preferences').theme;
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  // Update toggle button state
  if (currentTheme === 'dark') {
    themeToggle.classList.add('theme-toggle--active');
    themeToggle.setAttribute('aria-pressed', 'true');
  }
  
  // Handle toggle button click
  themeToggle.addEventListener('click', () => {
    const currentPreferences = userStore.getValue('preferences');
    const newTheme = currentPreferences.theme === 'light' ? 'dark' : 'light';
    
    // Update theme in state
    userStore.updateState('preferences', {
      theme: newTheme
    });
  });
  
  // Subscribe to preference changes
  const unsubscribe = userStore.subscribe('preferences', (newPreferences) => {
    // Update theme attribute
    document.documentElement.setAttribute('data-theme', newPreferences.theme);
    
    // Update toggle button state
    if (newPreferences.theme === 'dark') {
      themeToggle.classList.add('theme-toggle--active');
      themeToggle.setAttribute('aria-pressed', 'true');
    } else {
      themeToggle.classList.remove('theme-toggle--active');
      themeToggle.setAttribute('aria-pressed', 'false');
    }
  });
  
  // Return cleanup function
  return unsubscribe;
}

/**
 * Example 4: Lesson completion with progress tracking
 */
function initLessonCompletion() {
  // Get lesson data from URL
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('courseId');
  const lessonId = urlParams.get('lessonId');
  
  if (!courseId || !lessonId) {
    console.error('Missing courseId or lessonId in URL');
    return;
  }
  
  const completeButton = document.querySelector('#complete-lesson');
  
  // Handle complete button click
  completeButton.addEventListener('click', () => {
    // Update state with lesson completion
    stateManager.updateLessonProgress(courseId, lessonId, true, {
      completedAt: new Date().toISOString(),
      interactions: document.querySelectorAll('.interactive-element.completed').length
    });
    
    // Show completion message
    showCompletionMessage();
    
    // Load next lesson if available
    loadNextLesson(courseId, lessonId);
  });
  
  // Show completion message
  function showCompletionMessage() {
    const messageContainer = document.createElement('div');
    messageContainer.className = 'completion-message';
    messageContainer.innerHTML = `
      <div class="completion-message__content">
        <h3>Lesson Completed!</h3>
        <p>Great job completing this lesson.</p>
        <div class="completion-message__buttons">
          <button class="btn btn--primary" id="next-lesson-btn">Continue to Next Lesson</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(messageContainer);
    
    // Add fade-in class after insertion for animation
    setTimeout(() => {
      messageContainer.classList.add('completion-message--visible');
    }, 10);
    
    // Handle next lesson button
    document.querySelector('#next-lesson-btn').addEventListener('click', () => {
      loadNextLesson(courseId, lessonId);
    });
  }
  
  // Load next lesson
  function loadNextLesson(courseId, lessonId) {
    // Get course data
    const courseStore = stateManager.getStore('course');
    const course = courseStore.getValue('courses').find(c => c.id === courseId);
    
    if (!course) {
      console.error('Course not found:', courseId);
      return;
    }
    
    // Find current lesson index
    const lessonIndex = course.lessons.indexOf(lessonId);
    if (lessonIndex === -1) {
      console.error('Lesson not found in course:', lessonId);
      return;
    }
    
    // Check if there's a next lesson
    if (lessonIndex < course.lessons.length - 1) {
      const nextLessonId = course.lessons[lessonIndex + 1];
      window.location.href = `lesson.html?courseId=${courseId}&lessonId=${nextLessonId}`;
    } else {
      // No more lessons, go to course completion page
      window.location.href = `course-complete.html?courseId=${courseId}`;
    }
  }
}

/**
 * Example 5: Dashboard with learning streaks
 */
function initDashboardStreaks() {
  const progressStore = stateManager.getStore('progress');
  const streakContainer = document.querySelector('.streak-display');
  
  if (!streakContainer) return null;
  
  // Render initial streak data
  updateStreakDisplay(progressStore.getValue('streaks'));
  
  // Subscribe to streak changes
  const unsubscribe = progressStore.subscribe('streaks', updateStreakDisplay);
  
  // Update streak display
  function updateStreakDisplay(streaks) {
    streakContainer.innerHTML = `
      <div class="streak-display__current">
        <span class="streak-display__value">${streaks.current}</span>
        <span class="streak-display__label">Day Streak</span>
      </div>
      <div class="streak-display__best">
        <span class="streak-display__value">${streaks.longest}</span>
        <span class="streak-display__label">Best Streak</span>
      </div>
    `;
    
    // Add flame icon for streaks >= 3
    if (streaks.current >= 3) {
      const flameIcon = document.createElement('div');
      flameIcon.className = 'streak-display__icon';
      flameIcon.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="currentColor"/>
        </svg>
      `;
      streakContainer.appendChild(flameIcon);
    }
  }
  
  // Return cleanup function
  return unsubscribe;
}

/**
 * Example 6: Achievement notification system
 */
function initAchievementNotifications() {
  // Listen for achievement unlock events
  document.addEventListener('achievement:unlocked', async (event) => {
    const achievementId = event.detail.achievementId;
    
    // Fetch achievement data
    // In a real implementation, this would come from the data service
    const achievementData = await fetchAchievementData(achievementId);
    
    // Show notification
    showAchievementNotification(achievementData);
  });
  
  // Mock achievement data fetch
  async function fetchAchievementData(achievementId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock achievement data
    const achievementMap = {
      'ach-course-complete': {
        id: 'ach-course-complete',
        title: 'Course Master',
        description: 'Complete your first course',
        iconUrl: 'assets/images/achievement.svg'
      },
      'ach-streak-7': {
        id: 'ach-streak-7',
        title: 'Consistent Learner',
        description: 'Maintain a 7-day learning streak',
        iconUrl: 'assets/images/achievement.svg'
      }
    };
    
    return achievementMap[achievementId] || {
      id: achievementId,
      title: 'Achievement Unlocked',
      description: 'You unlocked a new achievement!',
      iconUrl: 'assets/images/achievement.svg'
    };
  }
  
  // Show achievement notification
  function showAchievementNotification(achievement) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-notification__content">
        <div class="achievement-notification__icon">
          <img src="${achievement.iconUrl}" alt="">
        </div>
        <div class="achievement-notification__text">
          <h4 class="achievement-notification__title">${achievement.title}</h4>
          <p class="achievement-notification__description">${achievement.description}</p>
        </div>
        <button class="achievement-notification__close" aria-label="Close">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add visible class for animation
    setTimeout(() => {
      notification.classList.add('achievement-notification--visible');
    }, 10);
    
    // Handle close button
    notification.querySelector('.achievement-notification__close').addEventListener('click', () => {
      notification.classList.remove('achievement-notification--visible');
      
      // Remove from DOM after animation
      setTimeout(() => {
        notification.remove();
      }, 300);
    });
    
    // Auto-close after 5 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.classList.remove('achievement-notification--visible');
        
        // Remove from DOM after animation
        setTimeout(() => {
          if (document.body.contains(notification)) {
            notification.remove();
          }
        }, 300);
      }
    }, 5000);
  }
}

// Export examples
export {
  initializeApplication,
  initCourseCatalog,
  initThemeToggle,
  initLessonCompletion,
  initDashboardStreaks,
  initAchievementNotifications
};