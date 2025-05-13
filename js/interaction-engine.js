/**
 * Interaction Engine Module
 * 
 * Manages interactive elements within lessons, such as:
 * - Code editors with live preview
 * - Matching games
 * - Interactive exercises
 * - Knowledge checks
 */

/**
 * Initialize the interaction engine
 * @param {Object} appState - The global application state
 */
function initInteractionEngine(appState) {
  console.log('Initializing Interaction Engine...');
  
  // Check if we're on a lesson page
  if (window.location.pathname.includes('lesson.html')) {
    // Initialize all interactive elements
    initCodeEditors();
    initMatchingGames();
    initCheckUnderstanding();
  }
}

/**
 * Initialize code editors with live preview
 */
function initCodeEditors() {
  const codeEditors = document.querySelectorAll('.interactive-code-editor');
  
  codeEditors.forEach(editor => {
    const input = editor.querySelector('.code-editor__input');
    const preview = editor.querySelector('.code-editor__preview');
    const runButton = editor.querySelector('.run-code-button');
    const resetButton = editor.querySelector('.reset-code-button');
    
    if (!input || !preview || !runButton) {
      return;
    }
    
    // Store original code for reset
    const originalCode = input.value;
    
    // Run code function
    const runCode = () => {
      try {
        const code = input.value;
        const previewBox = preview.querySelector('.preview-box');
        
        // Determine language based on code content or data attribute
        const language = determineLanguage(code, editor);
        
        switch (language) {
          case 'html':
            // For HTML, directly render the content
            preview.innerHTML = `<div class="preview-box">${code}</div>`;
            break;
            
          case 'css':
            // For CSS, create a style element and apply to preview
            if (previewBox) {
              const styleElement = document.createElement('style');
              styleElement.textContent = code;
              preview.innerHTML = '<div class="preview-box">CSS Applied</div>';
              preview.appendChild(styleElement);
            }
            break;
            
          case 'javascript':
            // For JavaScript, execute in a safe way
            // This is a simplified approach - a real app would use a sandbox
            try {
              // Create a sandbox function to run the code
              const sandboxFunction = new Function('previewBox', code);
              
              // Create a fresh preview box
              preview.innerHTML = '<div class="preview-box">JavaScript Output:</div>';
              const newPreviewBox = preview.querySelector('.preview-box');
              
              // Run the code with the preview box as context
              sandboxFunction(newPreviewBox);
            } catch (jsError) {
              preview.innerHTML = `<div class="preview-box error">JavaScript Error: ${jsError.message}</div>`;
            }
            break;
            
          default:
            preview.innerHTML = '<div class="preview-box">Unable to preview this code type</div>';
        }
      } catch (error) {
        preview.innerHTML = `<div class="preview-box error">Error: ${error.message}</div>`;
      }
    };
    
    // Add event listeners
    runButton.addEventListener('click', runCode);
    
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        input.value = originalCode;
        runCode();
      });
    }
    
    // Run the initial code if present
    if (originalCode) {
      runCode();
    }
  });
}

/**
 * Determine the language of the code
 * @param {string} code - The code to analyze
 * @param {HTMLElement} editor - The editor element
 * @returns {string} The language ('html', 'css', 'javascript', or 'unknown')
 */
function determineLanguage(code, editor) {
  // Check if there's a data attribute specifying the language
  if (editor.dataset.language) {
    return editor.dataset.language.toLowerCase();
  }
  
  // Try to determine from the code
  if (code.includes('<html') || code.includes('<!DOCTYPE') || 
      (code.includes('<') && code.includes('</') && code.includes('>'))) {
    return 'html';
  }
  
  if (code.includes('{') && code.includes('}') && 
      (code.includes(':') && code.includes(';')) && 
      !code.includes('function') && !code.includes('var ') && 
      !code.includes('let ') && !code.includes('const ')) {
    return 'css';
  }
  
  if (code.includes('function') || code.includes('var ') || 
      code.includes('let ') || code.includes('const ') || 
      code.includes('=>')) {
    return 'javascript';
  }
  
  return 'unknown';
}

/**
 * Initialize matching games
 */
function initMatchingGames() {
  const matchingGames = document.querySelectorAll('.interactive-matching-game');
  
  matchingGames.forEach(game => {
    const container = game.querySelector('.matching-game__container');
    
    if (!container) {
      return;
    }
    
    // Get pairs from the placeholder or data attributes
    // In a real app, this would come from the lesson data
    const pairs = getMatchingPairs(game);
    
    if (!pairs || pairs.length === 0) {
      return;
    }
    
    // Clear placeholder
    container.innerHTML = '';
    
    // Create the matching game
    createMatchingGame(container, pairs);
  });
}

/**
 * Get matching pairs from a game element
 * @param {HTMLElement} gameElement - The game element
 * @returns {Array} An array of {item, match} pairs
 */
function getMatchingPairs(gameElement) {
  // In a real app, this would come from lesson data
  // For now, we'll use placeholder data
  
  // Check if there's a data attribute with pairs
  if (gameElement.dataset.pairs) {
    try {
      return JSON.parse(gameElement.dataset.pairs);
    } catch (error) {
      console.error('Error parsing matching pairs data:', error);
    }
  }
  
  // Default pairs for the selector matching game
  return [
    { item: 'p', match: 'Selects all paragraph elements' },
    { item: '.header', match: 'Selects all elements with class="header"' },
    { item: '#main', match: 'Selects the element with id="main"' },
    { item: 'div > p', match: 'Selects all p elements that are direct children of a div element' },
    { item: 'a:hover', match: 'Selects links on mouse over' }
  ];
}

/**
 * Create a matching game in the given container
 * @param {HTMLElement} container - The container element
 * @param {Array} pairs - An array of {item, match} pairs
 */
function createMatchingGame(container, pairs) {
  // Create the left and right columns
  const leftColumn = document.createElement('div');
  leftColumn.className = 'matching-column matching-column--left';
  
  const rightColumn = document.createElement('div');
  rightColumn.className = 'matching-column matching-column--right';
  
  // Create a wrapper for the columns
  const columnsWrapper = document.createElement('div');
  columnsWrapper.className = 'matching-columns';
  columnsWrapper.appendChild(leftColumn);
  columnsWrapper.appendChild(rightColumn);
  
  // Add the wrapper to the container
  container.appendChild(columnsWrapper);
  
  // Create a feedback element
  const feedback = document.createElement('div');
  feedback.className = 'matching-feedback';
  feedback.style.display = 'none';
  container.appendChild(feedback);
  
  // Create a reset button
  const resetButton = document.createElement('button');
  resetButton.className = 'button button--secondary reset-matching-button';
  resetButton.textContent = 'Reset Game';
  resetButton.style.display = 'none';
  container.appendChild(resetButton);
  
  // Shuffle the pairs for the right column
  const shuffledMatches = [...pairs.map(pair => pair.match)];
  shuffleArray(shuffledMatches);
  
  // Game state
  const gameState = {
    pairs,
    selectedLeft: null,
    selectedRight: null,
    matched: new Set(),
    leftElements: [],
    rightElements: []
  };
  
  // Create the items
  pairs.forEach((pair, index) => {
    // Left item
    const leftItem = document.createElement('div');
    leftItem.className = 'matching-item matching-item--left';
    leftItem.textContent = pair.item;
    leftItem.dataset.index = index;
    leftColumn.appendChild(leftItem);
    gameState.leftElements.push(leftItem);
    
    // Right item (from shuffled array)
    const rightItem = document.createElement('div');
    rightItem.className = 'matching-item matching-item--right';
    rightItem.textContent = shuffledMatches[index];
    rightItem.dataset.text = shuffledMatches[index];
    rightColumn.appendChild(rightItem);
    gameState.rightElements.push(rightItem);
    
    // Add event listener to left item
    leftItem.addEventListener('click', () => {
      // Skip if already matched
      if (gameState.matched.has(parseInt(leftItem.dataset.index))) {
        return;
      }
      
      // Deselect previous item if exists
      if (gameState.selectedLeft !== null) {
        gameState.leftElements[gameState.selectedLeft].classList.remove('matching-item--selected');
      }
      
      // Select this item
      leftItem.classList.add('matching-item--selected');
      gameState.selectedLeft = parseInt(leftItem.dataset.index);
      
      // Check for match if both sides selected
      if (gameState.selectedRight !== null) {
        checkForMatch(gameState, feedback, resetButton);
      }
    });
    
    // Add event listener to right item
    rightItem.addEventListener('click', () => {
      // Skip if the corresponding match is already matched
      const matchIndex = shuffledMatches.indexOf(rightItem.dataset.text);
      if (gameState.matched.has(matchIndex)) {
        return;
      }
      
      // Deselect previous item if exists
      if (gameState.selectedRight !== null) {
        gameState.rightElements[gameState.selectedRight].classList.remove('matching-item--selected');
      }
      
      // Select this item
      rightItem.classList.add('matching-item--selected');
      gameState.selectedRight = gameState.rightElements.indexOf(rightItem);
      
      // Check for match if both sides selected
      if (gameState.selectedLeft !== null) {
        checkForMatch(gameState, feedback, resetButton);
      }
    });
  });
  
  // Add event listener to reset button
  resetButton.addEventListener('click', () => {
    resetMatchingGame(gameState, feedback, resetButton);
  });
  
  // Add some styles for the matching game
  const style = document.createElement('style');
  style.textContent = `
    .matching-columns {
      display: flex;
      gap: var(--spacing-6);
      margin-bottom: var(--spacing-4);
    }
    
    .matching-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }
    
    .matching-item {
      padding: var(--spacing-3);
      background-color: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast) ease;
    }
    
    .matching-item:hover {
      border-color: var(--color-primary-light);
    }
    
    .matching-item--selected {
      border-color: var(--color-primary);
      background-color: rgba(67, 97, 238, 0.1);
    }
    
    .matching-item--matched {
      border-color: var(--color-success);
      background-color: rgba(76, 175, 80, 0.1);
      cursor: default;
    }
    
    .matching-feedback {
      text-align: center;
      padding: var(--spacing-3);
      margin-bottom: var(--spacing-4);
      border-radius: var(--radius-md);
    }
    
    .matching-feedback--correct {
      background-color: rgba(76, 175, 80, 0.1);
      border: 1px solid var(--color-success);
    }
    
    .matching-feedback--wrong {
      background-color: rgba(244, 67, 54, 0.1);
      border: 1px solid var(--color-error);
    }
    
    .matching-feedback--complete {
      background-color: rgba(76, 175, 80, 0.1);
      border: 1px solid var(--color-success);
      font-weight: var(--font-weight-semibold);
    }
  `;
  
  document.head.appendChild(style);
}

/**
 * Shuffle an array in place
 * @param {Array} array - The array to shuffle
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Check for a match in the matching game
 * @param {Object} gameState - The game state
 * @param {HTMLElement} feedback - The feedback element
 * @param {HTMLElement} resetButton - The reset button
 */
function checkForMatch(gameState, feedback, resetButton) {
  const leftIndex = gameState.selectedLeft;
  const rightElement = gameState.rightElements[gameState.selectedRight];
  const rightText = rightElement.dataset.text;
  
  // Find the index of the correct match for the selected left item
  const correctMatch = gameState.pairs[leftIndex].match;
  
  // Check if it's a match
  if (rightText === correctMatch) {
    // Mark as matched
    gameState.matched.add(leftIndex);
    
    // Update UI
    gameState.leftElements[leftIndex].classList.remove('matching-item--selected');
    gameState.leftElements[leftIndex].classList.add('matching-item--matched');
    
    rightElement.classList.remove('matching-item--selected');
    rightElement.classList.add('matching-item--matched');
    
    // Show feedback
    feedback.className = 'matching-feedback matching-feedback--correct';
    feedback.textContent = 'Correct match!';
    feedback.style.display = 'block';
    
    // Reset selection
    gameState.selectedLeft = null;
    gameState.selectedRight = null;
    
    // Check if all pairs are matched
    if (gameState.matched.size === gameState.pairs.length) {
      feedback.className = 'matching-feedback matching-feedback--complete';
      feedback.textContent = 'Congratulations! You matched all items correctly.';
      resetButton.style.display = 'block';
    }
  } else {
    // Not a match
    feedback.className = 'matching-feedback matching-feedback--wrong';
    feedback.textContent = 'Not a match, try again.';
    feedback.style.display = 'block';
    
    // Reset selection after a short delay
    setTimeout(() => {
      gameState.leftElements[leftIndex].classList.remove('matching-item--selected');
      rightElement.classList.remove('matching-item--selected');
      
      gameState.selectedLeft = null;
      gameState.selectedRight = null;
      
      feedback.style.display = 'none';
    }, 1500);
  }
}

/**
 * Reset the matching game
 * @param {Object} gameState - The game state
 * @param {HTMLElement} feedback - The feedback element
 * @param {HTMLElement} resetButton - The reset button
 */
function resetMatchingGame(gameState, feedback, resetButton) {
  // Clear matched items
  gameState.matched.clear();
  
  // Reset selection
  gameState.selectedLeft = null;
  gameState.selectedRight = null;
  
  // Reset UI
  gameState.leftElements.forEach(element => {
    element.classList.remove('matching-item--selected', 'matching-item--matched');
  });
  
  gameState.rightElements.forEach(element => {
    element.classList.remove('matching-item--selected', 'matching-item--matched');
  });
  
  // Hide feedback and reset button
  feedback.style.display = 'none';
  resetButton.style.display = 'none';
}

/**
 * Initialize "Check Your Understanding" sections
 */
function initCheckUnderstanding() {
  const questions = document.querySelectorAll('.question-container');
  
  questions.forEach(questionContainer => {
    const options = questionContainer.querySelectorAll('.option input');
    const feedback = questionContainer.querySelector('.question-feedback');
    
    if (!options.length || !feedback) {
      return;
    }
    
    // Add event listener to each option
    options.forEach(option => {
      option.addEventListener('change', () => {
        // Check if the correct option was chosen
        const correctAnswer = 2; // This would come from lesson data in a real app
        const isCorrect = parseInt(option.value) === correctAnswer;
        
        // Show feedback
        feedback.style.display = 'block';
        
        const correctFeedback = feedback.querySelector('.question-feedback__correct');
        const incorrectFeedback = feedback.querySelector('.question-feedback__incorrect');
        
        if (correctFeedback && incorrectFeedback) {
          correctFeedback.style.display = isCorrect ? 'block' : 'none';
          incorrectFeedback.style.display = isCorrect ? 'none' : 'block';
        }
      });
    });
  });
}

// Export functions
export { 
  initInteractionEngine,
  initCodeEditors,
  initMatchingGames,
  initCheckUnderstanding
};