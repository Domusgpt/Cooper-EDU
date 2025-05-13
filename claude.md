# CLAUDE.md - Interactive Learning Platform

## 1. Project Overview
- **Project Name:** Interactive Learning Platform
- **Goal:** Develop an engaging platform that transforms educational content into immersive learning experiences. Strategically integrate a custom pattern library to visualize knowledge acquisition, achievement markers, and learning progress.
- **Core Philosophy:** Emphasize an intuitive dashboard, interactive lesson templates, a comprehensive assessment system with immediate feedback, an adaptive learning system for personalized journeys, and educational integrity across all devices.

## 2. Core Files & Key Systems (Refer to File Structure)
- **HTML Templates:** `index.html` (Dashboard), `course-catalog.html`, `course-detail.html`, `lesson.html`, `quiz.html`, `profile.html`.
- **CSS System:** Modular CSS in `css/` with `_variables.css` for design tokens. Focus on responsive and accessible design.
- **JavaScript Modules:** Located in `js/`, each responsible for a specific system (e.g., `course-navigator.js`, `quiz-system.js`). `main.js` for initialization.
- **Data Store:** `data/*.json` files are the source of truth for courses, lessons, quizzes, and achievements. These will be fetched and utilized by the JavaScript modules.
- **Asset Integration:** `assets/patterns/` are crucial. They should be used for knowledge visualization, achievement markers, and progression indicators.

## 3. Common Development Commands (Examples - Adapt as Needed)
- `live-server .`: To serve the project locally if no complex build step is initially required.
- `git status`, `git add .`, `git commit -m "feat: [description]"`, `git push`
- `# TODO: Add commands for linting, testing, or building if introduced later.`

## 4. Code Style Guidelines & Best Practices
- **HTML:** Semantic HTML5. ARIA attributes for accessibility.
- **CSS:** BEM-like naming convention for components (e.g., `.course-card__title`). Use CSS variables from `_variables.css`. Mobile-first responsive design.
- **JavaScript:** Modern ES6+ (modules, async/await for fetching data). Clear, well-commented, modular functions/classes. Avoid global namespace pollution (use modules or an app namespace object).
- **JSON:** Strict JSON format. Consistent data structures within each file.
- **Patterns:** SVG format preferred for patterns for scalability and performance.
- **Comments:** Use comments to explain complex logic or "why" something is done, not just "what."

## 5. Development Workflow & Agent Instructions
- **Atom-of-thoughts Principle:** Decompose features into the smallest, independent, implementable steps. Address parallelizable tasks accordingly.
- **Phased Development (User Defined):**
    1.  **Response 1 (This Setup):** Requirements gathered (from user prompt), design system principles (in this `CLAUDE.md`), user journey map (conceptual outline).
    2.  **Response 2 (Next):** Develop core HTML/CSS templates (Dashboard, Course Catalog, Lesson Structure).
    3.  **Response 3:** Implement interactive learning elements and assessment system (JS heavy).
    4.  **Response 4:** Create progress tracking and achievement visualization.
    5.  **Response 5:** Finalize responsive design, optimize, document.
- **System by System:** Focus on building one system (e.g., Course Structure, Assessment Engine) at a time. Clearly define its inputs, outputs, and integration points with other systems.
- **Context Management:** Use `/clear` (or equivalent agent command) between developing distinct systems or major features to ensure the agent has focused context and to manage token limits.
- **Integration Points:** Explicitly define how different parts of the platform connect (e.g., "The `course-catalog.html` will list courses from `courses.json`. Clicking a course will navigate to `course-detail.html?id=<courseId>`).
- **User Experience Requirements:** Constantly refer to the user's six learning experience requirements.
- **Provide Complete Code:** For each implemented part, provide runnable HTML, CSS, and JS.

## 6. Key Concepts & Terminology
- **Pattern Library:** User-provided `assets/patterns/` for visual feedback.
- **Learning Path:** The structured sequence a learner follows.
- **Adaptive Learning:** Personalization of the learning journey based on performance.
- **Interactive Elements:** Drag-drop, code editors, simulations, quizzes.
- **Gamification:** Points, badges, leaderboards.
- **Knowledge Visualization:** Using patterns to represent learning concepts or progress.

## 7. IMPORTANT Instructions for Agent (Claude Code or similar)
- **Strict Adherence to File Structure:** All new files and code must conform to the defined structure.
- **Modularity is Key:** Develop components and JavaScript modules that are as self-contained as possible before integrating.
- **Data-Driven Design:** HTML structures should be designed to be populated by data from the `.json` files.
- **Placeholder Content:** For initial development, use realistic placeholder content for courses, lessons, and quizzes.
- **Iterative Refinement:** Expect to refine and iterate on features. Start with core functionality and build outwards.
- **Ask Clarifying Questions:** If requirements for a specific component are unclear, ask before implementing.