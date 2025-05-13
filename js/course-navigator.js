/**
 * Course Navigator Module
 * 
 * Handles navigation between courses, lessons, and manages the course structure
 */

/**
 * Initialize the course navigator
 * @param {Object} appState - The global application state
 */
function initCourseNavigator(appState) {
  console.log('Initializing Course Navigator...');
  
  // Initialize event listeners for navigation elements
  attachNavigationEventListeners();
}

/**
 * Attach event listeners to navigation elements
 */
function attachNavigationEventListeners() {
  // Add event listeners to lesson navigation items
  const lessonLinks = document.querySelectorAll('.lesson-list__item a');
  lessonLinks.forEach(link => {
    link.addEventListener('click', handleLessonNavigation);
  });
  
  // Add event listeners to course cards
  const courseCards = document.querySelectorAll('.course-card a');
  courseCards.forEach(link => {
    link.addEventListener('click', handleCourseNavigation);
  });
  
  // Add event listeners to navigation buttons in lesson footer
  const navButtons = document.querySelectorAll('.lesson-navigation-buttons a');
  navButtons.forEach(button => {
    button.addEventListener('click', handleLessonNavigation);
  });
}

/**
 * Handle navigation to a lesson
 * @param {Event} event - The click event
 */
function handleLessonNavigation(event) {
  // Navigation logic handled by href attribute in most cases,
  // but we could add additional functionality here if needed
  
  // Example: Tracking lesson navigation events
  const targetUrl = event.currentTarget.getAttribute('href');
  console.log(`Navigating to lesson: ${targetUrl}`);
}

/**
 * Handle navigation to a course
 * @param {Event} event - The click event
 */
function handleCourseNavigation(event) {
  // Navigation logic handled by href attribute in most cases,
  // but we could add additional functionality here if needed
  
  // Example: Tracking course navigation events
  const targetUrl = event.currentTarget.getAttribute('href');
  console.log(`Navigating to course: ${targetUrl}`);
}

/**
 * Load course data for a specific course
 * @param {string|number} courseId - The ID of the course to load
 * @returns {Object} The course data
 */
function loadCourseData(courseId, appState) {
  // Find the course in the app state
  const course = appState.courseData.find(course => course.id.toString() === courseId.toString());
  
  if (!course) {
    console.error(`Course with ID ${courseId} not found`);
    return null;
  }
  
  // Find lessons for this course
  const courseLessons = appState.lessonData.filter(lesson => lesson.courseId.toString() === courseId.toString());
  
  // Sort lessons by lesson number
  courseLessons.sort((a, b) => a.number - b.number);
  
  // Find quizzes for this course
  const courseQuizzes = appState.quizData.filter(quiz => quiz.courseId.toString() === courseId.toString());
  
  // Return the complete course data
  return {
    ...course,
    lessons: courseLessons,
    quizzes: courseQuizzes
  };
}

/**
 * Load lesson data for a specific lesson
 * @param {string|number} courseId - The ID of the course
 * @param {string|number} lessonId - The ID of the lesson
 * @returns {Object} The lesson data
 */
function loadLessonData(courseId, lessonId, appState) {
  // Find the lesson in the app state
  const lesson = appState.lessonData.find(
    lesson => lesson.courseId.toString() === courseId.toString() && 
              lesson.id.toString() === lessonId.toString()
  );
  
  if (!lesson) {
    console.error(`Lesson with ID ${lessonId} in course ${courseId} not found`);
    return null;
  }
  
  // Find the course
  const course = appState.courseData.find(course => course.id.toString() === courseId.toString());
  
  // Find all lessons for this course to determine previous and next lessons
  const courseLessons = appState.lessonData.filter(lesson => lesson.courseId.toString() === courseId.toString());
  
  // Sort lessons by lesson number
  courseLessons.sort((a, b) => a.number - b.number);
  
  // Find index of current lesson
  const currentIndex = courseLessons.findIndex(l => l.id.toString() === lessonId.toString());
  
  // Determine previous and next lessons
  const previousLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null;
  
  // Return the complete lesson data with navigation information
  return {
    ...lesson,
    course,
    previousLesson,
    nextLesson
  };
}

/**
 * Render the lesson sidebar based on course data
 * @param {string|number} courseId - The ID of the course
 * @param {string|number} currentLessonId - The ID of the current lesson
 */
function renderLessonSidebar(courseId, currentLessonId, appState) {
  const courseData = loadCourseData(courseId, appState);
  
  if (!courseData) {
    return;
  }
  
  // Get the sidebar element
  const sidebar = document.querySelector('.lesson-sidebar');
  
  if (!sidebar) {
    return;
  }
  
  // Update course info
  const courseTitle = sidebar.querySelector('.course-info__title');
  if (courseTitle) {
    courseTitle.textContent = courseData.title;
  }
  
  // Update progress bar
  const progressBar = sidebar.querySelector('.progress-bar__fill');
  if (progressBar) {
    progressBar.style.width = `${courseData.progress}%`;
  }
  
  const progressText = sidebar.querySelector('.progress-bar__text');
  if (progressText) {
    progressText.textContent = `${courseData.progress}% Complete`;
  }
  
  // Update lesson list
  const lessonList = sidebar.querySelector('.lesson-list');
  if (lessonList) {
    // Clear existing items
    lessonList.innerHTML = '';
    
    // Helper to create a lesson list item
    const createLessonItem = (lesson, isQuiz = false) => {
      const item = document.createElement('li');
      item.className = 'lesson-list__item';
      
      if (isQuiz) {
        // Determine if this quiz would come after the current lesson
        const quizPosition = courseData.lessons.findIndex(l => l.id.toString() === currentLessonId.toString());
        const quizIndex = courseData.lessons.length - 1; // Assume quiz is at the end by default
        
        if (quizPosition <= quizIndex) {
          item.className += ' lesson-list__item--upcoming';
        }
        
        item.innerHTML = `
          <a href="quiz.html?course=${courseId}&quiz=${lesson.id}">
            <span class="quiz-indicator">Quiz:</span> ${lesson.title}
          </a>
        `;
      } else {
        // Check if this lesson is the current one
        if (lesson.id.toString() === currentLessonId.toString()) {
          item.className += ' lesson-list__item--active';
        }
        
        // Check if this lesson is completed
        if (appState.userProgress.completedLessons.includes(lesson.id)) {
          item.className += ' lesson-list__item--completed';
        }
        
        item.innerHTML = `
          <a href="lesson.html?course=${courseId}&lesson=${lesson.id}">
            ${lesson.number}. ${lesson.title}
          </a>
        `;
      }
      
      return item;
    };
    
    // Add lessons and quizzes in the correct order
    let quizIndex = 0;
    courseData.lessons.forEach(lesson => {
      // Add the lesson
      lessonList.appendChild(createLessonItem(lesson));
      
      // Check if there should be a quiz after this lesson
      // This is a simplified approach - in a real app, quiz placement would be defined in the course structure
      if (quizIndex < courseData.quizzes.length && 
          (lesson.number === Math.floor(courseData.lessons.length / 2) || 
           lesson.number === courseData.lessons.length)) {
        lessonList.appendChild(createLessonItem(courseData.quizzes[quizIndex], true));
        quizIndex++;
      }
    });
  }
}

// Export functions
export { 
  initCourseNavigator,
  loadCourseData,
  loadLessonData,
  renderLessonSidebar
};