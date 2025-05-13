/**
 * Progress Tracker Module
 * 
 * Tracks and visualizes user progress through courses and lessons
 * Manages achievements and completion status
 */

/**
 * Initialize the progress tracker
 * @param {Object} appState - The global application state
 */
function initProgressTracker(appState) {
  console.log('Initializing Progress Tracker...');
  
  // Initialize lesson completion buttons
  initCompletionButtons(appState);
  
  // If on the dashboard, render progress overview
  if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
    renderProgressOverview(appState);
  }
  
  // If on the profile page, render achievements
  if (window.location.pathname.includes('profile.html')) {
    renderAchievements(appState);
  }
}

/**
 * Initialize lesson completion buttons
 * @param {Object} appState - The global application state
 */
function initCompletionButtons(appState) {
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
  const isCompleted = appState.userProgress.completedLessons.includes(parseInt(lessonId));
  
  // Update button state
  if (isCompleted) {
    completionButton.textContent = 'Completed';
    completionButton.classList.add('button--disabled');
    completionButton.disabled = true;
  } else {
    // Add event listener
    completionButton.addEventListener('click', () => {
      markLessonCompleted(courseId, lessonId, appState);
    });
  }
}

/**
 * Mark a lesson as completed
 * @param {string|number} courseId - The ID of the course
 * @param {string|number} lessonId - The ID of the lesson
 * @param {Object} appState - The global application state
 */
function markLessonCompleted(courseId, lessonId, appState) {
  console.log(`Marking lesson ${lessonId} in course ${courseId} as completed`);
  
  // Add lesson to completed lessons if not already there
  const lessonIdNum = parseInt(lessonId);
  if (!appState.userProgress.completedLessons.includes(lessonIdNum)) {
    appState.userProgress.completedLessons.push(lessonIdNum);
  }
  
  // Update course progress
  updateCourseProgress(courseId, appState);
  
  // Update UI
  const completionButton = document.querySelector('.mark-completed-button');
  if (completionButton) {
    completionButton.textContent = 'Completed';
    completionButton.classList.add('button--disabled');
    completionButton.disabled = true;
  }
  
  // Add completed class to lesson item in sidebar
  const lessonItems = document.querySelectorAll('.lesson-list__item');
  lessonItems.forEach(item => {
    const link = item.querySelector('a');
    if (link && link.href.includes(`lesson=${lessonId}`)) {
      item.classList.add('lesson-list__item--completed');
    }
  });
  
  // Check for achievements
  checkAchievements(appState);
  
  // In a real app, this would send the progress to the server
  console.log('Progress updated:', appState.userProgress);
  
  // Check if there's a next lesson and prompt to continue
  const nextLessonLink = document.querySelector('.lesson-navigation-buttons a:last-child');
  if (nextLessonLink) {
    promptNextLesson(nextLessonLink.href);
  }
}

/**
 * Update progress for a course based on completed lessons
 * @param {string|number} courseId - The ID of the course
 * @param {Object} appState - The global application state
 */
function updateCourseProgress(courseId, appState) {
  // Find all lessons for this course
  const courseLessons = appState.lessonData.filter(
    lesson => lesson.courseId.toString() === courseId.toString()
  );
  
  if (courseLessons.length === 0) {
    return;
  }
  
  // Count completed lessons
  const completedLessons = courseLessons.filter(
    lesson => appState.userProgress.completedLessons.includes(lesson.id)
  );
  
  // Calculate progress percentage
  const progressPercentage = Math.round((completedLessons.length / courseLessons.length) * 100);
  
  // Update progress in user state
  if (!appState.userProgress.courseProgress) {
    appState.userProgress.courseProgress = {};
  }
  appState.userProgress.courseProgress[courseId] = progressPercentage;
  
  // In a real app, this would be sent to the server
}

/**
 * Prompt the user to continue to the next lesson
 * @param {string} nextLessonUrl - The URL of the next lesson
 */
function promptNextLesson(nextLessonUrl) {
  // Create a modal or notification
  const modal = document.createElement('div');
  modal.className = 'completion-modal';
  modal.innerHTML = `
    <div class="completion-modal__content">
      <h3>Lesson Completed!</h3>
      <p>Congratulations on completing this lesson.</p>
      <div class="button-group">
        <a href="${nextLessonUrl}" class="button button--primary">Continue to Next Lesson</a>
        <button class="button button--secondary close-modal-button">Stay on This Page</button>
      </div>
    </div>
  `;
  
  // Add the modal to the document
  document.body.appendChild(modal);
  
  // Add event listener to close button
  const closeButton = modal.querySelector('.close-modal-button');
  closeButton.addEventListener('click', () => {
    modal.remove();
  });
  
  // Add some basic styles for the modal
  const style = document.createElement('style');
  style.textContent = `
    .completion-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: var(--z-max);
    }
    
    .completion-modal__content {
      background-color: var(--bg-primary);
      border-radius: var(--radius-lg);
      padding: var(--spacing-6);
      max-width: 500px;
      text-align: center;
    }
    
    .completion-modal h3 {
      margin-top: 0;
    }
    
    .button-group {
      display: flex;
      gap: var(--spacing-4);
      justify-content: center;
      margin-top: var(--spacing-6);
    }
  `;
  
  document.head.appendChild(style);
}

/**
 * Check for newly unlocked achievements
 * @param {Object} appState - The global application state
 */
function checkAchievements(appState) {
  // Get all achievements
  const achievements = appState.achievementData;
  
  // Get already earned achievements
  const earnedAchievements = appState.userProgress.achievements || [];
  
  // Check each achievement
  achievements.forEach(achievement => {
    // Skip already earned achievements
    if (earnedAchievements.includes(achievement.id)) {
      return;
    }
    
    // Check if achievement criteria are met
    let achieved = false;
    
    switch (achievement.type) {
      case 'course-completion':
        achieved = checkCourseCompletionAchievement(achievement, appState);
        break;
      case 'lesson-completion':
        achieved = checkLessonCompletionAchievement(achievement, appState);
        break;
      case 'quiz':
        achieved = checkQuizAchievement(achievement, appState);
        break;
      case 'activity':
        achieved = checkActivityAchievement(achievement, appState);
        break;
      // Other achievement types would be handled here
    }
    
    // If achievement earned, add to user progress
    if (achieved) {
      earnedAchievements.push(achievement.id);
      notifyAchievementUnlocked(achievement);
    }
  });
  
  // Update user progress
  appState.userProgress.achievements = earnedAchievements;
  
  // In a real app, this would be sent to the server
}

/**
 * Check if a course completion achievement has been earned
 * @param {Object} achievement - The achievement data
 * @param {Object} appState - The global application state
 * @returns {boolean} Whether the achievement has been earned
 */
function checkCourseCompletionAchievement(achievement, appState) {
  const { courseId, minQuizScore, lessonIds } = achievement.criteria;
  
  // If specific lessons are required
  if (lessonIds) {
    // Check if all required lessons are completed
    const allLessonsCompleted = lessonIds.every(lessonId => 
      appState.userProgress.completedLessons.includes(lessonId)
    );
    
    if (!allLessonsCompleted) {
      return false;
    }
  } else {
    // Check if course progress is 100%
    const courseProgress = appState.userProgress.courseProgress[courseId];
    if (!courseProgress || courseProgress < 100) {
      return false;
    }
  }
  
  // If minimum quiz score is required
  if (minQuizScore) {
    // Find quizzes for this course
    const courseQuizzes = appState.quizData.filter(quiz => 
      quiz.courseId.toString() === courseId.toString()
    );
    
    // Check if all quizzes have been taken and meet the minimum score
    const quizzesPassed = courseQuizzes.every(quiz => {
      const quizScore = appState.userProgress.quizScores[quiz.id];
      return quizScore && quizScore >= minQuizScore;
    });
    
    if (!quizzesPassed) {
      return false;
    }
  }
  
  return true;
}

/**
 * Check if a lesson completion achievement has been earned
 * @param {Object} achievement - The achievement data
 * @param {Object} appState - The global application state
 * @returns {boolean} Whether the achievement has been earned
 */
function checkLessonCompletionAchievement(achievement, appState) {
  const { courseId, lessonIds, lessonCount } = achievement.criteria;
  
  // If specific lessons are required
  if (lessonIds) {
    // Check if all required lessons are completed
    return lessonIds.every(lessonId => 
      appState.userProgress.completedLessons.includes(lessonId)
    );
  }
  
  // If a specific lesson count is required
  if (lessonCount) {
    return appState.userProgress.completedLessons.length >= lessonCount;
  }
  
  return false;
}

/**
 * Check if a quiz achievement has been earned
 * @param {Object} achievement - The achievement data
 * @param {Object} appState - The global application state
 * @returns {boolean} Whether the achievement has been earned
 */
function checkQuizAchievement(achievement, appState) {
  const { quizId, score } = achievement.criteria;
  
  // If a specific quiz is required
  if (quizId) {
    const quizScore = appState.userProgress.quizScores[quizId];
    return quizScore && quizScore >= score;
  }
  
  // If any quiz needs to meet the score
  if (score) {
    return Object.values(appState.userProgress.quizScores).some(quizScore => 
      quizScore >= score
    );
  }
  
  return false;
}

/**
 * Check if an activity achievement has been earned
 * @param {Object} achievement - The achievement data
 * @param {Object} appState - The global application state
 * @returns {boolean} Whether the achievement has been earned
 */
function checkActivityAchievement(achievement, appState) {
  // This would require more complex activity tracking in a real app
  // For now, we'll return false to keep it simple
  return false;
}

/**
 * Notify the user of an unlocked achievement
 * @param {Object} achievement - The achievement data
 */
function notifyAchievementUnlocked(achievement) {
  console.log(`Achievement unlocked: ${achievement.title}`);
  
  // Create a notification element
  const notification = document.createElement('div');
  notification.className = 'achievement-notification';
  notification.innerHTML = `
    <div class="achievement-notification__content">
      <div class="achievement-icon" style="background-color: var(--color-primary);"><Æ</div>
      <div class="achievement-details">
        <h4>Achievement Unlocked!</h4>
        <p>${achievement.title}</p>
        <p class="achievement-points">+${achievement.points} points</p>
      </div>
    </div>
  `;
  
  // Add the notification to the document
  document.body.appendChild(notification);
  
  // Add some basic styles for the notification
  const style = document.createElement('style');
  style.textContent = `
    .achievement-notification {
      position: fixed;
      bottom: var(--spacing-4);
      right: var(--spacing-4);
      z-index: var(--z-max);
      animation: slide-in 0.5s ease-out, fade-out 0.5s ease-in 4.5s forwards;
    }
    
    .achievement-notification__content {
      background-color: var(--bg-primary);
      border-radius: var(--radius-lg);
      padding: var(--spacing-4);
      box-shadow: var(--shadow-xl);
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
    }
    
    .achievement-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-full);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
    }
    
    .achievement-details h4 {
      margin-top: 0;
      margin-bottom: var(--spacing-1);
    }
    
    .achievement-details p {
      margin: 0;
    }
    
    .achievement-points {
      color: var(--color-primary);
      font-weight: var(--font-weight-bold);
    }
    
    @keyframes slide-in {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    
    @keyframes fade-out {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  
  document.head.appendChild(style);
  
  // Remove the notification after 5 seconds
  setTimeout(() => {
    notification.remove();
    style.remove();
  }, 5000);
}

/**
 * Render progress overview on the dashboard
 * @param {Object} appState - The global application state
 */
function renderProgressOverview(appState) {
  // Render stats
  renderProgressStats(appState);
  
  // Render recent activity
  renderRecentActivity(appState);
  
  // Render learning paths
  renderLearningPaths(appState);
}

/**
 * Render progress statistics
 * @param {Object} appState - The global application state
 */
function renderProgressStats(appState) {
  const statsContainer = document.querySelector('.progress-overview__stats');
  
  if (!statsContainer) {
    return;
  }
  
  // Count courses in progress
  const coursesInProgress = Object.keys(appState.userProgress.courseProgress || {}).length;
  
  // Count completed lessons
  const completedLessons = appState.userProgress.completedLessons.length;
  
  // Count earned achievements
  const earnedAchievements = appState.userProgress.achievements.length;
  
  // Update stat cards
  const statCards = statsContainer.querySelectorAll('.stat-card');
  
  if (statCards.length >= 3) {
    // Courses in progress
    const coursesCard = statCards[0];
    const coursesValue = coursesCard.querySelector('.stat-card__value');
    if (coursesValue) {
      coursesValue.textContent = coursesInProgress;
    }
    
    // Completed lessons
    const lessonsCard = statCards[1];
    const lessonsValue = lessonsCard.querySelector('.stat-card__value');
    if (lessonsValue) {
      lessonsValue.textContent = completedLessons;
    }
    
    // Earned achievements
    const achievementsCard = statCards[2];
    const achievementsValue = achievementsCard.querySelector('.stat-card__value');
    if (achievementsValue) {
      achievementsValue.textContent = earnedAchievements;
    }
  }
}

/**
 * Render recent activity list
 * @param {Object} appState - The global application state
 */
function renderRecentActivity(appState) {
  // This would be based on a real activity log in a production app
  // For now, we'll use placeholder data
}

/**
 * Render learning paths with progress
 * @param {Object} appState - The global application state
 */
function renderLearningPaths(appState) {
  const learningPathsContainer = document.querySelector('.learning-paths__container');
  
  if (!learningPathsContainer) {
    return;
  }
  
  // Get course cards
  const courseCards = learningPathsContainer.querySelectorAll('.learning-path-card');
  
  // Update progress for each course card
  courseCards.forEach(card => {
    // Get course ID from the "Continue" button href
    const continueButton = card.querySelector('a.button');
    if (!continueButton) {
      return;
    }
    
    const href = continueButton.getAttribute('href');
    const courseIdMatch = href.match(/id=(\d+)/);
    
    if (!courseIdMatch) {
      return;
    }
    
    const courseId = courseIdMatch[1];
    
    // Get progress for this course
    const progress = appState.userProgress.courseProgress[courseId] || 0;
    
    // Update progress bar
    const progressBar = card.querySelector('.progress-bar__fill');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
    
    // Update progress text
    const progressText = card.querySelector('.progress-bar__text');
    if (progressText) {
      progressText.textContent = progress === 0 ? 'Not Started' : `${progress}% Complete`;
    }
    
    // Update button text
    if (continueButton) {
      continueButton.textContent = progress === 0 ? 'Start' : 'Continue';
    }
  });
}

/**
 * Render achievements on the profile page
 * @param {Object} appState - The global application state
 */
function renderAchievements(appState) {
  const achievementsContainer = document.querySelector('.achievements-container');
  
  if (!achievementsContainer) {
    return;
  }
  
  // Get earned achievement IDs
  const earnedAchievementIds = appState.userProgress.achievements || [];
  
  // Get all achievements
  const allAchievements = appState.achievementData;
  
  // Clear achievements container
  achievementsContainer.innerHTML = '';
  
  // Create a section for earned achievements
  const earnedContainer = document.createElement('div');
  earnedContainer.className = 'achievements-earned';
  earnedContainer.innerHTML = '<h3>Earned Achievements</h3>';
  
  // Create a grid for earned achievements
  const earnedGrid = document.createElement('div');
  earnedGrid.className = 'achievements-grid';
  earnedContainer.appendChild(earnedGrid);
  
  // Create a section for locked achievements
  const lockedContainer = document.createElement('div');
  lockedContainer.className = 'achievements-locked';
  lockedContainer.innerHTML = '<h3>Locked Achievements</h3>';
  
  // Create a grid for locked achievements
  const lockedGrid = document.createElement('div');
  lockedGrid.className = 'achievements-grid';
  lockedContainer.appendChild(lockedGrid);
  
  // Populate achievements
  allAchievements.forEach(achievement => {
    const isEarned = earnedAchievementIds.includes(achievement.id);
    const achievementElement = createAchievementElement(achievement, isEarned);
    
    if (isEarned) {
      earnedGrid.appendChild(achievementElement);
    } else {
      lockedGrid.appendChild(achievementElement);
    }
  });
  
  // Add sections to container
  achievementsContainer.appendChild(earnedContainer);
  achievementsContainer.appendChild(lockedContainer);
}

/**
 * Create an achievement element
 * @param {Object} achievement - The achievement data
 * @param {boolean} isEarned - Whether the achievement has been earned
 * @returns {HTMLElement} The achievement element
 */
function createAchievementElement(achievement, isEarned) {
  const element = document.createElement('div');
  element.className = `achievement-card ${isEarned ? 'achievement-card--earned' : 'achievement-card--locked'}`;
  
  element.innerHTML = `
    <div class="achievement-card__pattern" style="background-color: ${isEarned ? 'var(--color-primary)' : 'var(--color-gray-400)'}"></div>
    <div class="achievement-card__icon">${isEarned ? '<Æ' : '='}</div>
    <h4 class="achievement-card__title">${achievement.title}</h4>
    <p class="achievement-card__description">${achievement.description}</p>
    ${isEarned ? `<p class="achievement-card__points">+${achievement.points} points</p>` : ''}
    ${isEarned && achievement.unlockedAt ? `<p class="achievement-card__date">Unlocked on ${new Date(achievement.unlockedAt).toLocaleDateString()}</p>` : ''}
  `;
  
  return element;
}

// Export functions
export { 
  initProgressTracker,
  markLessonCompleted,
  renderProgressOverview,
  renderAchievements
};