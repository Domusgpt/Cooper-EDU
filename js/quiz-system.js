/**
 * Quiz System Module
 * 
 * Manages quizzes, questions, answers, and scoring
 */

/**
 * Initialize the quiz system
 * @param {Object} appState - The global application state
 */
function initQuizSystem(appState) {
  console.log('Initializing Quiz System...');
  
  // Check if we're on a quiz page
  if (window.location.pathname.includes('quiz.html')) {
    initQuizPage(appState);
  }
}

/**
 * Initialize quiz page functionality
 * @param {Object} appState - The global application state
 */
function initQuizPage(appState) {
  // Get quiz and course IDs from URL
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('course');
  const quizId = urlParams.get('quiz');
  
  if (!courseId || !quizId) {
    console.error('Missing course ID or quiz ID');
    return;
  }
  
  // Load quiz data
  const quizData = loadQuizData(courseId, quizId, appState);
  
  if (!quizData) {
    console.error('Quiz data not found');
    return;
  }
  
  // Render quiz
  renderQuiz(quizData, appState);
  
  // Initialize event listeners
  attachQuizEventListeners(quizData, appState);
}

/**
 * Load quiz data for a specific quiz
 * @param {string|number} courseId - The ID of the course
 * @param {string|number} quizId - The ID of the quiz
 * @param {Object} appState - The global application state
 * @returns {Object} The quiz data
 */
function loadQuizData(courseId, quizId, appState) {
  // Find the quiz in the app state
  const quiz = appState.quizData.find(
    quiz => quiz.courseId.toString() === courseId.toString() && 
            quiz.id.toString() === quizId.toString()
  );
  
  if (!quiz) {
    console.error(`Quiz with ID ${quizId} in course ${courseId} not found`);
    return null;
  }
  
  // Find the course
  const course = appState.courseData.find(course => course.id.toString() === courseId.toString());
  
  // Return the complete quiz data
  return {
    ...quiz,
    course
  };
}

/**
 * Render a quiz based on quiz data
 * @param {Object} quizData - The quiz data
 * @param {Object} appState - The global application state
 */
function renderQuiz(quizData, appState) {
  // Get the quiz container
  const quizContainer = document.querySelector('.quiz-container');
  
  if (!quizContainer) {
    console.error('Quiz container not found');
    return;
  }
  
  // Update quiz header
  const quizTitle = quizContainer.querySelector('.quiz-title');
  if (quizTitle) {
    quizTitle.textContent = quizData.title;
  }
  
  const quizDescription = quizContainer.querySelector('.quiz-description');
  if (quizDescription) {
    quizDescription.textContent = quizData.description;
  }
  
  // Render questions
  const questionsContainer = quizContainer.querySelector('.questions-container');
  if (questionsContainer) {
    // Clear existing questions
    questionsContainer.innerHTML = '';
    
    // Render each question
    quizData.questions.forEach((question, index) => {
      const questionElement = createQuestionElement(question, index);
      questionsContainer.appendChild(questionElement);
    });
  }
  
  // Update quiz metadata
  const timeLimit = quizContainer.querySelector('.quiz-time-limit');
  if (timeLimit) {
    timeLimit.textContent = `Time Limit: ${quizData.timeLimit} minutes`;
  }
  
  const passingScore = quizContainer.querySelector('.quiz-passing-score');
  if (passingScore) {
    passingScore.textContent = `Passing Score: ${quizData.passingScore}%`;
  }
  
  // Initialize timer if there is a time limit
  if (quizData.timeLimit) {
    initQuizTimer(quizData.timeLimit);
  }
}

/**
 * Create a question element based on question data
 * @param {Object} question - The question data
 * @param {number} index - The question index
 * @returns {HTMLElement} The question element
 */
function createQuestionElement(question, index) {
  const questionElement = document.createElement('div');
  questionElement.className = 'question-container';
  questionElement.dataset.questionId = question.id;
  questionElement.dataset.questionIndex = index;
  
  // Create question based on question type
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
      console.error(`Unknown question type: ${question.type}`);
      return null;
  }
  
  return questionElement;
}

/**
 * Create HTML for a multiple choice question
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
      <div class="code-editor">
        <pre class="code-prefix">${question.codePrefix}</pre>
        <textarea class="code-editor__input" name="${questionId}"></textarea>
        <pre class="code-suffix">${question.codeSuffix}</pre>
      </div>
    </div>
    <div class="question-feedback" style="display: none;">
      <div class="question-feedback__correct">
        <p>Correct!</p>
      </div>
      <div class="question-feedback__incorrect">
        <p>Incorrect. A correct answer would be: ${question.correctAnswer}</p>
      </div>
    </div>
  `;
}

/**
 * Initialize the quiz timer
 * @param {number} timeLimit - The time limit in minutes
 */
function initQuizTimer(timeLimit) {
  const timerElement = document.querySelector('.quiz-timer');
  
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
      timerElement.classList.add('quiz-timer--warning');
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
      submitQuiz();
    }
  }, 1000);
  
  // Store the timer ID so it can be cleared if needed
  timerElement.dataset.timerId = timerId;
}

/**
 * Attach event listeners to quiz elements
 * @param {Object} quizData - The quiz data
 * @param {Object} appState - The global application state
 */
function attachQuizEventListeners(quizData, appState) {
  // Add event listener to submit button
  const submitButton = document.querySelector('.quiz-submit-button');
  if (submitButton) {
    submitButton.addEventListener('click', () => {
      submitQuiz(quizData, appState);
    });
  }
}

/**
 * Submit the quiz and calculate score
 * @param {Object} quizData - The quiz data
 * @param {Object} appState - The global application state
 */
function submitQuiz(quizData, appState) {
  // Disable the submit button
  const submitButton = document.querySelector('.quiz-submit-button');
  if (submitButton) {
    submitButton.disabled = true;
  }
  
  // Stop the timer
  const timerElement = document.querySelector('.quiz-timer');
  if (timerElement && timerElement.dataset.timerId) {
    clearInterval(timerElement.dataset.timerId);
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
      case 'true-false':
        const selectedOption = document.querySelector(`input[name="${questionId}"]:checked`);
        userAnswer = selectedOption ? selectedOption.value : null;
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
          isCorrect = (userAnswer === 'true') === question.correctAnswer;
          break;
        case 'code-completion':
          // For simplicity, just check if the answer contains the correct answer
          // In a real app, this would be more sophisticated
          isCorrect = userAnswer.includes(question.correctAnswer);
          break;
      }
    }
    
    // Add points if correct
    if (isCorrect) {
      earnedPoints += question.points;
    }
    
    // Show feedback for this question
    showQuestionFeedback(question.id, isCorrect);
  });
  
  // Calculate percentage score
  const scorePercentage = Math.round((earnedPoints / totalPoints) * 100);
  
  // Determine if the user passed
  const passed = scorePercentage >= quizData.passingScore;
  
  // Show results
  showQuizResults(scorePercentage, passed, earnedPoints, totalPoints, quizData);
  
  // Save the score to user progress (in a real app, this would be sent to the server)
  if (!appState.userProgress.quizScores) {
    appState.userProgress.quizScores = {};
  }
  appState.userProgress.quizScores[quizData.id] = scorePercentage;
  
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
  
  // Update results content
  const scoreElement = resultsContainer.querySelector('.quiz-score');
  if (scoreElement) {
    scoreElement.textContent = `${scorePercentage}%`;
  }
  
  const pointsElement = resultsContainer.querySelector('.quiz-points');
  if (pointsElement) {
    pointsElement.textContent = `${earnedPoints}/${totalPoints} points`;
  }
  
  const statusElement = resultsContainer.querySelector('.quiz-status');
  if (statusElement) {
    statusElement.textContent = passed ? 'Passed' : 'Failed';
    statusElement.className = passed ? 'quiz-status quiz-status--passed' : 'quiz-status quiz-status--failed';
  }
  
  // Show the results section
  resultsContainer.style.display = 'block';
  
  // Scroll to results
  resultsContainer.scrollIntoView({ behavior: 'smooth' });
  
  // Show appropriate next steps
  const nextStepsContainer = document.querySelector('.quiz-next-steps');
  
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
    
    // Show the next steps
    nextStepsContainer.style.display = 'block';
  }
}

// Export functions
export { 
  initQuizSystem,
  loadQuizData
};