/**
 * State Manager - Core system for managing application state
 * 
 * This module provides a centralized state management system for the
 * Cooper Educational Platform. It implements the Observable pattern
 * to allow components to react to state changes, while maintaining
 * a single source of truth for application data.
 */

/**
 * Observable class that notifies subscribers when its value changes
 */
class Observable {
  /**
   * Create a new Observable
   * @param {*} initialValue - The initial value of the observable
   */
  constructor(initialValue) {
    this._value = initialValue;
    this._observers = [];
  }
  
  /**
   * Get the current value
   * @returns {*} The current value
   */
  get value() {
    return this._value;
  }
  
  /**
   * Set a new value and notify all subscribers
   * @param {*} newValue - The new value
   */
  set value(newValue) {
    const oldValue = this._value;
    this._value = newValue;
    this._notifyObservers(newValue, oldValue);
  }
  
  /**
   * Update a portion of the value (for objects)
   * @param {Object} updates - Object with properties to update
   */
  update(updates) {
    if (typeof this._value === 'object' && !Array.isArray(this._value)) {
      const oldValue = { ...this._value };
      this._value = { ...this._value, ...updates };
      this._notifyObservers(this._value, oldValue);
    } else {
      throw new Error('Update can only be used with object values');
    }
  }
  
  /**
   * Subscribe to value changes
   * @param {Function} observer - Callback function that receives (newValue, oldValue)
   * @returns {Function} Unsubscribe function
   */
  subscribe(observer) {
    this._observers.push(observer);
    // Return unsubscribe function
    return () => {
      this._observers = this._observers.filter(obs => obs !== observer);
    };
  }
  
  /**
   * Notify all observers of a value change
   * @private
   * @param {*} newValue - The new value
   * @param {*} oldValue - The previous value
   */
  _notifyObservers(newValue, oldValue) {
    this._observers.forEach(observer => observer(newValue, oldValue));
  }
}

/**
 * Store class that manages a section of application state
 */
class Store {
  /**
   * Create a new store
   * @param {Object} initialState - Initial state object
   */
  constructor(initialState = {}) {
    this._state = {};
    
    // Create observables for each state property
    Object.keys(initialState).forEach(key => {
      this._state[key] = new Observable(initialState[key]);
    });
  }
  
  /**
   * Get the observable for a state property
   * @param {string} key - State property name
   * @returns {Observable} Observable for the state property
   */
  getState(key) {
    if (!this._state[key]) {
      throw new Error(`State property "${key}" does not exist`);
    }
    return this._state[key];
  }
  
  /**
   * Get the current value of a state property
   * @param {string} key - State property name
   * @returns {*} Current value
   */
  getValue(key) {
    return this.getState(key).value;
  }
  
  /**
   * Update a state property
   * @param {string} key - State property name
   * @param {*} value - New value
   */
  setState(key, value) {
    if (this._state[key]) {
      this._state[key].value = value;
    } else {
      this._state[key] = new Observable(value);
    }
  }
  
  /**
   * Update properties of an object state
   * @param {string} key - State property name (must be an object)
   * @param {Object} updates - Object with properties to update
   */
  updateState(key, updates) {
    if (!this._state[key]) {
      this._state[key] = new Observable({});
    }
    
    this._state[key].update(updates);
  }
  
  /**
   * Subscribe to changes in a state property
   * @param {string} key - State property name
   * @param {Function} callback - Callback function that receives (newValue, oldValue)
   * @returns {Function} Unsubscribe function
   */
  subscribe(key, callback) {
    return this.getState(key).subscribe(callback);
  }
  
  /**
   * Create a derived state that depends on one or more other states
   * @param {string} key - New derived state name
   * @param {Array<string>} dependencies - Array of state property names this depends on
   * @param {Function} computeFn - Function that computes the derived value from dependencies
   * @returns {Observable} The created derived state observable
   */
  createDerivedState(key, dependencies, computeFn) {
    // Create new observable for derived state
    const derivedObservable = new Observable(
      computeFn(...dependencies.map(dep => this.getValue(dep)))
    );
    
    // Update derived state when any dependency changes
    const unsubscribers = dependencies.map(dep => 
      this.subscribe(dep, () => {
        const newDerivedValue = computeFn(
          ...dependencies.map(dep => this.getValue(dep))
        );
        derivedObservable.value = newDerivedValue;
      })
    );
    
    // Store the derived observable
    this._state[key] = derivedObservable;
    
    // Add method to unsubscribe all dependencies
    derivedObservable.unsubscribeAll = () => {
      unsubscribers.forEach(unsub => unsub());
    };
    
    return derivedObservable;
  }
}

/**
 * StateManager singleton that provides global application state
 */
class StateManager {
  constructor() {
    if (StateManager.instance) {
      return StateManager.instance;
    }
    
    // Create stores for different domains
    this.userStore = new Store({
      profile: null,
      preferences: { theme: 'light', notifications: true },
      isAuthenticated: false
    });
    
    this.courseStore = new Store({
      courses: [],
      currentCourse: null,
      currentLesson: null,
      filters: { category: null, difficulty: null, search: '' }
    });
    
    this.progressStore = new Store({
      courseProgress: {}, // courseId -> { completed, percentComplete, lastAccessed }
      lessonProgress: {}, // lessonId -> { completed, status, interactions }
      achievements: [], // unlocked achievements
      streaks: { current: 0, longest: 0, lastActive: null }
    });
    
    this.uiStore = new Store({
      isLoading: false,
      activeView: 'dashboard',
      sidebarOpen: false,
      notifications: [],
      modals: { active: null, data: null }
    });
    
    // Setup persistence (if available)
    this._setupPersistence();
    
    // Setup derived states
    this._setupDerivedStates();
    
    StateManager.instance = this;
  }
  
  /**
   * Get the store for a specific domain
   * @param {string} storeName - Name of the store ('user', 'course', 'progress', 'ui')
   * @returns {Store} The requested store
   */
  getStore(storeName) {
    const storeMap = {
      user: this.userStore,
      course: this.courseStore,
      progress: this.progressStore,
      ui: this.uiStore
    };
    
    if (!storeMap[storeName]) {
      throw new Error(`Store "${storeName}" does not exist`);
    }
    
    return storeMap[storeName];
  }
  
  /**
   * Initialize the state manager with initial data
   * @param {Object} initialData - Initial data for stores
   */
  initialize(initialData = {}) {
    // Load initial data into stores
    Object.keys(initialData).forEach(storeName => {
      const store = this.getStore(storeName);
      const storeData = initialData[storeName];
      
      Object.keys(storeData).forEach(key => {
        store.setState(key, storeData[key]);
      });
    });
    
    // Dispatch initialization event
    const event = new CustomEvent('stateManager:initialized');
    document.dispatchEvent(event);
  }
  
  /**
   * Setup localStorage persistence for certain state
   * @private
   */
  _setupPersistence() {
    // Load persisted data on initialization
    try {
      const persistedUserData = localStorage.getItem('cooper_user_preferences');
      if (persistedUserData) {
        const userData = JSON.parse(persistedUserData);
        this.userStore.setState('preferences', userData);
      }
      
      const persistedProgress = localStorage.getItem('cooper_progress');
      if (persistedProgress) {
        const progressData = JSON.parse(persistedProgress);
        this.progressStore.setState('courseProgress', progressData.courseProgress || {});
        this.progressStore.setState('lessonProgress', progressData.lessonProgress || {});
        this.progressStore.setState('achievements', progressData.achievements || []);
      }
    } catch (error) {
      console.error('Error loading persisted state:', error);
    }
    
    // Persist user preferences when they change
    this.userStore.subscribe('preferences', (newPreferences) => {
      try {
        localStorage.setItem('cooper_user_preferences', JSON.stringify(newPreferences));
      } catch (error) {
        console.error('Error persisting user preferences:', error);
      }
    });
    
    // Persist progress data when it changes
    const persistProgress = () => {
      try {
        const progressData = {
          courseProgress: this.progressStore.getValue('courseProgress'),
          lessonProgress: this.progressStore.getValue('lessonProgress'),
          achievements: this.progressStore.getValue('achievements')
        };
        localStorage.setItem('cooper_progress', JSON.stringify(progressData));
      } catch (error) {
        console.error('Error persisting progress data:', error);
      }
    };
    
    this.progressStore.subscribe('courseProgress', persistProgress);
    this.progressStore.subscribe('lessonProgress', persistProgress);
    this.progressStore.subscribe('achievements', persistProgress);
  }
  
  /**
   * Setup derived states that depend on other state values
   * @private
   */
  _setupDerivedStates() {
    // Derive filtered courses from courses and filters
    this.courseStore.createDerivedState(
      'filteredCourses',
      ['courses', 'filters'],
      (courses, filters) => {
        return courses.filter(course => {
          let matchesCategory = true;
          let matchesDifficulty = true;
          let matchesSearch = true;
          
          if (filters.category) {
            matchesCategory = course.category === filters.category;
          }
          
          if (filters.difficulty) {
            matchesDifficulty = course.difficulty === filters.difficulty;
          }
          
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            matchesSearch = 
              course.title.toLowerCase().includes(searchLower) ||
              course.description.toLowerCase().includes(searchLower);
          }
          
          return matchesCategory && matchesDifficulty && matchesSearch;
        });
      }
    );
    
    // Derive current course progress
    this.progressStore.createDerivedState(
      'currentCourseProgress',
      ['courseProgress', 'lessonProgress'],
      (courseProgress, lessonProgress) => {
        const currentCourse = this.courseStore.getValue('currentCourse');
        if (!currentCourse) return null;
        
        const courseId = currentCourse.id;
        const courseProgressData = courseProgress[courseId] || { percentComplete: 0, completed: false };
        
        // Find lessons for this course
        const currentCourseLessons = currentCourse.lessons || [];
        const lessonProgressForCourse = currentCourseLessons.map(lessonId => {
          return lessonProgress[lessonId] || { completed: false, status: 'not_started' };
        });
        
        // Calculate additional progress metrics
        const completedLessons = lessonProgressForCourse.filter(lp => lp.completed).length;
        const totalLessons = currentCourseLessons.length;
        const percentComplete = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
        
        return {
          ...courseProgressData,
          lessonProgress: lessonProgressForCourse,
          completedLessons,
          totalLessons,
          percentComplete
        };
      }
    );
    
    // Derive overall user progress
    this.progressStore.createDerivedState(
      'overallProgress',
      ['courseProgress', 'achievements'],
      (courseProgress, achievements) => {
        const courses = this.courseStore.getValue('courses');
        
        if (!courses || courses.length === 0) {
          return { percentComplete: 0, completedCourses: 0, totalCourses: 0 };
        }
        
        const completedCourses = courses.filter(course => 
          courseProgress[course.id]?.completed
        ).length;
        
        const totalCourses = courses.length;
        const percentComplete = (completedCourses / totalCourses) * 100;
        
        return {
          percentComplete,
          completedCourses,
          totalCourses,
          achievementCount: achievements.length
        };
      }
    );
  }
  
  /**
   * Update user course progress
   * @param {string} courseId - ID of the course
   * @param {string} lessonId - ID of the lesson
   * @param {Object} progressUpdate - Progress data to update
   */
  updateLessonProgress(courseId, lessonId, progressUpdate) {
    // Update lesson progress
    const currentLessonProgress = this.progressStore.getValue('lessonProgress')[lessonId] || {};
    this.progressStore.updateState('lessonProgress', {
      [lessonId]: { ...currentLessonProgress, ...progressUpdate }
    });
    
    // Check if this completes the lesson
    if (progressUpdate.completed) {
      // Update course progress
      const course = this.courseStore.getValue('courses').find(c => c.id === courseId);
      if (course) {
        const lessonIds = course.lessons || [];
        const lessonProgress = this.progressStore.getValue('lessonProgress');
        
        // Check if all lessons are completed
        const allLessonsCompleted = lessonIds.every(id => lessonProgress[id]?.completed);
        
        // Calculate percentage complete
        const completedLessons = lessonIds.filter(id => lessonProgress[id]?.completed).length;
        const percentComplete = (completedLessons / lessonIds.length) * 100;
        
        // Update course progress
        const currentCourseProgress = this.progressStore.getValue('courseProgress')[courseId] || {};
        this.progressStore.updateState('courseProgress', {
          [courseId]: {
            ...currentCourseProgress,
            percentComplete,
            completed: allLessonsCompleted,
            lastAccessed: new Date().toISOString()
          }
        });
        
        // If course completed, check for achievements
        if (allLessonsCompleted) {
          this._checkCourseCompletionAchievements(courseId);
        }
      }
    }
    
    // Update streak information
    this._updateStreak();
  }
  
  /**
   * Check and award achievements for course completion
   * @private
   * @param {string} courseId - ID of the completed course
   */
  _checkCourseCompletionAchievements(courseId) {
    // Get current achievements
    const currentAchievements = this.progressStore.getValue('achievements');
    
    // Get achievement definitions from data service (placeholder)
    // In a real implementation, this would come from the data-service.js module
    const achievementDefinitions = [
      { id: 'ach-course-complete', type: 'course_completion', criteria: { courseId } },
      { id: 'ach-perfect-score', type: 'course_completion', criteria: { courseId, minScore: 95 } }
    ];
    
    // Find achievements for this course completion
    const courseAchievements = achievementDefinitions.filter(achievement => {
      return achievement.type === 'course_completion' && 
             achievement.criteria.courseId === courseId &&
             !currentAchievements.includes(achievement.id);
    });
    
    // Award achievements
    if (courseAchievements.length > 0) {
      const newAchievements = [
        ...currentAchievements,
        ...courseAchievements.map(a => a.id)
      ];
      
      this.progressStore.setState('achievements', newAchievements);
      
      // Dispatch achievement event for UI notification
      courseAchievements.forEach(achievement => {
        const event = new CustomEvent('achievement:unlocked', {
          detail: { achievementId: achievement.id }
        });
        document.dispatchEvent(event);
      });
    }
  }
  
  /**
   * Update user learning streak
   * @private
   */
  _updateStreak() {
    const currentStreaks = this.progressStore.getValue('streaks');
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // If already logged activity today, no update needed
    if (currentStreaks.lastActive === today) {
      return;
    }
    
    // Check if last activity was yesterday
    let updatedStreak = { ...currentStreaks };
    updatedStreak.lastActive = today;
    
    if (currentStreaks.lastActive) {
      const lastActiveDate = new Date(currentStreaks.lastActive);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Format yesterday as YYYY-MM-DD
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (currentStreaks.lastActive === yesterdayStr) {
        // Continue streak
        updatedStreak.current += 1;
        
        // Update longest streak if needed
        if (updatedStreak.current > updatedStreak.longest) {
          updatedStreak.longest = updatedStreak.current;
        }
      } else {
        // Streak broken, reset to 1
        updatedStreak.current = 1;
      }
    } else {
      // First activity, start streak at 1
      updatedStreak.current = 1;
      updatedStreak.longest = 1;
    }
    
    this.progressStore.setState('streaks', updatedStreak);
    
    // Check streak achievements
    this._checkStreakAchievements(updatedStreak.current);
  }
  
  /**
   * Check and award achievements for streaks
   * @private
   * @param {number} currentStreak - Current streak count
   */
  _checkStreakAchievements(currentStreak) {
    // Streak milestone thresholds
    const streakMilestones = [3, 7, 14, 30, 60, 90, 180, 365];
    
    // Check if current streak hits a milestone
    const milestone = streakMilestones.find(m => m === currentStreak);
    if (!milestone) return;
    
    // Award achievement if milestone reached
    const achievementId = `ach-streak-${milestone}`;
    
    // Check if already awarded
    const currentAchievements = this.progressStore.getValue('achievements');
    if (currentAchievements.includes(achievementId)) {
      return;
    }
    
    // Award achievement
    this.progressStore.setState('achievements', [
      ...currentAchievements,
      achievementId
    ]);
    
    // Dispatch achievement event
    const event = new CustomEvent('achievement:unlocked', {
      detail: { achievementId }
    });
    document.dispatchEvent(event);
  }
}

// Create and export the singleton instance
const stateManager = new StateManager();
export default stateManager;