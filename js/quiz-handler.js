/**
 * Quiz Handler Module
 * 
 * Handles loading, rendering, and scoring quizzes
 * Manages user interaction with quiz questions
 */

import { getCourseQuiz } from './data-service.js';

/**
 * Initialize the quiz page
 * @param {Object} appState - The global application state
 */
async function initQuizHandler(appState) {
  console.log('Initializing Quiz Handler...');
  
  try {
    // Get quiz and course IDs from URL
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('course');
    const quizId = urlParams.get('quiz');
    
    if (!courseId || !quizId) {
      throw new Error('Missing course ID or quiz ID in URL');
    }
    
    // Show loading indicator
    showQuizLoading();
    
    // Load quiz data
    const quizData = await getCourseQuiz(courseId, quizId);
    
    if (!quizData) {
      throw new Error(`Quiz with ID ${quizId} not found in course ${courseId}`);
    }
    
    // Render quiz
    renderQuiz(quizData, appState);
    
    // Hide loading indicator
    hideQuizLoading();
  } catch (error) {
    console.error('Error initializing quiz:', error);
    showQuizError('Failed to load quiz. Please try again later.');
  }
}

/**
 * Show quiz loading indicator
 */
function showQuizLoading() {
  const quizContainer = document.querySelector('.quiz-container');
  
  if (!quizContainer) {
    return;
  }
  
  quizContainer.innerHTML = `
    <div class="quiz-loading">
      <div class="quiz-loading__spinner"></div>
      <p>Loading quiz...</p>
    </div>
  `;
  
  // Add some styles
  const style = document.createElement('style');
  style.textContent = `
    .quiz-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-8);
      text-align: center;
    }
    
    .quiz-loading__spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--color-gray-200);
      border-top: 4px solid var(--color-primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: var(--spacing-4);
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  
  document.head.appendChild(style);
}

/**
 * Hide quiz loading indicator
 */
function hideQuizLoading() {
  const loadingElement = document.querySelector('.quiz-loading');
  
  if (loadingElement) {
    loadingElement.remove();
  }
}

/**
 * Show quiz error message
 * @param {string} message - The error message
 */
function showQuizError(message) {
  const quizContainer = document.querySelector('.quiz-container');
  
  if (!quizContainer) {
    return;
  }
  
  quizContainer.innerHTML = `
    <div class="quiz-error">
      <div class="quiz-error__icon">⚠️</div>
      <p class="quiz-error__message">${message}</p>
      <button class="button button--primary reload-button">Reload</button>
    </div>
  `;
  
  // Add some styles
  const style = document.createElement('style');
  style.textContent = `
    .quiz-error {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-8);
      text-align: center;
      background-color: var(--bg-secondary);
      border-radius: var(--radius-lg);
    }
    
    .quiz-error__icon {
      font-size: 48px;
      margin-bottom: var(--spacing-4);
    }
    
    .quiz-error__message {
      margin-bottom: var(--spacing-4);
    }
  `;
  
  document.head.appendChild(style);
  
  // Add event listener to reload button
  const reloadButton = quizContainer.querySelector('.reload-button');
  if (reloadButton) {
    reloadButton.addEventListener('click', () => {
      window.location.reload();
    });
  }
}

/**
 * Render the quiz
 * @param {Object} quizData - The quiz data
 * @param {Object} appState - The global application state
 */
function renderQuiz(quizData, appState) {
  const quizContainer = document.querySelector('.quiz-container');
  
  if (!quizContainer) {
    console.error('Quiz container not found');
    return;
  }
  
  // Update quiz header
  const quizTitle = document.querySelector('.quiz-title');
  if (quizTitle) {
    quizTitle.textContent = quizData.title;
  }
  
  const quizDescription = document.querySelector('.quiz-description');
  if (quizDescription) {
    quizDescription.textContent = quizData.description;
  }
  
  // Create main quiz content
  const quizContent = document.createElement('div');
  quizContent.className = 'quiz-content';
  
  // Add quiz metadata
  const quizMeta = document.createElement('div');
  quizMeta.className = 'quiz-meta';
  quizMeta.innerHTML = `
    <div class="quiz-meta__item">
      <span class="quiz-meta__label">Questions:</span>
      <span class="quiz-meta__value">${quizData.questions.length}</span>
    </div>
    <div class="quiz-meta__item">
      <span class="quiz-meta__label">Time Limit:</span>
      <span class="quiz-meta__value">${quizData.timeLimit} minutes</span>
    </div>
    <div class="quiz-meta__item">
      <span class="quiz-meta__label">Passing Score:</span>
      <span class="quiz-meta__value">${quizData.passingScore}%</span>
    </div>
    <div class="quiz-meta__item quiz-timer">
      <span class="quiz-meta__label">Time Remaining:</span>
      <span class="quiz-meta__value quiz-timer__value">--:--</span>
    </div>
  `;
  
  quizContent.appendChild(quizMeta);
  
  // Create form for questions
  const quizForm = document.createElement('form');
  quizForm.className = 'quiz-form';
  quizForm.id = 'quiz-form';
  
  // Create questions container
  const questionsContainer = document.createElement('div');
  questionsContainer.className = 'questions-container';
  
  // Add each question
  quizData.questions.forEach((question, index) => {
    const questionElement = createQuestionElement(question, index);
    questionsContainer.appendChild(questionElement);
  });
  
  quizForm.appendChild(questionsContainer);
  
  // Add submit button
  const submitButton = document.createElement('button');
  submitButton.className = 'button button--primary quiz-submit-button';
  submitButton.type = 'button';
  submitButton.textContent = 'Submit Quiz';
  quizForm.appendChild(submitButton);
  
  quizContent.appendChild(quizForm);
  
  // Add quiz results section (hidden initially)
  const quizResults = document.createElement('div');
  quizResults.className = 'quiz-results';
  quizResults.style.display = 'none';
  quizResults.innerHTML = `
    <h2>Quiz Results</h2>
    <div class="quiz-results__score-container">
      <div class="quiz-results__score-circle">
        <span class="quiz-score">0%</span>
      </div>
      <p class="quiz-points">0/0 points</p>
      <p class="quiz-status">Not Submitted</p>
    </div>
    <div class="quiz-next-steps"></div>
  `;
  
  quizContent.appendChild(quizResults);
  
  // Replace container content
  quizContainer.innerHTML = '';
  quizContainer.appendChild(quizContent);
  
  // Initialize timer
  initQuizTimer(quizData.timeLimit, submitButton);
  
  // Add event listener for submit button
  submitButton.addEventListener('click', () => {
    submitQuiz(quizData, appState);
  });
}

/**
 * Create a question element
 * @param {Object} question - The question data
 * @param {number} index - The question index
 * @returns {HTMLElement} The question element
 */
function createQuestionElement(question, index) {
  const questionElement = document.createElement('div');
  questionElement.className = 'question-container';
  questionElement.dataset.questionId = question.id;
  questionElement.dataset.questionIndex = index;
  
  // Create question content based on type
  switch (question.type) {
    case 'multiple-choice':
      questionElement.innerHTML = createMultipleChoiceQuestion(question, index);
      break;
      
    case 'true-false':
      questionElement.innerHTML = createTrueFalseQuestion(question, index);
      break;
      
    case 'code-completion':
      questionElement.innerHTML = createCodeCompletionQuestion(question, index);
      break;
      
    default:
      questionElement.innerHTML = `<p>Unsupported question type: ${question.type}</p>`;
  }
  
  return questionElement;
}

/**
 * Create HTML for a multiple-choice question
 * @param {Object} question - The question data
 * @param {number} index - The question index
 * @returns {string} The HTML for the question
 */
function createMultipleChoiceQuestion(question, index) {
  const questionNumber = index + 1;
  const questionId = `q${question.id}`;
  
  let optionsHtml = '';
  
  question.options.forEach((option, optionIndex) => {
    optionsHtml += `
      <label class="option">
        <input type="radio" name="${questionId}" value="${optionIndex}">
        <span class="option__text">${option}</span>
      </label>
    `;
  });
  
  return `
    <div class="question">
      <p class="question__number">Question ${questionNumber} (${question.points} points)</p>
      <p class="question__text">${question.question}</p>
      <div class="options">
        ${optionsHtml}
      </div>
    </div>
    <div class="question-feedback" style="display: none;">
      <div class="question-feedback__correct">
        <p>Correct!</p>
      </div>
      <div class="question-feedback__incorrect">
        <p>Incorrect. The correct answer is: ${question.options[question.correctAnswer]}</p>
      </div>
    </div>
  `;
}

/**
 * Create HTML for a true/false question
 * @param {Object} question - The question data
 * @param {number} index - The question index
 * @returns {string} The HTML for the question
 */
function createTrueFalseQuestion(question, index) {
  const questionNumber = index + 1;
  const questionId = `q${question.id}`;
  
  return `
    <div class="question">
      <p class="question__number">Question ${questionNumber} (${question.points} points)</p>
      <p class="question__text">${question.question}</p>
      <div class="options">
        <label class="option">
          <input type="radio" name="${questionId}" value="true">
          <span class="option__text">True</span>
        </label>
        <label class="option">
          <input type="radio" name="${questionId}" value="false">
          <span class="option__text">False</span>
        </label>
      </div>
    </div>
    <div class="question-feedback" style="display: none;">
      <div class="question-feedback__correct">
        <p>Correct!</p>
      </div>
      <div class="question-feedback__incorrect">
        <p>Incorrect. The correct answer is: ${question.correctAnswer ? 'True' : 'False'}</p>
      </div>
    </div>
  `;
}

/**
 * Create HTML for a code completion question
 * @param {Object} question - The question data
 * @param {number} index - The question index
 * @returns {string} The HTML for the question
 */
function createCodeCompletionQuestion(question, index) {
  const questionNumber = index + 1;
  const questionId = `q${question.id}`;
  
  return `
    <div class="question">
      <p class="question__number">Question ${questionNumber} (${question.points} points)</p>
      <p class="question__text">${question.question}</p>
      <div class="code-completion">
        <div class="code-completion__wrapper">
          <pre class="code-completion__prefix">${question.codePrefix}</pre>
          <textarea class="code-completion__input" name="${questionId}" rows="3"></textarea>
          <pre class="code-completion__suffix">${question.codeSuffix}</pre>
        </div>
      </div>
    </div>
    <div class="question-feedback" style="display: none;">
      <div class="question-feedback__correct">
        <p>Correct!</p>
      </div>
      <div class="question-feedback__incorrect">
        <p>Incorrect. A correct answer would be: <code>${question.correctAnswer}</code></p>
      </div>
    </div>
  `;
}

/**
 * Initialize the quiz timer
 * @param {number} timeLimit - The time limit in minutes
 * @param {HTMLElement} submitButton - The submit button element
 */
function initQuizTimer(timeLimit, submitButton) {
  const timerElement = document.querySelector('.quiz-timer__value');
  
  if (!timerElement) {
    return;
  }
  
  // Convert time limit to seconds
  let timeRemaining = timeLimit * 60;
  
  // Update the timer display
  const updateTimerDisplay = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Add warning class when time is running out
    if (timeRemaining <= 60) {
      timerElement.classList.add('quiz-timer__value--warning');
    }
  };
  
  // Initial display update
  updateTimerDisplay();
  
  // Start the timer
  const timerId = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();
    
    // Auto-submit when time runs out
    if (timeRemaining <= 0) {
      clearInterval(timerId);
      
      // Simulate click on submit button
      if (submitButton) {
        submitButton.click();
      }
    }
  }, 1000);
  
  // Store the timer ID
  timerElement.dataset.timerId = timerId;
}

/**
 * Submit the quiz and calculate score
 * @param {Object} quizData - The quiz data
 * @param {Object} appState - The global application state
 */
function submitQuiz(quizData, appState) {
  // Stop the timer
  const timerElement = document.querySelector('.quiz-timer__value');
  if (timerElement && timerElement.dataset.timerId) {
    clearInterval(parseInt(timerElement.dataset.timerId));
  }
  
  // Disable submit button
  const submitButton = document.querySelector('.quiz-submit-button');
  if (submitButton) {
    submitButton.disabled = true;
  }
  
  // Calculate score
  let totalPoints = 0;
  let earnedPoints = 0;
  
  // Process each question
  quizData.questions.forEach(question => {
    totalPoints += question.points;
    
    // Get the user's answer
    const questionId = `q${question.id}`;
    let userAnswer;
    
    switch (question.type) {
      case 'multiple-choice':
        const selectedOption = document.querySelector(`input[name="${questionId}"]:checked`);
        userAnswer = selectedOption ? selectedOption.value : null;
        break;
        
      case 'true-false':
        const selectedTrueFalse = document.querySelector(`input[name="${questionId}"]:checked`);
        userAnswer = selectedTrueFalse ? selectedTrueFalse.value === 'true' : null;
        break;
        
      case 'code-completion':
        const codeInput = document.querySelector(`textarea[name="${questionId}"]`);
        userAnswer = codeInput ? codeInput.value.trim() : null;
        break;
    }
    
    // Check if the answer is correct
    let isCorrect = false;
    
    if (userAnswer !== null) {
      switch (question.type) {
        case 'multiple-choice':
          isCorrect = parseInt(userAnswer) === question.correctAnswer;
          break;
          
        case 'true-false':
          isCorrect = userAnswer === question.correctAnswer;
          break;
          
        case 'code-completion':
          // For simplicity, we'll check if the answer includes the correct answer
          // In a real app, this would be more sophisticated
          isCorrect = userAnswer.includes(question.correctAnswer);
          break;
      }
      
      // Add points if correct
      if (isCorrect) {
        earnedPoints += question.points;
      }
      
      // Show feedback for this question
      showQuestionFeedback(question.id, isCorrect);
    } else {
      // Show as incorrect if no answer provided
      showQuestionFeedback(question.id, false);
    }
  });
  
  // Calculate percentage score
  const scorePercentage = Math.round((earnedPoints / totalPoints) * 100);
  
  // Determine if the user passed
  const passed = scorePercentage >= quizData.passingScore;
  
  // Show results
  showQuizResults(scorePercentage, passed, earnedPoints, totalPoints, quizData);
  
  // Save the score to user progress (in a real app, this would be sent to the server)
  saveQuizScore(quizData.id, scorePercentage, appState);
  
  // Check for achievements (e.g., perfect score)
  if (scorePercentage === 100) {
    // In a real app, this would trigger an achievement
    console.log('Perfect score achievement unlocked!');
  }
}

/**
 * Show feedback for a specific question
 * @param {string|number} questionId - The ID of the question
 * @param {boolean} isCorrect - Whether the answer is correct
 */
function showQuestionFeedback(questionId, isCorrect) {
  const questionContainer = document.querySelector(`[data-question-id="${questionId}"]`);
  
  if (!questionContainer) {
    return;
  }
  
  // Get the feedback element
  const feedbackElement = questionContainer.querySelector('.question-feedback');
  
  if (!feedbackElement) {
    return;
  }
  
  // Show the feedback element
  feedbackElement.style.display = 'block';
  
  // Show the correct or incorrect feedback
  const correctFeedback = feedbackElement.querySelector('.question-feedback__correct');
  const incorrectFeedback = feedbackElement.querySelector('.question-feedback__incorrect');
  
  if (correctFeedback && incorrectFeedback) {
    correctFeedback.style.display = isCorrect ? 'block' : 'none';
    incorrectFeedback.style.display = isCorrect ? 'none' : 'block';
  }
  
  // Add a class to the question container
  questionContainer.classList.add(isCorrect ? 'question-container--correct' : 'question-container--incorrect');
}

/**
 * Show the quiz results
 * @param {number} scorePercentage - The score as a percentage
 * @param {boolean} passed - Whether the user passed
 * @param {number} earnedPoints - The number of points earned
 * @param {number} totalPoints - The total number of points possible
 * @param {Object} quizData - The quiz data
 */
function showQuizResults(scorePercentage, passed, earnedPoints, totalPoints, quizData) {
  const resultsContainer = document.querySelector('.quiz-results');
  
  if (!resultsContainer) {
    return;
  }
  
  // Update score
  const scoreElement = resultsContainer.querySelector('.quiz-score');
  if (scoreElement) {
    scoreElement.textContent = `${scorePercentage}%`;
  }
  
  // Update points
  const pointsElement = resultsContainer.querySelector('.quiz-points');
  if (pointsElement) {
    pointsElement.textContent = `${earnedPoints}/${totalPoints} points`;
  }
  
  // Update status
  const statusElement = resultsContainer.querySelector('.quiz-status');
  if (statusElement) {
    statusElement.textContent = passed ? 'Passed' : 'Failed';
    statusElement.className = `quiz-status quiz-status--${passed ? 'passed' : 'failed'}`;
  }
  
  // Add styles for score circle
  const scoreCircle = resultsContainer.querySelector('.quiz-results__score-circle');
  if (scoreCircle) {
    scoreCircle.style.backgroundColor = passed ? 'var(--color-success)' : 'var(--color-error)';
  }
  
  // Show next steps
  const nextStepsContainer = resultsContainer.querySelector('.quiz-next-steps');
  if (nextStepsContainer) {
    if (passed) {
      nextStepsContainer.innerHTML = `
        <p>Congratulations! You've passed this quiz.</p>
        <div class="button-group">
          <a href="course-detail.html?id=${quizData.courseId}" class="button button--primary">Return to Course</a>
          <a href="index.html" class="button button--secondary">Dashboard</a>
        </div>
      `;
    } else {
      nextStepsContainer.innerHTML = `
        <p>You didn't pass this time. Review the material and try again.</p>
        <div class="button-group">
          <a href="course-detail.html?id=${quizData.courseId}" class="button button--primary">Review Course Material</a>
          <button class="button button--secondary retry-quiz-button">Retry Quiz</button>
        </div>
      `;
      
      // Add event listener to retry button
      const retryButton = nextStepsContainer.querySelector('.retry-quiz-button');
      if (retryButton) {
        retryButton.addEventListener('click', () => {
          window.location.reload();
        });
      }
    }
  }
  
  // Show results
  resultsContainer.style.display = 'block';
  
  // Scroll to results
  resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Save the quiz score to user progress
 * @param {string|number} quizId - The ID of the quiz
 * @param {number} score - The score as a percentage
 * @param {Object} appState - The global application state
 */
function saveQuizScore(quizId, score, appState) {
  if (!appState.userProgress.quizScores) {
    appState.userProgress.quizScores = {};
  }
  
  // Save score
  appState.userProgress.quizScores[quizId] = score;
  
  // In a real app, this would be sent to the server
  console.log(`Quiz score saved: Quiz ${quizId}, Score: ${score}%`);
}

// Export functions
export {
  initQuizHandler
};