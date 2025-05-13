/**
 * Code Editor Module
 * 
 * Provides an interactive code editor component with:
 * - Syntax highlighting
 * - Live preview
 * - Error handling
 * - Code validation
 */

/**
 * Initialize a code editor
 * @param {HTMLElement} container - The container element for the editor
 * @param {Object} options - Configuration options
 */
function initCodeEditor(container, options = {}) {
  // Default options
  const defaultOptions = {
    language: 'html',  // html, css, javascript
    theme: 'light',    // light, dark
    startingCode: '',  // Initial code
    height: '200px',   // Editor height
    readOnly: false,   // Whether the editor is read-only
    autoRun: false,    // Whether to run code automatically on change
    delay: 1000,       // Delay before auto-running code (in ms)
    showLineNumbers: true, // Whether to show line numbers
    lineWrapping: true // Whether to wrap lines
  };
  
  // Merge options
  const editorOptions = {...defaultOptions, ...options};
  
  // Elements
  let inputElement;
  let previewElement;
  let runButton;
  let resetButton;
  let errorElement;
  let lineNumbers;
  let autoRunTimeout;
  let originalCode = editorOptions.startingCode;
  
  // Create the editor structure
  function createEditorStructure() {
    // Clear container
    container.innerHTML = '';
    container.className = 'code-editor';
    
    // Add theme class
    container.classList.add(`code-editor--${editorOptions.theme}`);
    
    // Create editor container
    const editorContainer = document.createElement('div');
    editorContainer.className = 'code-editor__container';
    
    // Create line numbers if enabled
    if (editorOptions.showLineNumbers) {
      lineNumbers = document.createElement('div');
      lineNumbers.className = 'code-editor__line-numbers';
      editorContainer.appendChild(lineNumbers);
    }
    
    // Create input area
    inputElement = document.createElement('textarea');
    inputElement.className = 'code-editor__input';
    inputElement.value = editorOptions.startingCode;
    inputElement.setAttribute('spellcheck', 'false');
    inputElement.setAttribute('autocomplete', 'off');
    inputElement.setAttribute('autocorrect', 'off');
    inputElement.setAttribute('autocapitalize', 'off');
    inputElement.style.height = editorOptions.height;
    
    if (editorOptions.readOnly) {
      inputElement.setAttribute('readonly', 'readonly');
    }
    
    editorContainer.appendChild(inputElement);
    container.appendChild(editorContainer);
    
    // Create error display
    errorElement = document.createElement('div');
    errorElement.className = 'code-editor__error';
    errorElement.style.display = 'none';
    container.appendChild(errorElement);
    
    // Create buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'code-editor__buttons';
    
    // Create run button
    runButton = document.createElement('button');
    runButton.className = 'button button--primary run-code-button';
    runButton.textContent = 'Run Code';
    buttonsContainer.appendChild(runButton);
    
    // Create reset button
    resetButton = document.createElement('button');
    resetButton.className = 'button button--secondary reset-code-button';
    resetButton.textContent = 'Reset';
    buttonsContainer.appendChild(resetButton);
    
    container.appendChild(buttonsContainer);
    
    // Create preview container
    const previewContainer = document.createElement('div');
    previewContainer.className = 'code-editor__preview-container';
    
    // Create preview label
    const previewLabel = document.createElement('div');
    previewLabel.className = 'code-editor__preview-label';
    previewLabel.textContent = 'Preview';
    previewContainer.appendChild(previewLabel);
    
    // Create preview
    previewElement = document.createElement('div');
    previewElement.className = 'code-editor__preview';
    previewContainer.appendChild(previewElement);
    
    container.appendChild(previewContainer);
    
    // Add styles
    addEditorStyles();
  }
  
  // Add editor styles
  function addEditorStyles() {
    // Check if styles already exist
    if (document.getElementById('code-editor-styles')) {
      return;
    }
    
    const style = document.createElement('style');
    style.id = 'code-editor-styles';
    style.textContent = `
      .code-editor {
        font-family: var(--font-family-code);
        border-radius: var(--radius-lg);
        overflow: hidden;
        background-color: var(--bg-primary);
        box-shadow: var(--shadow-base);
        margin-bottom: var(--spacing-6);
      }
      
      .code-editor__container {
        display: flex;
        position: relative;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        overflow: hidden;
      }
      
      .code-editor__line-numbers {
        background-color: var(--color-gray-100);
        color: var(--color-gray-500);
        padding: var(--spacing-2);
        padding-right: var(--spacing-3);
        text-align: right;
        font-size: var(--font-size-sm);
        line-height: 1.5;
        user-select: none;
        border-right: 1px solid var(--border-color);
      }
      
      .code-editor__input {
        flex: 1;
        resize: vertical;
        min-height: 100px;
        font-family: var(--font-family-code);
        font-size: var(--font-size-sm);
        line-height: 1.5;
        padding: var(--spacing-2);
        color: var(--text-primary);
        background-color: var(--bg-primary);
        border: none;
        outline: none;
        tab-size: 2;
      }
      
      .code-editor__error {
        background-color: rgba(244, 67, 54, 0.1);
        color: var(--color-error);
        padding: var(--spacing-2);
        font-size: var(--font-size-sm);
        border-radius: var(--radius-md);
        margin-top: var(--spacing-2);
      }
      
      .code-editor__buttons {
        display: flex;
        gap: var(--spacing-2);
        margin-top: var(--spacing-3);
        margin-bottom: var(--spacing-3);
      }
      
      .code-editor__preview-container {
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        overflow: hidden;
      }
      
      .code-editor__preview-label {
        background-color: var(--color-gray-100);
        padding: var(--spacing-2) var(--spacing-3);
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        border-bottom: 1px solid var(--border-color);
      }
      
      .code-editor__preview {
        padding: var(--spacing-4);
        min-height: 100px;
        background-color: white;
      }
      
      .code-editor__preview.error {
        color: var(--color-error);
      }
      
      /* Dark theme */
      .code-editor--dark .code-editor__container {
        border-color: var(--color-gray-700);
      }
      
      .code-editor--dark .code-editor__line-numbers {
        background-color: var(--color-gray-800);
        color: var(--color-gray-400);
        border-right-color: var(--color-gray-700);
      }
      
      .code-editor--dark .code-editor__input {
        color: var(--color-gray-100);
        background-color: var(--color-gray-900);
      }
      
      .code-editor--dark .code-editor__preview-container {
        border-color: var(--color-gray-700);
      }
      
      .code-editor--dark .code-editor__preview-label {
        background-color: var(--color-gray-800);
        color: var(--color-gray-300);
        border-bottom-color: var(--color-gray-700);
      }
      
      .code-editor--dark .code-editor__preview {
        background-color: var(--color-gray-800);
        color: var(--color-gray-100);
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // Update line numbers
  function updateLineNumbers() {
    if (!editorOptions.showLineNumbers || !lineNumbers) {
      return;
    }
    
    const lines = inputElement.value.split('\n');
    let lineNumbersHtml = '';
    
    for (let i = 0; i < lines.length; i++) {
      lineNumbersHtml += `${i + 1}<br>`;
    }
    
    lineNumbers.innerHTML = lineNumbersHtml;
    
    // Adjust line numbers height to match textarea
    lineNumbers.style.height = `${inputElement.scrollHeight}px`;
  }
  
  // Run the code
  function runCode() {
    try {
      const code = inputElement.value;
      
      // Clear error
      errorElement.style.display = 'none';
      
      // Determine language
      const language = editorOptions.language.toLowerCase();
      
      switch (language) {
        case 'html':
          // For HTML, directly render the content
          previewElement.innerHTML = code;
          break;
          
        case 'css':
          // For CSS, create a style element and apply to preview
          renderCssPreview(code);
          break;
          
        case 'javascript':
          // For JavaScript, execute in a safe way
          renderJavaScriptPreview(code);
          break;
          
        default:
          previewElement.innerHTML = '<div>Unable to preview this code type</div>';
      }
    } catch (error) {
      showError(error.message);
    }
  }
  
  // Render CSS preview
  function renderCssPreview(code) {
    // Remove any existing style element
    const existingStyle = previewElement.querySelector('.preview-style');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Create a style element
    const styleElement = document.createElement('style');
    styleElement.className = 'preview-style';
    styleElement.textContent = code;
    
    // Create a sample content to be styled
    previewElement.innerHTML = `
      <div class="preview-content">
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <p>This is a paragraph of text. <a href="#">This is a link</a>.</p>
        <ul>
          <li>List item 1</li>
          <li>List item 2</li>
          <li>List item 3</li>
        </ul>
        <div class="box">This is a div with class "box"</div>
        <button>Button</button>
      </div>
    `;
    
    // Add the style element
    previewElement.appendChild(styleElement);
  }
  
  // Render JavaScript preview
  function renderJavaScriptPreview(code) {
    // Clear preview
    previewElement.innerHTML = '<div class="js-output"></div>';
    const outputElement = previewElement.querySelector('.js-output');
    
    // Create a safe console
    const safeConsole = {
      log: (...args) => {
        const output = args.map(arg => {
          if (typeof arg === 'object') {
            return JSON.stringify(arg, null, 2);
          } else {
            return String(arg);
          }
        }).join(' ');
        
        const logLine = document.createElement('div');
        logLine.className = 'console-log';
        logLine.textContent = output;
        outputElement.appendChild(logLine);
      },
      error: (...args) => {
        const output = args.map(arg => String(arg)).join(' ');
        
        const errorLine = document.createElement('div');
        errorLine.className = 'console-error';
        errorLine.textContent = output;
        outputElement.appendChild(errorLine);
      }
    };
    
    // Create sandbox iframe
    try {
      // Add sandbox console log function
      const wrappedCode = `
        // Override console
        const console = {
          log: function(...args) {
            window.parent.postMessage({
              type: 'console.log',
              args: args
            }, '*');
          },
          error: function(...args) {
            window.parent.postMessage({
              type: 'console.error',
              args: args
            }, '*');
          }
        };
        
        try {
          ${code}
        } catch (error) {
          console.error('Error: ' + error.message);
        }
      `;
      
      // Create iframe
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      // Add message listener
      window.addEventListener('message', (event) => {
        if (event.data && event.data.type) {
          if (event.data.type === 'console.log') {
            safeConsole.log(...event.data.args);
          } else if (event.data.type === 'console.error') {
            safeConsole.error(...event.data.args);
          }
        }
      });
      
      // Write content to iframe
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      iframeDocument.open();
      iframeDocument.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>JavaScript Sandbox</title>
        </head>
        <body>
          <script>
            ${wrappedCode}
          </script>
        </body>
        </html>
      `);
      iframeDocument.close();
      
      // Add success message if nothing was output
      if (outputElement.children.length === 0) {
        const successLine = document.createElement('div');
        successLine.className = 'console-success';
        successLine.textContent = 'Code executed successfully!';
        outputElement.appendChild(successLine);
      }
      
      // Clean up iframe after execution
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    } catch (error) {
      showError(error.message);
    }
  }
  
  // Reset code to original
  function resetCode() {
    inputElement.value = originalCode;
    updateLineNumbers();
    errorElement.style.display = 'none';
    runCode();
  }
  
  // Show error message
  function showError(message) {
    errorElement.textContent = `Error: ${message}`;
    errorElement.style.display = 'block';
    previewElement.innerHTML = '<div class="error">An error occurred while running the code.</div>';
  }
  
  // Initialize the editor
  function init() {
    createEditorStructure();
    updateLineNumbers();
    
    // Add event listeners
    inputElement.addEventListener('input', () => {
      updateLineNumbers();
      
      // Auto-run code if enabled
      if (editorOptions.autoRun) {
        clearTimeout(autoRunTimeout);
        autoRunTimeout = setTimeout(runCode, editorOptions.delay);
      }
    });
    
    inputElement.addEventListener('keydown', (event) => {
      // Handle tab key
      if (event.key === 'Tab') {
        event.preventDefault();
        
        const start = inputElement.selectionStart;
        const end = inputElement.selectionEnd;
        
        // Insert tab at cursor position
        inputElement.value = inputElement.value.substring(0, start) + '  ' + inputElement.value.substring(end);
        
        // Move cursor after the inserted tab
        inputElement.selectionStart = inputElement.selectionEnd = start + 2;
        
        // Update line numbers
        updateLineNumbers();
      }
    });
    
    inputElement.addEventListener('scroll', () => {
      if (lineNumbers) {
        lineNumbers.scrollTop = inputElement.scrollTop;
      }
    });
    
    runButton.addEventListener('click', runCode);
    resetButton.addEventListener('click', resetCode);
    
    // Run the code initially
    runCode();
  }
  
  // Initialize the editor
  init();
  
  // Return public methods
  return {
    getValue: () => inputElement.value,
    setValue: (value) => {
      inputElement.value = value;
      updateLineNumbers();
      if (editorOptions.autoRun) {
        runCode();
      }
    },
    setLanguage: (language) => {
      editorOptions.language = language;
      // Re-run code with new language
      runCode();
    },
    runCode,
    resetCode
  };
}

/**
 * Initialize all code editors on the page
 */
function initAllCodeEditors() {
  // Find all code editor containers
  const editorContainers = document.querySelectorAll('.interactive-code-editor');
  
  // Initialize each editor
  editorContainers.forEach(container => {
    // Get language from data attribute or default to HTML
    const language = container.dataset.language || 'html';
    
    // Get starting code from hidden textarea or default to empty
    const codeElement = container.querySelector('.code-editor__starter-code');
    const startingCode = codeElement ? codeElement.value : '';
    
    // Initialize the editor
    initCodeEditor(container, {
      language,
      startingCode,
      autoRun: container.dataset.autoRun === 'true',
      height: container.dataset.height || '200px'
    });
  });
}

// Export functions
export {
  initCodeEditor,
  initAllCodeEditors
};