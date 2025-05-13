/**
 * Course Progress Component
 * 
 * This module provides functionality for displaying and updating course progress
 * using the state management system. It visualizes progress with both standard
 * progress bars and the pattern visualization system.
 */

import stateManager from '../state-manager.js';
import { updatePattern } from '../pattern-visualizer.js';

/**
 * Initialize course progress components
 * @param {string} courseId - ID of the course to display progress for
 */
export function initCourseProgress(courseId) {
  // Get DOM elements
  const progressContainer = document.querySelector('.course-progress');
  if (!progressContainer) return;
  
  const progressBar = progressContainer.querySelector('.progress-bar__fill');
  const progressText = progressContainer.querySelector('.progress-bar__text');
  const progressPattern = progressContainer.querySelector('.progress-pattern');
  
  // Subscribe to course progress changes
  const progressStore = stateManager.getStore('progress');
  const unsubscribe = progressStore.subscribe('courseProgress', (courseProgress) => {
    const progress = courseProgress[courseId] || { percentComplete: 0, completed: false };
    
    // Update progress bar
    if (progressBar) {
      progressBar.style.width = `${progress.percentComplete}%`;
    }
    
    // Update progress text
    if (progressText) {
      progressText.textContent = `${Math.round(progress.percentComplete)}% Complete`;
    }
    
    // Update pattern visualization if available
    if (progressPattern) {
      updatePattern(progressPattern, {
        percentComplete: progress.percentComplete / 100,
        completed: progress.completed
      });
    }
    
    // Add completion class if course is completed
    if (progress.completed) {
      progressContainer.classList.add('course-progress--completed');
    } else {
      progressContainer.classList.remove('course-progress--completed');
    }
  });
  
  // Clean up subscription when component is removed
  const cleanup = () => {
    unsubscribe();
  };
  
  // Return cleanup function for when component is destroyed
  return cleanup;
}

/**
 * Render course progress list for the profile page
 * @param {HTMLElement} container - Container element to render progress list into
 */
export function renderCourseProgressList(container) {
  if (!container) return;
  
  // Get all courses and progress data
  const courseStore = stateManager.getStore('course');
  const progressStore = stateManager.getStore('progress');
  
  const courses = courseStore.getValue('courses');
  const courseProgress = progressStore.getValue('courseProgress');
  
  // Clear container
  container.innerHTML = '';
  
  // Filter to courses with progress
  const coursesWithProgress = courses.filter(course => 
    courseProgress[course.id] && courseProgress[course.id].percentComplete > 0
  );
  
  // Sort by completion percentage (descending)
  coursesWithProgress.sort((a, b) => {
    const progressA = courseProgress[a.id].percentComplete || 0;
    const progressB = courseProgress[b.id].percentComplete || 0;
    return progressB - progressA;
  });
  
  // If no courses with progress, show message
  if (coursesWithProgress.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3 class="empty-state__title">No courses in progress</h3>
        <p class="empty-state__message">Start a course to track your progress here.</p>
        <a href="course-catalog.html" class="btn btn--primary">Browse Courses</a>
      </div>
    `;
    return;
  }
  
  // Create a list of course progress items
  const progressList = document.createElement('ul');
  progressList.className = 'course-progress-list';
  
  coursesWithProgress.forEach(course => {
    const progress = courseProgress[course.id];
    const percentComplete = progress.percentComplete || 0;
    const completed = progress.completed || false;
    
    // Create list item
    const listItem = document.createElement('li');
    listItem.className = 'course-progress-item';
    if (completed) {
      listItem.classList.add('course-progress-item--completed');
    }
    
    // Construct item HTML
    listItem.innerHTML = `
      <div class="course-progress-item__header">
        <h4 class="course-progress-item__title">${course.title}</h4>
        <span class="course-progress-item__percent">${Math.round(percentComplete)}%</span>
      </div>
      <div class="course-progress-item__bar">
        <div class="progress-bar">
          <div class="progress-bar__fill" style="width: ${percentComplete}%"></div>
        </div>
      </div>
      <div class="course-progress-item__footer">
        <span class="course-progress-item__status">
          ${completed ? 'Completed' : 'In Progress'}
        </span>
        <a href="course-detail.html?id=${course.id}" class="btn btn--sm btn--outline">
          ${completed ? 'Review' : 'Continue'}
        </a>
      </div>
    `;
    
    // Add to list
    progressList.appendChild(listItem);
  });
  
  // Add list to container
  container.appendChild(progressList);
  
  // Add pattern visualization to completed courses
  coursesWithProgress.forEach(course => {
    const progress = courseProgress[course.id];
    if (progress.completed) {
      const listItem = container.querySelector(`.course-progress-item[data-course-id="${course.id}"]`);
      if (listItem) {
        const patternContainer = document.createElement('div');
        patternContainer.className = 'course-progress-item__pattern';
        listItem.appendChild(patternContainer);
        
        // Initialize pattern visualization
        updatePattern(patternContainer, {
          percentComplete: 1.0,
          completed: true,
          courseId: course.id
        });
      }
    }
  });
}

/**
 * Update lesson progress in the state manager
 * @param {string} courseId - ID of the course
 * @param {string} lessonId - ID of the lesson
 * @param {boolean} completed - Whether the lesson is completed
 * @param {Object} additionalData - Additional progress data
 */
export function updateLessonProgress(courseId, lessonId, completed, additionalData = {}) {
  // Update lesson progress in state manager
  stateManager.updateLessonProgress(courseId, lessonId, {
    completed,
    status: completed ? 'completed' : 'in_progress',
    lastUpdated: new Date().toISOString(),
    ...additionalData
  });
  
  // Dispatch custom event for other components to react to
  const event = new CustomEvent('lesson:progressUpdated', {
    detail: {
      courseId,
      lessonId,
      completed,
      additionalData
    }
  });
  document.dispatchEvent(event);
}

/**
 * Initialize progress visualization on the course page
 * Shows lesson completion status in the sidebar
 * @param {string} courseId - ID of the course
 */
export function initLessonProgressVisualization(courseId) {
  const lessonItems = document.querySelectorAll('.lesson-navigation__item');
  if (lessonItems.length === 0) return;
  
  // Get progress data
  const progressStore = stateManager.getStore('progress');
  const lessonProgress = progressStore.getValue('lessonProgress');
  
  // Update lesson items with progress status
  lessonItems.forEach(item => {
    const lessonId = item.getAttribute('data-lesson-id');
    if (!lessonId) return;
    
    const progress = lessonProgress[lessonId];
    if (progress && progress.completed) {
      item.classList.add('lesson-navigation__item--completed');
      
      // Add completion icon
      const icon = document.createElement('span');
      icon.className = 'lesson-navigation__completed-icon';
      icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>`;
      item.appendChild(icon);
    }
  });
  
  // Subscribe to progress changes
  const unsubscribe = progressStore.subscribe('lessonProgress', (newLessonProgress) => {
    lessonItems.forEach(item => {
      const lessonId = item.getAttribute('data-lesson-id');
      if (!lessonId) return;
      
      const progress = newLessonProgress[lessonId];
      const completedClass = 'lesson-navigation__item--completed';
      
      if (progress && progress.completed) {
        // Add completed class if not already present
        if (!item.classList.contains(completedClass)) {
          item.classList.add(completedClass);
          
          // Add completion icon if not present
          if (!item.querySelector('.lesson-navigation__completed-icon')) {
            const icon = document.createElement('span');
            icon.className = 'lesson-navigation__completed-icon';
            icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>`;
            item.appendChild(icon);
          }
        }
      } else {
        // Remove completed class if present
        if (item.classList.contains(completedClass)) {
          item.classList.remove(completedClass);
          
          // Remove completion icon
          const icon = item.querySelector('.lesson-navigation__completed-icon');
          if (icon) {
            icon.remove();
          }
        }
      }
    });
  });
  
  // Return cleanup function
  return unsubscribe;
}

/**
 * Calculate overall progress for the dashboard
 * @returns {HTMLElement} Progress summary element
 */
export function createProgressSummary() {
  const progressStore = stateManager.getStore('progress');
  const overallProgress = progressStore.getValue('overallProgress');
  
  // Create summary element
  const summaryEl = document.createElement('div');
  summaryEl.className = 'progress-summary';
  
  // Populate with initial data
  summaryEl.innerHTML = `
    <div class="progress-summary__chart">
      <svg viewBox="0 0 36 36" class="progress-chart">
        <path class="progress-chart__bg"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="var(--color-neutral-200)"
          stroke-width="3"
          stroke-dasharray="100, 100"
        />
        <path class="progress-chart__fill"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="var(--color-primary)"
          stroke-width="3"
          stroke-dasharray="${overallProgress.percentComplete}, 100"
        />
        <text x="18" y="20.35" class="progress-chart__text">
          ${Math.round(overallProgress.percentComplete)}%
        </text>
      </svg>
    </div>
    <div class="progress-summary__stats">
      <div class="progress-summary__stat">
        <span class="progress-summary__value">${overallProgress.completedCourses}</span>
        <span class="progress-summary__label">Courses Completed</span>
      </div>
      <div class="progress-summary__stat">
        <span class="progress-summary__value">${overallProgress.achievementCount}</span>
        <span class="progress-summary__label">Achievements</span>
      </div>
    </div>
  `;
  
  // Subscribe to progress changes
  const unsubscribe = progressStore.subscribe('overallProgress', (newProgress) => {
    // Update chart fill
    const chartFill = summaryEl.querySelector('.progress-chart__fill');
    if (chartFill) {
      chartFill.setAttribute('stroke-dasharray', `${newProgress.percentComplete}, 100`);
    }
    
    // Update percentage text
    const chartText = summaryEl.querySelector('.progress-chart__text');
    if (chartText) {
      chartText.textContent = `${Math.round(newProgress.percentComplete)}%`;
    }
    
    // Update stats values
    const completedValue = summaryEl.querySelector('.progress-summary__stat:nth-child(1) .progress-summary__value');
    if (completedValue) {
      completedValue.textContent = newProgress.completedCourses;
    }
    
    const achievementsValue = summaryEl.querySelector('.progress-summary__stat:nth-child(2) .progress-summary__value');
    if (achievementsValue) {
      achievementsValue.textContent = newProgress.achievementCount;
    }
  });
  
  // Store unsubscribe function for cleanup
  summaryEl.dataset.unsubscribe = 'true';
  summaryEl._cleanup = unsubscribe;
  
  return summaryEl;
}

/**
 * Clean up all progress component subscriptions
 * @param {HTMLElement} container - Container element that might contain progress components
 */
export function cleanupProgressComponents(container) {
  if (!container) return;
  
  // Find all elements with cleanup functions
  const elementsWithCleanup = container.querySelectorAll('[data-unsubscribe="true"]');
  elementsWithCleanup.forEach(element => {
    if (typeof element._cleanup === 'function') {
      element._cleanup();
    }
  });
}