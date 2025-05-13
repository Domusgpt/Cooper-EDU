/**
 * Course Catalog Module
 * 
 * Handles the course catalog page functionality:
 * - Loading and displaying courses
 * - Filtering and searching courses
 * - Course card interactions
 */

import { loadCourses } from './data-service.js';

/**
 * Initialize the course catalog page
 */
async function initCourseCatalog() {
  console.log('Initializing Course Catalog...');
  
  try {
    // Load courses data
    const courses = await loadCourses();
    
    // Render courses
    renderCourses(courses);
    
    // Initialize search and filters
    initSearch(courses);
    initFilters(courses);
    
    // Initialize pagination
    initPagination(courses.length);
  } catch (error) {
    console.error('Error initializing course catalog:', error);
    // Show a user-friendly error message
    showCatalogError('Failed to load courses. Please try again later.');
  }
}

/**
 * Render courses in the catalog
 * @param {Array} courses - The courses data
 * @param {Object} filters - Optional filters to apply
 */
function renderCourses(courses, filters = null) {
  const coursesGrid = document.querySelector('.courses-grid');
  
  if (!coursesGrid) {
    console.error('Courses grid element not found');
    return;
  }
  
  // Clear existing courses
  coursesGrid.innerHTML = '';
  
  // Filter courses if filters are provided
  let filteredCourses = courses;
  if (filters) {
    filteredCourses = filterCourses(courses, filters);
  }
  
  // Handle empty results
  if (filteredCourses.length === 0) {
    coursesGrid.innerHTML = `
      <div class="no-results">
        <p>No courses match your filters. Try adjusting your search criteria.</p>
        <button class="button button--secondary clear-filters-button">Clear Filters</button>
      </div>
    `;
    
    const clearButton = coursesGrid.querySelector('.clear-filters-button');
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        // Reset filters and re-render
        resetFilters();
        renderCourses(courses);
      });
    }
    
    return;
  }
  
  // Create course cards
  filteredCourses.forEach(course => {
    const courseCard = createCourseCard(course);
    coursesGrid.appendChild(courseCard);
  });
  
  // Update pagination
  updatePagination(filteredCourses.length);
}

/**
 * Create a course card element
 * @param {Object} course - The course data
 * @returns {HTMLElement} The course card element
 */
function createCourseCard(course) {
  const card = document.createElement('div');
  card.className = 'course-card';
  card.dataset.courseId = course.id;
  
  card.innerHTML = `
    <div class="course-card__pattern" data-pattern="${course.pattern}"></div>
    <div class="course-card__content">
      <div class="course-card__header">
        <h3 class="course-card__title">${course.title}</h3>
        <span class="course-card__difficulty">${capitalizeFirstLetter(course.difficulty)}</span>
      </div>
      <p class="course-card__description">${course.description}</p>
      <div class="course-card__meta">
        <span class="course-card__lessons">${course.lessons} Lessons</span>
        <span class="course-card__duration">${formatDuration(course.duration)}</span>
      </div>
      <div class="course-card__footer">
        <a href="course-detail.html?id=${course.id}" class="button button--primary">View Course</a>
      </div>
    </div>
  `;
  
  // Apply pattern to the pattern element
  applyPattern(card.querySelector('.course-card__pattern'), course.pattern);
  
  return card;
}

/**
 * Apply a pattern to an element
 * @param {HTMLElement} element - The element to apply the pattern to
 * @param {string} patternId - The ID of the pattern to apply
 */
function applyPattern(element, patternId) {
  if (!element || !patternId) {
    return;
  }
  
  // Map pattern IDs to CSS gradients (temporary until we have real patterns)
  const patternStyles = {
    pattern1: 'repeating-linear-gradient(45deg, #4361ee, #4361ee 10px, #738dff 10px, #738dff 20px)',
    pattern2: 'repeating-linear-gradient(-45deg, #ff5e78, #ff5e78 10px, #ff8a9a 10px, #ff8a9a 20px)',
    pattern3: 'repeating-linear-gradient(90deg, #4caf50, #4caf50 10px, #66bb6a 10px, #66bb6a 20px)',
    pattern4: 'repeating-linear-gradient(to right, #ffb74d, #ffb74d 10px, #ffc77d 10px, #ffc77d 20px)',
    pattern5: 'repeating-linear-gradient(to bottom, #03a9f4, #03a9f4 10px, #29b6f6 10px, #29b6f6 20px)',
    pattern6: 'repeating-radial-gradient(circle at 10px 10px, #f44336, #f44336 5px, #ef5350 5px, #ef5350 10px)'
  };
  
  // Apply the pattern
  const patternStyle = patternStyles[patternId];
  if (patternStyle) {
    element.style.backgroundImage = patternStyle;
  } else {
    // Default pattern
    element.style.backgroundImage = 'linear-gradient(to right, #4361ee, #738dff)';
  }
}

/**
 * Initialize search functionality
 * @param {Array} courses - The courses data
 */
function initSearch(courses) {
  const searchBox = document.querySelector('.search-box__input');
  const searchButton = document.querySelector('.search-box__button');
  
  if (!searchBox || !searchButton) {
    return;
  }
  
  // Function to handle search
  const handleSearch = () => {
    const searchTerm = searchBox.value.trim().toLowerCase();
    
    // Get current filters
    const filters = getCurrentFilters();
    
    // Add search term to filters
    filters.searchTerm = searchTerm;
    
    // Update URL query parameters
    updateUrlParams(filters);
    
    // Render filtered courses
    renderCourses(courses, filters);
  };
  
  // Add event listeners
  searchButton.addEventListener('click', handleSearch);
  
  searchBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  });
  
  // Initialize search box with value from URL if present
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get('search');
  if (searchTerm) {
    searchBox.value = searchTerm;
  }
}

/**
 * Initialize filter functionality
 * @param {Array} courses - The courses data
 */
function initFilters(courses) {
  const categorySelect = document.getElementById('category');
  const difficultySelect = document.getElementById('difficulty');
  const durationSelect = document.getElementById('duration');
  
  if (!categorySelect || !difficultySelect || !durationSelect) {
    return;
  }
  
  // Function to handle filter change
  const handleFilterChange = () => {
    // Get filters
    const filters = {
      category: categorySelect.value,
      difficulty: difficultySelect.value,
      duration: durationSelect.value
    };
    
    // Add search term if present
    const searchBox = document.querySelector('.search-box__input');
    if (searchBox && searchBox.value.trim()) {
      filters.searchTerm = searchBox.value.trim().toLowerCase();
    }
    
    // Update URL query parameters
    updateUrlParams(filters);
    
    // Render filtered courses
    renderCourses(courses, filters);
  };
  
  // Add event listeners
  categorySelect.addEventListener('change', handleFilterChange);
  difficultySelect.addEventListener('change', handleFilterChange);
  durationSelect.addEventListener('change', handleFilterChange);
  
  // Populate category options based on available categories
  populateCategoryOptions(categorySelect, courses);
  
  // Initialize filters with values from URL if present
  const urlParams = new URLSearchParams(window.location.search);
  
  if (urlParams.has('category')) {
    categorySelect.value = urlParams.get('category');
  }
  
  if (urlParams.has('difficulty')) {
    difficultySelect.value = urlParams.get('difficulty');
  }
  
  if (urlParams.has('duration')) {
    durationSelect.value = urlParams.get('duration');
  }
}

/**
 * Populate category options based on available categories in courses
 * @param {HTMLElement} categorySelect - The category select element
 * @param {Array} courses - The courses data
 */
function populateCategoryOptions(categorySelect, courses) {
  // Get unique categories
  const categories = [...new Set(courses.map(course => course.category))];
  
  // Keep the "All Categories" option
  const allOption = categorySelect.querySelector('option[value="all"]');
  
  // Clear existing options except "All Categories"
  categorySelect.innerHTML = '';
  if (allOption) {
    categorySelect.appendChild(allOption);
  }
  
  // Add options for each category
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = formatCategoryName(category);
    categorySelect.appendChild(option);
  });
}

/**
 * Format a category name to display format
 * @param {string} category - The category name
 * @returns {string} The formatted category name
 */
function formatCategoryName(category) {
  return category
    .split('-')
    .map(word => capitalizeFirstLetter(word))
    .join(' ');
}

/**
 * Capitalize the first letter of a string
 * @param {string} string - The string to capitalize
 * @returns {string} The capitalized string
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Format duration in minutes to human-readable format
 * @param {number} minutes - The duration in minutes
 * @returns {string} The formatted duration
 */
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${minutes} mins`;
  } else if (hours === 1 && remainingMinutes === 0) {
    return '1 hour';
  } else if (remainingMinutes === 0) {
    return `${hours} hours`;
  } else {
    return `${hours} hr ${remainingMinutes} min`;
  }
}

/**
 * Get current filters from filter elements
 * @returns {Object} The current filters
 */
function getCurrentFilters() {
  const filters = {};
  
  const categorySelect = document.getElementById('category');
  if (categorySelect && categorySelect.value !== 'all') {
    filters.category = categorySelect.value;
  }
  
  const difficultySelect = document.getElementById('difficulty');
  if (difficultySelect && difficultySelect.value !== 'all') {
    filters.difficulty = difficultySelect.value;
  }
  
  const durationSelect = document.getElementById('duration');
  if (durationSelect && durationSelect.value !== 'all') {
    filters.duration = durationSelect.value;
  }
  
  const searchBox = document.querySelector('.search-box__input');
  if (searchBox && searchBox.value.trim()) {
    filters.searchTerm = searchBox.value.trim().toLowerCase();
  }
  
  return filters;
}

/**
 * Filter courses based on provided filters
 * @param {Array} courses - The courses data
 * @param {Object} filters - The filters to apply
 * @returns {Array} The filtered courses
 */
function filterCourses(courses, filters) {
  return courses.filter(course => {
    // Filter by category
    if (filters.category && course.category !== filters.category) {
      return false;
    }
    
    // Filter by difficulty
    if (filters.difficulty && course.difficulty !== filters.difficulty) {
      return false;
    }
    
    // Filter by duration
    if (filters.duration) {
      switch (filters.duration) {
        case 'short':
          if (course.duration >= 120) {
            return false;
          }
          break;
        case 'medium':
          if (course.duration < 120 || course.duration > 300) {
            return false;
          }
          break;
        case 'long':
          if (course.duration <= 300) {
            return false;
          }
          break;
      }
    }
    
    // Filter by search term
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      const titleMatch = course.title.toLowerCase().includes(searchTerm);
      const descriptionMatch = course.description.toLowerCase().includes(searchTerm);
      const tagsMatch = course.tags && course.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      
      if (!titleMatch && !descriptionMatch && !tagsMatch) {
        return false;
      }
    }
    
    return true;
  });
}

/**
 * Update URL query parameters based on current filters
 * @param {Object} filters - The filters to apply
 */
function updateUrlParams(filters) {
  const url = new URL(window.location.href);
  
  // Clear existing parameters
  url.searchParams.delete('category');
  url.searchParams.delete('difficulty');
  url.searchParams.delete('duration');
  url.searchParams.delete('search');
  
  // Add new parameters
  if (filters.category) {
    url.searchParams.set('category', filters.category);
  }
  
  if (filters.difficulty) {
    url.searchParams.set('difficulty', filters.difficulty);
  }
  
  if (filters.duration) {
    url.searchParams.set('duration', filters.duration);
  }
  
  if (filters.searchTerm) {
    url.searchParams.set('search', filters.searchTerm);
  }
  
  // Update URL without reloading the page
  window.history.pushState({}, '', url);
}

/**
 * Reset all filters to default
 */
function resetFilters() {
  const categorySelect = document.getElementById('category');
  const difficultySelect = document.getElementById('difficulty');
  const durationSelect = document.getElementById('duration');
  const searchBox = document.querySelector('.search-box__input');
  
  if (categorySelect) {
    categorySelect.value = 'all';
  }
  
  if (difficultySelect) {
    difficultySelect.value = 'all';
  }
  
  if (durationSelect) {
    durationSelect.value = 'all';
  }
  
  if (searchBox) {
    searchBox.value = '';
  }
  
  // Update URL to remove query parameters
  const url = new URL(window.location.href);
  url.search = '';
  window.history.pushState({}, '', url);
}

/**
 * Initialize pagination
 * @param {number} totalItems - The total number of items
 * @param {number} itemsPerPage - The number of items per page
 */
function initPagination(totalItems, itemsPerPage = 6) {
  const paginationContainer = document.querySelector('.pagination');
  
  if (!paginationContainer) {
    return;
  }
  
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Don't show pagination if there's only one page
  if (totalPages <= 1) {
    paginationContainer.style.display = 'none';
    return;
  }
  
  // Get current page from URL or default to 1
  const urlParams = new URLSearchParams(window.location.search);
  let currentPage = parseInt(urlParams.get('page')) || 1;
  
  // Make sure current page is within range
  currentPage = Math.max(1, Math.min(currentPage, totalPages));
  
  // Create pagination elements
  const prevButton = paginationContainer.querySelector('.pagination__button--prev');
  const nextButton = paginationContainer.querySelector('.pagination__button--next');
  const numbersContainer = paginationContainer.querySelector('.pagination__numbers');
  
  if (!prevButton || !nextButton || !numbersContainer) {
    return;
  }
  
  // Clear existing page numbers
  numbersContainer.innerHTML = '';
  
  // Determine which page numbers to show
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, startPage + 2);
  
  // Adjust start page if end page is maxed out
  if (endPage === totalPages) {
    startPage = Math.max(1, endPage - 2);
  }
  
  // Add page numbers
  for (let i = startPage; i <= endPage; i++) {
    const pageLink = document.createElement('a');
    pageLink.href = '#';
    pageLink.className = 'pagination__number';
    pageLink.textContent = i;
    
    if (i === currentPage) {
      pageLink.classList.add('pagination__number--active');
    }
    
    pageLink.addEventListener('click', (event) => {
      event.preventDefault();
      goToPage(i);
    });
    
    numbersContainer.appendChild(pageLink);
  }
  
  // Update previous button
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  });
  
  // Update next button
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  });
  
  // Show pagination
  paginationContainer.style.display = 'flex';
}

/**
 * Update pagination based on filtered items count
 * @param {number} filteredItemsCount - The number of filtered items
 */
function updatePagination(filteredItemsCount) {
  initPagination(filteredItemsCount);
}

/**
 * Go to a specific page
 * @param {number} page - The page number to go to
 */
function goToPage(page) {
  // Update URL query parameter
  const url = new URL(window.location.href);
  url.searchParams.set('page', page);
  
  // Update URL without reloading the page
  window.history.pushState({}, '', url);
  
  // Re-render courses for the new page
  // This would involve calculating the slice of courses to display
  // based on the current page and items per page
  // For now, we'll reload the page to keep it simple
  window.location.reload();
}

/**
 * Show an error message in the catalog
 * @param {string} message - The error message to display
 */
function showCatalogError(message) {
  const coursesGrid = document.querySelector('.courses-grid');
  
  if (!coursesGrid) {
    return;
  }
  
  coursesGrid.innerHTML = `
    <div class="catalog-error">
      <div class="catalog-error__icon">⚠️</div>
      <p class="catalog-error__message">${message}</p>
      <button class="button button--primary reload-button">Reload</button>
    </div>
  `;
  
  // Add some styles
  const style = document.createElement('style');
  style.textContent = `
    .catalog-error {
      grid-column: 1 / -1;
      text-align: center;
      padding: var(--spacing-8);
      background-color: var(--bg-primary);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-base);
    }
    
    .catalog-error__icon {
      font-size: 48px;
      margin-bottom: var(--spacing-4);
    }
    
    .catalog-error__message {
      margin-bottom: var(--spacing-4);
    }
  `;
  
  document.head.appendChild(style);
  
  // Add event listener to reload button
  const reloadButton = coursesGrid.querySelector('.reload-button');
  if (reloadButton) {
    reloadButton.addEventListener('click', () => {
      window.location.reload();
    });
  }
}

// Export functions
export {
  initCourseCatalog
};