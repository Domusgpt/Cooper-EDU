# CLAUDE.md - Data Directory

## 1. Overview
The data directory contains the JSON files that serve as the source of truth for the Cooper Educational Platform. These structured data files define courses, lessons, quizzes, and achievements that power the platform's content and interactive elements.

## 2. File Structure
- **courses.json**: Defines available courses with metadata and structure
- **lessons.json**: Contains lesson content, interactive elements, and resources
- **quizzes.json**: Defines assessment questions, answers, and feedback
- **achievements.json**: Specifies achievements, badges, and their unlock conditions

## 3. Data Schemas

### courses.json
```json
[
  {
    "id": "course-123",
    "title": "Course Title",
    "description": "Course description text...",
    "category": "Category Name",
    "difficulty": "Beginner|Intermediate|Advanced",
    "duration": "4 weeks",
    "imageUrl": "assets/images/course-image.jpg",
    "pattern": "assets/patterns/knowledge.svg",
    "instructor": {
      "name": "Instructor Name",
      "bio": "Instructor biography...",
      "avatarUrl": "assets/images/instructor-avatar.jpg"
    },
    "lessons": ["lesson-1", "lesson-2", "lesson-3"],
    "quizzes": ["quiz-1", "midterm-quiz", "final-quiz"],
    "prerequisites": ["course-101", "course-102"],
    "goals": ["Learning goal 1", "Learning goal 2"],
    "tags": ["tag1", "tag2", "tag3"]
  }
]
```

### lessons.json
```json
[
  {
    "id": "lesson-1",
    "courseId": "course-123",
    "title": "Lesson Title",
    "description": "Lesson description...",
    "duration": "45 minutes",
    "order": 1,
    "content": [
      {
        "type": "text",
        "content": "Lesson text content..."
      },
      {
        "type": "image",
        "url": "assets/images/lesson-image.jpg",
        "alt": "Image description"
      },
      {
        "type": "video",
        "url": "https://example.com/video.mp4",
        "caption": "Video caption"
      },
      {
        "type": "code",
        "language": "javascript",
        "content": "console.log('Hello world');"
      },
      {
        "type": "interactive",
        "interactionType": "drag-drop",
        "data": { /* interaction-specific data */ }
      }
    ],
    "resources": [
      {
        "title": "Additional resource",
        "url": "https://example.com/resource",
        "type": "article|video|book"
      }
    ],
    "nextLessonId": "lesson-2",
    "pattern": "assets/patterns/knowledge.svg"
  }
]
```

### quizzes.json
```json
[
  {
    "id": "quiz-1",
    "courseId": "course-123",
    "lessonId": "lesson-1",
    "title": "Quiz Title",
    "description": "Quiz description...",
    "timeLimit": 600, // seconds
    "passingScore": 70, // percentage
    "questions": [
      {
        "id": "q1",
        "type": "multiple-choice",
        "question": "Question text?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 1, // index of correct option
        "explanation": "Explanation of the correct answer...",
        "points": 10
      },
      {
        "id": "q2",
        "type": "true-false",
        "question": "True/false question text?",
        "correctAnswer": true,
        "explanation": "Explanation of the correct answer...",
        "points": 5
      },
      {
        "id": "q3",
        "type": "coding",
        "question": "Write a function that...",
        "language": "javascript",
        "startingCode": "function example() {\n  // Your code here\n}",
        "testCases": [
          {
            "input": "example(5)",
            "expectedOutput": "25"
          }
        ],
        "points": 20
      }
    ],
    "achievements": ["achievement-123"]
  }
]
```

### achievements.json
```json
[
  {
    "id": "achievement-123",
    "title": "Achievement Title",
    "description": "Achievement description...",
    "iconUrl": "assets/images/achievement.svg",
    "pattern": "assets/patterns/achievement.svg",
    "criteria": {
      "type": "quiz_completion|course_completion|lessons_streak|skill_mastery",
      "entityId": "quiz-1|course-123",
      "threshold": 90, // e.g., score percentage, streak count
      "additionalParams": { /* type-specific parameters */ }
    },
    "xpReward": 500,
    "unlocks": ["achievement-456"] // achievements unlocked by this one
  }
]
```

## 4. Data Interaction and Consumption

### Data Loading Process
1. The `data-service.js` module is responsible for loading data from JSON files
2. Data is loaded asynchronously using fetch API or imported as modules
3. Data is cached in memory for optimal performance
4. Changes to data during runtime (e.g., progress tracking) are managed by specific modules

### Connection Points
- **Course Navigator**: Consumes course and lesson data to build navigation
- **Lesson Content Renderer**: Uses lesson data to display content
- **Quiz System**: Processes quiz data to create interactive assessments
- **Progress Tracker**: Updates and persists user progress data
- **Achievement Manager**: Processes achievement criteria and unlocks

## 5. Data Manipulation Guidelines
- Data files should be treated as read-only source of truth
- Runtime modifications should be handled via JavaScript modules
- User-specific data (progress, preferences) should be stored separately using browser storage or backend APIs
- When extending data schemas, maintain backward compatibility

## 6. Best Practices
- Validate data against schemas before consumption
- Use consistent ID patterns across all data files
- Establish clear relationships between entities with IDs
- Keep content and presentation concerns separate
- Design data for flexibility and extensibility
- Document any schema changes in this file

## 7. Adding New Data
When adding new data:
1. Follow the established schema patterns
2. Use descriptive IDs that reflect the content
3. Ensure all required fields are present
4. Validate relationships between entities
5. Test data rendering before deployment