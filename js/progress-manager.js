/**
 * Progress Manager Module
 * 
 * Manages tracking, visualization, and persistence of user progress:
 * - Tracking completed lessons and quizzes
 * - Calculating course progress
 * - Managing achievements
 * - Visualizing progress data
 */

/**
 * Initialize the progress manager
 * @param {Object} appState - The global application state
 */
function initProgressManager(appState) {
  console.log('Initializing Progress Manager...');
  
  // Initialize progress tracking
  if (!appState.userProgress) {
    resetUserProgress(appState);
  }
  
  // Initialize progress tracking elements
  initCompletionTracking(appState);
  
  // Initialize achievement tracking
  initAchievementTracking(appState);
}

/**
 * Reset user progress to default state
 * @param {Object} appState - The global application state
 */
function resetUserProgress(appState) {
  appState.userProgress = {
    completedLessons: [],
    courseProgress: {},
    quizScores: {},
    achievements: []
  };
}

/**
 * Initialize completion tracking for lessons
 * @param {Object} appState - The global application state
 */
function initCompletionTracking(appState) {
  // Find lesson completion buttons
  const completionButton = document.querySelector('.mark-completed-button');
  
  if (!completionButton) {
    return;
  }
  
  // Get course and lesson IDs from URL
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('course');
  const lessonId = urlParams.get('lesson');
  
  if (!courseId || !lessonId) {
    return;
  }
  
  // Check if the lesson is already completed
  const lessonIdNumber = parseInt(lessonId);
  const isCompleted = appState.userProgress.completedLessons.includes(lessonIdNumber);
  
  // Update button state
  updateCompletionButtonState(completionButton, isCompleted);
  
  // Add event listener to completion button
  completionButton.addEventListener('click', () => {
    // Mark lesson as completed
    markLessonCompleted(courseId, lessonId, appState);
    
    // Update button state
    updateCompletionButtonState(completionButton, true);
    
    // Show completion notification
    showCompletionNotification();
  });
}

/**
 * Update completion button state based on completion status
 * @param {HTMLElement} button - The completion button element
 * @param {boolean} isCompleted - Whether the lesson is already completed
 */
function updateCompletionButtonState(button, isCompleted) {
  if (isCompleted) {
    button.textContent = 'Completed ✓';
    button.classList.remove('button--success');
    button.classList.add('button--disabled');
    button.disabled = true;
  } else {
    button.textContent = 'Mark as Completed';
    button.classList.add('button--success');
    button.classList.remove('button--disabled');
    button.disabled = false;
  }
}

/**
 * Mark a lesson as completed
 * @param {string|number} courseId - The ID of the course
 * @param {string|number} lessonId - The ID of the lesson
 * @param {Object} appState - The global application state
 */
function markLessonCompleted(courseId, lessonId, appState) {
  const courseIdNumber = parseInt(courseId);
  const lessonIdNumber = parseInt(lessonId);
  
  console.log(`Marking lesson ${lessonIdNumber} in course ${courseIdNumber} as completed`);
  
  // Add to completed lessons if not already completed
  if (!appState.userProgress.completedLessons.includes(lessonIdNumber)) {
    appState.userProgress.completedLessons.push(lessonIdNumber);
  }
  
  // Update course progress
  updateCourseProgress(courseIdNumber, appState);
  
  // Update UI to reflect completion
  updateUIForCompletedLesson(lessonIdNumber);
  
  // Check for achievements
  checkForAchievements(appState);
  
  // In a real app, this would send the progress to the server
  saveUserProgress(appState);
}

/**
 * Update course progress based on completed lessons
 * @param {number} courseId - The ID of the course
 * @param {Object} appState - The global application state
 */
function updateCourseProgress(courseId, appState) {
  // Find course data
  const course = appState.courseData.find(c => c.id === courseId);
  
  if (!course) {
    return;
  }
  
  // Get lessons for this course
  const courseLessons = appState.lessonData.filter(l => l.courseId === courseId);
  
  if (courseLessons.length === 0) {
    return;
  }
  
  // Count completed lessons for this course
  const completedLessonsInCourse = courseLessons.filter(
    lesson => appState.userProgress.completedLessons.includes(lesson.id)
  ).length;
  
  // Calculate progress percentage
  const progressPercentage = Math.round((completedLessonsInCourse / courseLessons.length) * 100);
  
  // Update course progress
  appState.userProgress.courseProgress[courseId] = progressPercentage;
  
  console.log(`Updated progress for course ${courseId}: ${progressPercentage}%`);
}

/**
 * Update UI to reflect completed lesson
 * @param {number} lessonId - The ID of the completed lesson
 */
function updateUIForCompletedLesson(lessonId) {
  // Update lesson navigation in sidebar
  const lessonItems = document.querySelectorAll('.lesson-list__item');
  
  lessonItems.forEach(item => {
    const link = item.querySelector('a');
    if (link && link.href.includes(`lesson=${lessonId}`)) {
      item.classList.add('lesson-list__item--completed');
    }
  });
}

/**
 * Show completion notification
 */
function showCompletionNotification() {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'completion-notification';
  notification.innerHTML = `
    <div class="completion-notification__content">
      <div class="completion-notification__icon">✓</div>
      <div class="completion-notification__message">
        <h3>Lesson Completed!</h3>
        <p>Great job! Your progress has been saved.</p>
      </div>
    </div>
  `;
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .completion-notification {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: var(--color-success);
      color: white;
      padding: var(--spacing-3) var(--spacing-4);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      animation: slide-in 0.5s ease-out, fade-out 0.5s ease-in 4.5s forwards;
    }
    
    .completion-notification__content {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }
    
    .completion-notification__icon {
      font-size: 24px;
      background-color: rgba(255, 255, 255, 0.3);
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
    
    .completion-notification__message h3 {
      margin: 0 0 var(--spacing-1) 0;
      font-size: var(--font-size-md);
    }
    
    .completion-notification__message p {
      margin: 0;
      font-size: var(--font-size-sm);
      opacity: 0.9;
    }
    
    @keyframes slide-in {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fade-out {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(notification);
  
  // Remove notification after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

/**
 * Initialize achievement tracking
 * @param {Object} appState - The global application state
 */
function initAchievementTracking(appState) {
  // This would be called periodically or after significant events
  // For now, we'll just check for achievements when the progress manager is initialized
  checkForAchievements(appState);
}

/**
 * Check for new achievements based on user progress
 * @param {Object} appState - The global application state
 */
function checkForAchievements(appState) {
  // Get all achievements
  const achievements = appState.achievementData;
  
  if (!achievements || !achievements.length) {
    return;
  }
  
  // Get already earned achievements
  const earnedAchievements = appState.userProgress.achievements || [];
  
  // Check each achievement
  achievements.forEach(achievement => {
    // Skip already earned achievements
    if (earnedAchievements.includes(achievement.id)) {
      return;
    }
    
    // Check if achievement criteria are met
    const achieved = checkAchievementCriteria(achievement, appState);
    
    if (achieved) {
      // Add to earned achievements
      earnedAchievements.push(achievement.id);
      
      // Show achievement notification
      showAchievementNotification(achievement);
      
      console.log(`Achievement unlocked: ${achievement.title}`);
    }
  });
  
  // Update achievements in user progress
  appState.userProgress.achievements = earnedAchievements;
}

/**
 * Check if an achievement's criteria are met
 * @param {Object} achievement - The achievement to check
 * @param {Object} appState - The global application state
 * @returns {boolean} Whether the achievement criteria are met
 */
function checkAchievementCriteria(achievement, appState) {
  const { type, criteria } = achievement;
  
  switch (type) {
    case 'course-completion':
      return checkCourseCompletionAchievement(criteria, appState);
      
    case 'lesson-completion':
      return checkLessonCompletionAchievement(criteria, appState);
      
    case 'quiz':
      return checkQuizAchievement(criteria, appState);
      
    case 'activity':
      return checkActivityAchievement(criteria, appState);
      
    case 'streak':
      return checkStreakAchievement(criteria, appState);
      
    case 'course-exploration':
      return checkCourseExplorationAchievement(criteria, appState);
      
    default:
      console.warn(`Unknown achievement type: ${type}`);
      return false;
  }
}

/**
 * Check course completion achievement criteria
 * @param {Object} criteria - The achievement criteria
 * @param {Object} appState - The global application state
 * @returns {boolean} Whether the criteria are met
 */
function checkCourseCompletionAchievement(criteria, appState) {
  const { courseId, minQuizScore } = criteria;
  
  // Check if the course is completed (100% progress)
  const courseProgress = appState.userProgress.courseProgress[courseId];
  if (!courseProgress || courseProgress < 100) {
    return false;
  }
  
  // Check minimum quiz score if required
  if (minQuizScore) {
    // Find quizzes for this course
    const courseQuizzes = appState.quizData.filter(quiz => quiz.courseId === courseId);
    
    // Check if all quizzes meet the minimum score
    const allQuizzesPassed = courseQuizzes.every(quiz => {
      const quizScore = appState.userProgress.quizScores[quiz.id];
      return quizScore && quizScore >= minQuizScore;
    });
    
    if (!allQuizzesPassed) {
      return false;
    }
  }
  
  return true;
}

/**
 * Check lesson completion achievement criteria
 * @param {Object} criteria - The achievement criteria
 * @param {Object} appState - The global application state
 * @returns {boolean} Whether the criteria are met
 */
function checkLessonCompletionAchievement(criteria, appState) {
  const { courseId, lessonIds, lessonCount } = criteria;
  
  if (lessonIds) {
    // Check if all required lessons are completed
    return lessonIds.every(lessonId => 
      appState.userProgress.completedLessons.includes(lessonId)
    );
  }
  
  if (lessonCount) {
    // Check if enough lessons have been completed
    return appState.userProgress.completedLessons.length >= lessonCount;
  }
  
  return false;
}

/**
 * Check quiz achievement criteria
 * @param {Object} criteria - The achievement criteria
 * @param {Object} appState - The global application state
 * @returns {boolean} Whether the criteria are met
 */
function checkQuizAchievement(criteria, appState) {
  const { quizId, score } = criteria;
  
  if (quizId) {
    // Check if the specific quiz meets the score requirement
    const quizScore = appState.userProgress.quizScores[quizId];
    return quizScore && quizScore >= score;
  }
  
  if (score) {
    // Check if any quiz meets the score requirement
    return Object.values(appState.userProgress.quizScores).some(
      quizScore => quizScore >= score
    );
  }
  
  return false;
}

/**
 * Check activity achievement criteria
 * @param {Object} criteria - The achievement criteria
 * @param {Object} appState - The global application state
 * @returns {boolean} Whether the criteria are met
 */
function checkActivityAchievement(criteria, appState) {
  // In a real app, this would check user activity logs
  // For this implementation, we'll just simulate activity based on completed lessons
  const { lessonCompletedInOneDay } = criteria;
  
  if (lessonCompletedInOneDay) {
    // This would require tracking when lessons were completed
    // For this implementation, we'll assume it's false
    return false;
  }
  
  return false;
}

/**
 * Check streak achievement criteria
 * @param {Object} criteria - The achievement criteria
 * @param {Object} appState - The global application state
 * @returns {boolean} Whether the criteria are met
 */
function checkStreakAchievement(criteria, appState) {
  // In a real app, this would check user login/activity streaks
  // For this implementation, we'll just simulate streaks
  return false;
}

/**
 * Check course exploration achievement criteria
 * @param {Object} criteria - The achievement criteria
 * @param {Object} appState - The global application state
 * @returns {boolean} Whether the criteria are met
 */
function checkCourseExplorationAchievement(criteria, appState) {
  const { courseCount } = criteria;
  
  if (courseCount) {
    // Count unique courses with any progress
    const coursesWithProgress = Object.keys(appState.userProgress.courseProgress).length;
    return coursesWithProgress >= courseCount;
  }
  
  return false;
}

/**
 * Show achievement notification
 * @param {Object} achievement - The earned achievement
 */
function showAchievementNotification(achievement) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'achievement-notification';
  notification.innerHTML = `
    <div class="achievement-notification__content">
      <div class="achievement-notification__icon">🏆</div>
      <div class="achievement-notification__message">
        <h3>Achievement Unlocked!</h3>
        <p>${achievement.title}</p>
        <p class="achievement-notification__points">+${achievement.points} points</p>
      </div>
    </div>
  `;
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .achievement-notification {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: var(--color-primary);
      color: white;
      padding: var(--spacing-3) var(--spacing-4);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      animation: slide-in 0.5s ease-out, fade-out 0.5s ease-in 4.5s forwards;
    }
    
    .achievement-notification__content {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }
    
    .achievement-notification__icon {
      font-size: 24px;
      background-color: rgba(255, 255, 255, 0.3);
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
    
    .achievement-notification__message h3 {
      margin: 0 0 var(--spacing-1) 0;
      font-size: var(--font-size-md);
    }
    
    .achievement-notification__message p {
      margin: 0;
      font-size: var(--font-size-sm);
      opacity: 0.9;
    }
    
    .achievement-notification__points {
      font-weight: var(--font-weight-bold);
    }
    
    @keyframes slide-in {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fade-out {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(notification);
  
  // Remove notification after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

/**
 * Save user progress
 * @param {Object} appState - The global application state
 */
function saveUserProgress(appState) {
  // In a real app, this would send the progress to the server
  console.log('Saving user progress:', appState.userProgress);
  
  // We could also save to localStorage for persistence between page loads
  try {
    localStorage.setItem('userProgress', JSON.stringify(appState.userProgress));
    console.log('Progress saved to localStorage');
  } catch (error) {
    console.error('Error saving progress to localStorage:', error);
  }
}

/**
 * Load user progress
 * @param {Object} appState - The global application state
 */
function loadUserProgress(appState) {
  try {
    const savedProgress = localStorage.getItem('userProgress');
    
    if (savedProgress) {
      appState.userProgress = JSON.parse(savedProgress);
      console.log('Progress loaded from localStorage');
    } else {
      resetUserProgress(appState);
    }
  } catch (error) {
    console.error('Error loading progress from localStorage:', error);
    resetUserProgress(appState);
  }
}

/**
 * Render user progress on the profile page
 * @param {Object} appState - The global application state
 */
function renderUserProgress(appState) {
  // This would display progress information on the profile page
  console.log('Rendering user progress on profile page');
  
  // Find profile sections
  const achievementsSection = document.querySelector('.profile-achievements');
  const progressSection = document.querySelector('.profile-progress');
  
  if (achievementsSection) {
    renderAchievements(achievementsSection, appState);
  }
  
  if (progressSection) {
    renderProgressOverview(progressSection, appState);
  }
}

/**
 * Render achievements on the profile page
 * @param {HTMLElement} container - The container for achievements
 * @param {Object} appState - The global application state
 */
function renderAchievements(container, appState) {
  const earnedAchievementIds = appState.userProgress.achievements || [];
  const allAchievements = appState.achievementData || [];
  
  // Clear container
  container.innerHTML = '<h2>Achievements</h2>';
  
  // Create earned achievements section
  const earnedSection = document.createElement('div');
  earnedSection.className = 'profile-achievements__earned';
  earnedSection.innerHTML = '<h3>Earned Achievements</h3>';
  
  // Create earned achievements grid
  const earnedGrid = document.createElement('div');
  earnedGrid.className = 'achievements-grid';
  
  // Create locked achievements section
  const lockedSection = document.createElement('div');
  lockedSection.className = 'profile-achievements__locked';
  lockedSection.innerHTML = '<h3>Locked Achievements</h3>';
  
  // Create locked achievements grid
  const lockedGrid = document.createElement('div');
  lockedGrid.className = 'achievements-grid';
  
  // Add achievements to appropriate sections
  allAchievements.forEach(achievement => {
    const isEarned = earnedAchievementIds.includes(achievement.id);
    const achievementCard = createAchievementCard(achievement, isEarned);
    
    if (isEarned) {
      earnedGrid.appendChild(achievementCard);
    } else {
      lockedGrid.appendChild(achievementCard);
    }
  });
  
  // Add grids to sections
  earnedSection.appendChild(earnedGrid);
  lockedSection.appendChild(lockedGrid);
  
  // Add sections to container
  container.appendChild(earnedSection);
  container.appendChild(lockedSection);
}

/**
 * Create an achievement card
 * @param {Object} achievement - The achievement data
 * @param {boolean} isEarned - Whether the achievement is earned
 * @returns {HTMLElement} The achievement card element
 */
function createAchievementCard(achievement, isEarned) {
  const card = document.createElement('div');
  card.className = `achievement-card ${isEarned ? 'achievement-card--earned' : 'achievement-card--locked'}`;
  
  card.innerHTML = `
    <div class="achievement-card__pattern" data-pattern="${achievement.pattern}"></div>
    <div class="achievement-card__icon">${isEarned ? '🏆' : '🔒'}</div>
    <h4 class="achievement-card__title">${achievement.title}</h4>
    <p class="achievement-card__description">${achievement.description}</p>
    ${isEarned ? `<p class="achievement-card__points">+${achievement.points} points</p>` : ''}
  `;
  
  return card;
}

/**
 * Render progress overview on the profile page
 * @param {HTMLElement} container - The container for progress overview
 * @param {Object} appState - The global application state
 */
function renderProgressOverview(container, appState) {
  const completedLessons = appState.userProgress.completedLessons.length;
  const totalPoints = calculateTotalPoints(appState);
  
  // Clear container
  container.innerHTML = '<h2>Learning Progress</h2>';
  
  // Create stats section
  const statsSection = document.createElement('div');
  statsSection.className = 'profile-progress__stats';
  
  statsSection.innerHTML = `
    <div class="stat-card">
      <div class="stat-card__icon"></div>
      <div class="stat-card__value">${completedLessons}</div>
      <div class="stat-card__label">Lessons Completed</div>
    </div>
    <div class="stat-card">
      <div class="stat-card__icon"></div>
      <div class="stat-card__value">${Object.keys(appState.userProgress.quizScores).length}</div>
      <div class="stat-card__label">Quizzes Taken</div>
    </div>
    <div class="stat-card">
      <div class="stat-card__icon"></div>
      <div class="stat-card__value">${appState.userProgress.achievements.length}</div>
      <div class="stat-card__label">Achievements Earned</div>
    </div>
    <div class="stat-card">
      <div class="stat-card__icon"></div>
      <div class="stat-card__value">${totalPoints}</div>
      <div class="stat-card__label">Total Points</div>
    </div>
  `;
  
  container.appendChild(statsSection);
  
  // Create courses section
  const coursesSection = document.createElement('div');
  coursesSection.className = 'profile-progress__courses';
  coursesSection.innerHTML = '<h3>Course Progress</h3>';
  
  // Create courses grid
  const coursesGrid = document.createElement('div');
  coursesGrid.className = 'courses-grid';
  
  // Add course progress cards
  Object.entries(appState.userProgress.courseProgress).forEach(([courseId, progress]) => {
    const course = appState.courseData.find(c => c.id === parseInt(courseId));
    
    if (course) {
      const courseCard = createCourseProgressCard(course, progress);
      coursesGrid.appendChild(courseCard);
    }
  });
  
  coursesSection.appendChild(coursesGrid);
  container.appendChild(coursesSection);
}

/**
 * Create a course progress card
 * @param {Object} course - The course data
 * @param {number} progress - The progress percentage
 * @returns {HTMLElement} The course progress card element
 */
function createCourseProgressCard(course, progress) {
  const card = document.createElement('div');
  card.className = 'course-progress-card';
  
  card.innerHTML = `
    <div class="course-progress-card__pattern" data-pattern="${course.pattern}"></div>
    <h4 class="course-progress-card__title">${course.title}</h4>
    <div class="course-progress-card__progress">
      <div class="progress-bar">
        <div class="progress-bar__fill" style="width: ${progress}%;"></div>
      </div>
      <span class="progress-bar__text">${progress}% Complete</span>
    </div>
    <a href="course-detail.html?id=${course.id}" class="button button--primary">Continue</a>
  `;
  
  return card;
}

/**
 * Calculate total points from achievements
 * @param {Object} appState - The global application state
 * @returns {number} The total points earned
 */
function calculateTotalPoints(appState) {
  const earnedAchievementIds = appState.userProgress.achievements || [];
  const achievements = appState.achievementData || [];
  
  return achievements
    .filter(achievement => earnedAchievementIds.includes(achievement.id))
    .reduce((total, achievement) => total + (achievement.points || 0), 0);
}

/**
 * Initialize the progress visualization on the dashboard
 * @param {Object} appState - The global application state
 */
function initDashboardProgress(appState) {
  // Find dashboard progress sections
  const learningPathsContainer = document.querySelector('.learning-paths__container');
  const progressStatsContainer = document.querySelector('.progress-overview__stats');
  const activityListContainer = document.querySelector('.activity-list');
  
  if (learningPathsContainer) {
    updateDashboardLearningPaths(learningPathsContainer, appState);
  }
  
  if (progressStatsContainer) {
    updateDashboardProgressStats(progressStatsContainer, appState);
  }
  
  if (activityListContainer) {
    updateDashboardActivityList(activityListContainer, appState);
  }
}

/**
 * Update learning paths on the dashboard
 * @param {HTMLElement} container - The container for learning paths
 * @param {Object} appState - The global application state
 */
function updateDashboardLearningPaths(container, appState) {
  // Get courses with progress
  const coursesWithProgress = appState.courseData
    .filter(course => appState.userProgress.courseProgress[course.id] !== undefined)
    .sort((a, b) => {
      // Sort by progress (descending)
      const progressA = appState.userProgress.courseProgress[a.id] || 0;
      const progressB = appState.userProgress.courseProgress[b.id] || 0;
      return progressB - progressA;
    })
    .slice(0, 3); // Take top 3
  
  // Get learning path cards
  const learningPathCards = container.querySelectorAll('.learning-path-card');
  
  // Update each card with real data if available
  learningPathCards.forEach((card, index) => {
    const course = coursesWithProgress[index];
    
    if (!course) {
      return;
    }
    
    const titleElement = card.querySelector('.learning-path-card__title');
    const progressBar = card.querySelector('.progress-bar__fill');
    const progressText = card.querySelector('.progress-bar__text');
    const continueButton = card.querySelector('.button');
    
    if (titleElement) {
      titleElement.textContent = course.title;
    }
    
    if (progressBar) {
      const progress = appState.userProgress.courseProgress[course.id] || 0;
      progressBar.style.width = `${progress}%`;
    }
    
    if (progressText) {
      const progress = appState.userProgress.courseProgress[course.id] || 0;
      progressText.textContent = progress === 0 ? 'Not Started' : `${progress}% Complete`;
    }
    
    if (continueButton) {
      continueButton.href = `course-detail.html?id=${course.id}`;
      continueButton.textContent = appState.userProgress.courseProgress[course.id] > 0 ? 'Continue' : 'Start';
    }
  });
}

/**
 * Update progress stats on the dashboard
 * @param {HTMLElement} container - The container for progress stats
 * @param {Object} appState - The global application state
 */
function updateDashboardProgressStats(container, appState) {
  const statCards = container.querySelectorAll('.stat-card');
  
  if (statCards.length >= 3) {
    // Courses in progress
    const coursesCard = statCards[0];
    const coursesValue = coursesCard.querySelector('.stat-card__value');
    
    if (coursesValue) {
      const coursesInProgress = Object.keys(appState.userProgress.courseProgress).length;
      coursesValue.textContent = coursesInProgress;
    }
    
    // Completed lessons
    const lessonsCard = statCards[1];
    const lessonsValue = lessonsCard.querySelector('.stat-card__value');
    
    if (lessonsValue) {
      const completedLessons = appState.userProgress.completedLessons.length;
      lessonsValue.textContent = completedLessons;
    }
    
    // Earned achievements
    const achievementsCard = statCards[2];
    const achievementsValue = achievementsCard.querySelector('.stat-card__value');
    
    if (achievementsValue) {
      const earnedAchievements = appState.userProgress.achievements.length;
      achievementsValue.textContent = earnedAchievements;
    }
  }
}

/**
 * Update activity list on the dashboard
 * @param {HTMLElement} container - The container for activity list
 * @param {Object} appState - The global application state
 */
function updateDashboardActivityList(container, appState) {
  // In a real app, this would use actual activity logs
  // For now, we'll use placeholder data
}

// Export functions
export {
  initProgressManager,
  loadUserProgress,
  saveUserProgress,
  markLessonCompleted,
  renderUserProgress,
  initDashboardProgress
};