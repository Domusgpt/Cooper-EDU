/**
 * Data Service Module
 * 
 * Handles loading, caching, and providing data from JSON files
 * Implements efficient data access patterns with caching
 */

// Cache for loaded data
const dataCache = {
  courses: null,
  lessons: null,
  quizzes: null,
  achievements: null,
  lastFetched: {
    courses: null,
    lessons: null,
    quizzes: null,
    achievements: null
  }
};

// Cache expiration time in milliseconds (15 minutes)
const CACHE_EXPIRATION = 15 * 60 * 1000;

/**
 * Load all data needed for the application
 * @returns {Promise<Object>} The loaded data
 */
async function loadAllData() {
  try {
    // Fetch all data in parallel
    const [courses, lessons, quizzes, achievements] = await Promise.all([
      loadCourses(),
      loadLessons(),
      loadQuizzes(),
      loadAchievements()
    ]);
    
    return {
      courses,
      lessons,
      quizzes,
      achievements
    };
  } catch (error) {
    console.error('Error loading all data:', error);
    throw error;
  }
}

/**
 * Load courses data
 * @returns {Promise<Array>} The courses data
 */
async function loadCourses() {
  // Check cache first
  if (isCacheValid('courses')) {
    return dataCache.courses;
  }
  
  try {
    const response = await fetch('./data/courses.json');
    if (!response.ok) {
      throw new Error(`Failed to load courses: ${response.status} ${response.statusText}`);
    }
    
    const courses = await response.json();
    
    // Update cache
    dataCache.courses = courses;
    dataCache.lastFetched.courses = Date.now();
    
    return courses;
  } catch (error) {
    console.error('Error loading courses:', error);
    throw error;
  }
}

/**
 * Load lessons data
 * @returns {Promise<Array>} The lessons data
 */
async function loadLessons() {
  // Check cache first
  if (isCacheValid('lessons')) {
    return dataCache.lessons;
  }
  
  try {
    const response = await fetch('./data/lessons.json');
    if (!response.ok) {
      throw new Error(`Failed to load lessons: ${response.status} ${response.statusText}`);
    }
    
    const lessons = await response.json();
    
    // Update cache
    dataCache.lessons = lessons;
    dataCache.lastFetched.lessons = Date.now();
    
    return lessons;
  } catch (error) {
    console.error('Error loading lessons:', error);
    throw error;
  }
}

/**
 * Load quizzes data
 * @returns {Promise<Array>} The quizzes data
 */
async function loadQuizzes() {
  // Check cache first
  if (isCacheValid('quizzes')) {
    return dataCache.quizzes;
  }
  
  try {
    const response = await fetch('./data/quizzes.json');
    if (!response.ok) {
      throw new Error(`Failed to load quizzes: ${response.status} ${response.statusText}`);
    }
    
    const quizzes = await response.json();
    
    // Update cache
    dataCache.quizzes = quizzes;
    dataCache.lastFetched.quizzes = Date.now();
    
    return quizzes;
  } catch (error) {
    console.error('Error loading quizzes:', error);
    throw error;
  }
}

/**
 * Load achievements data
 * @returns {Promise<Array>} The achievements data
 */
async function loadAchievements() {
  // Check cache first
  if (isCacheValid('achievements')) {
    return dataCache.achievements;
  }
  
  try {
    const response = await fetch('./data/achievements.json');
    if (!response.ok) {
      throw new Error(`Failed to load achievements: ${response.status} ${response.statusText}`);
    }
    
    const achievements = await response.json();
    
    // Update cache
    dataCache.achievements = achievements;
    dataCache.lastFetched.achievements = Date.now();
    
    return achievements;
  } catch (error) {
    console.error('Error loading achievements:', error);
    throw error;
  }
}

/**
 * Check if the cache for a particular data type is valid
 * @param {string} dataType - The type of data ('courses', 'lessons', etc.)
 * @returns {boolean} Whether the cache is valid
 */
function isCacheValid(dataType) {
  if (!dataCache[dataType] || !dataCache.lastFetched[dataType]) {
    return false;
  }
  
  const now = Date.now();
  const lastFetched = dataCache.lastFetched[dataType];
  
  return now - lastFetched < CACHE_EXPIRATION;
}

/**
 * Clear the cache for a specific data type or all data
 * @param {string} [dataType] - The type of data to clear, or undefined to clear all
 */
function clearCache(dataType) {
  if (dataType) {
    dataCache[dataType] = null;
    dataCache.lastFetched[dataType] = null;
  } else {
    dataCache.courses = null;
    dataCache.lessons = null;
    dataCache.quizzes = null;
    dataCache.achievements = null;
    dataCache.lastFetched.courses = null;
    dataCache.lastFetched.lessons = null;
    dataCache.lastFetched.quizzes = null;
    dataCache.lastFetched.achievements = null;
  }
}

/**
 * Get a course by ID
 * @param {string|number} courseId - The course ID
 * @returns {Promise<Object>} The course data
 */
async function getCourse(courseId) {
  const courses = await loadCourses();
  return courses.find(course => course.id.toString() === courseId.toString());
}

/**
 * Get lessons for a course
 * @param {string|number} courseId - The course ID
 * @returns {Promise<Array>} The lessons for the course
 */
async function getCourseLessons(courseId) {
  const lessons = await loadLessons();
  return lessons.filter(lesson => lesson.courseId.toString() === courseId.toString())
    .sort((a, b) => a.number - b.number);
}

/**
 * Get a lesson by ID
 * @param {string|number} lessonId - The lesson ID
 * @returns {Promise<Object>} The lesson data
 */
async function getLesson(lessonId) {
  const lessons = await loadLessons();
  return lessons.find(lesson => lesson.id.toString() === lessonId.toString());
}

/**
 * Get a specific lesson in a course
 * @param {string|number} courseId - The course ID
 * @param {string|number} lessonId - The lesson ID
 * @returns {Promise<Object>} The lesson data
 */
async function getCourseLesson(courseId, lessonId) {
  const lessons = await loadLessons();
  return lessons.find(
    lesson => lesson.courseId.toString() === courseId.toString() && 
              lesson.id.toString() === lessonId.toString()
  );
}

/**
 * Get quizzes for a course
 * @param {string|number} courseId - The course ID
 * @returns {Promise<Array>} The quizzes for the course
 */
async function getCourseQuizzes(courseId) {
  const quizzes = await loadQuizzes();
  return quizzes.filter(quiz => quiz.courseId.toString() === courseId.toString());
}

/**
 * Get a quiz by ID
 * @param {string|number} quizId - The quiz ID
 * @returns {Promise<Object>} The quiz data
 */
async function getQuiz(quizId) {
  const quizzes = await loadQuizzes();
  return quizzes.find(quiz => quiz.id.toString() === quizId.toString());
}

/**
 * Get a specific quiz in a course
 * @param {string|number} courseId - The course ID
 * @param {string|number} quizId - The quiz ID
 * @returns {Promise<Object>} The quiz data
 */
async function getCourseQuiz(courseId, quizId) {
  const quizzes = await loadQuizzes();
  return quizzes.find(
    quiz => quiz.courseId.toString() === courseId.toString() && 
            quiz.id.toString() === quizId.toString()
  );
}

/**
 * Get achievement by ID
 * @param {string|number} achievementId - The achievement ID
 * @returns {Promise<Object>} The achievement data
 */
async function getAchievement(achievementId) {
  const achievements = await loadAchievements();
  return achievements.find(achievement => achievement.id.toString() === achievementId.toString());
}

/**
 * Get full course data with lessons and quizzes
 * @param {string|number} courseId - The course ID
 * @returns {Promise<Object>} The full course data
 */
async function getFullCourseData(courseId) {
  try {
    // Load all required data in parallel
    const [course, courseLessons, courseQuizzes] = await Promise.all([
      getCourse(courseId),
      getCourseLessons(courseId),
      getCourseQuizzes(courseId)
    ]);
    
    if (!course) {
      throw new Error(`Course with ID ${courseId} not found`);
    }
    
    // Return the complete course data
    return {
      ...course,
      lessons: courseLessons,
      quizzes: courseQuizzes
    };
  } catch (error) {
    console.error(`Error loading full course data for course ${courseId}:`, error);
    throw error;
  }
}

/**
 * Get full lesson data with navigation info
 * @param {string|number} courseId - The course ID
 * @param {string|number} lessonId - The lesson ID
 * @returns {Promise<Object>} The full lesson data
 */
async function getFullLessonData(courseId, lessonId) {
  try {
    // Load all required data in parallel
    const [lesson, course, courseLessons] = await Promise.all([
      getCourseLesson(courseId, lessonId),
      getCourse(courseId),
      getCourseLessons(courseId)
    ]);
    
    if (!lesson) {
      throw new Error(`Lesson with ID ${lessonId} in course ${courseId} not found`);
    }
    
    if (!course) {
      throw new Error(`Course with ID ${courseId} not found`);
    }
    
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
  } catch (error) {
    console.error(`Error loading full lesson data for lesson ${lessonId} in course ${courseId}:`, error);
    throw error;
  }
}

// Export functions
export {
  loadAllData,
  loadCourses,
  loadLessons,
  loadQuizzes,
  loadAchievements,
  clearCache,
  getCourse,
  getCourseLessons,
  getLesson,
  getCourseLesson,
  getCourseQuizzes,
  getQuiz,
  getCourseQuiz,
  getAchievement,
  getFullCourseData,
  getFullLessonData
};