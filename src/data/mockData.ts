import { Course, QuizQuestion, ChatMessage, UserProgress, Lesson } from '../types';

export const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'Introduction to the Topic',
    content: 'This lesson introduces the fundamental concepts and provides a foundation for understanding the subject matter.',
    type: 'video',
    duration: '15 min',
    completed: false,
    videoUrl: 'https://www.youtube.com/embed/rU0T7l6QX4w',
    transcript: 'Welcome to this lesson. In this session, we will explore the fundamentals...',
    resources: ['Study Notes PDF', 'Practice Exercises'],
    dateAdded: '2 weeks ago',
        thumbnailUrl: 'https://i.ytimg.com/vi/rU0T7l6QX4w/hqdefault.jpg',
        images: [
          { url: 'https://www.mathsisfun.com/algebra/images/quadratic-equation.svg', alt: 'Algebra formula 1' },
          { url: 'https://www.mathsisfun.com/algebra/images/quadratic-graph.svg' }
        ]
  },
  {
    id: '2',
    title: 'Core Concepts',
    content: 'Deep dive into the core concepts and principles that form the backbone of this subject.',
    type: 'interactive',
    duration: '20 min',
    completed: false,
    resources: ['Interactive Quiz', 'Concept Map'],
    dateAdded: '2 weeks ago',
        videoUrl: 'https://www.youtube.com/embed/Jsiy4TxgIME',
        thumbnailUrl: 'https://i.ytimg.com/vi/Jsiy4TxgIME/hqdefault.jpg',
        images: [
          { url: 'https://www.mathsisfun.com/algebra/images/trigonometry-triangle.svg', alt: 'Algebra formula 1' },
          { url: 'https://www.mathsisfun.com/algebra/images/trigonometry-triangle.svg' }
        ]
  },
  {
    id: '3',
    title: 'Practical Applications',
    content: 'Learn how to apply the concepts in real-world scenarios and problem-solving situations.',
    type: 'video',
    duration: '25 min',
    completed: false,
    videoUrl: 'https://www.youtube.com/embed/g78utcLQrJ4',
    dateAdded: '2 weeks ago',
        thumbnailUrl: 'https://i.ytimg.com/vi/g78utcLQrJ4/hqdefault.jpg',
        images: [
          { url: 'https://www.sciencefacts.net/wp-content/uploads/2019/12/Photosynthesis-Process.jpg', alt: 'Algebra formula 1' },
          { url: 'https://cdn1.byjus.com/wp-content/uploads/2018/11/biology/2016/01/26093457/Photosynthesis-1.png' }
        ],
    transcript: 'Now let\'s see how these concepts apply in practice...'
  }
];

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Mathematics - Class 10',
    description: 'Complete CBSE Class 10 Mathematics covering Real Numbers, Polynomials, Linear Equations, Quadratic Equations, Arithmetic Progressions, Triangles, Coordinate Geometry, Trigonometry, Circles, Areas and Volumes, Statistics and Probability',
    category: 'Mathematics',
    level: 'Intermediate',
    duration: '12 months',
    lessons: mockLessons.map(lesson => ({ ...lesson, id: lesson.id + '_math' })),
    progress: 65,
    image: 'https://images.pexels.com/photos/6256/mathematics-computation-math-numbers.jpg?auto=compress&cs=tinysrgb&w=400',
    color: 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600',
    instructor: 'YUGA AI',
    rating: 4.9,
    notesCount: 12,
    students: 15600,
    tags: ['CBSE', 'Class 10', 'Algebra', 'Geometry', 'Trigonometry']
  },
  {
    id: '2',
    title: 'Science - Class 10',
    description: 'Comprehensive CBSE Class 10 Science covering Physics (Light, Electricity, Magnetic Effects), Chemistry (Acids, Bases, Metals, Carbon Compounds), and Biology (Life Processes, Control and Coordination, Reproduction, Heredity)',
    category: 'Science',
    level: 'Intermediate',
    duration: '12 months',
    lessons: mockLessons.map(lesson => ({ ...lesson, id: lesson.id + '_science' })),
    progress: 45,
    image: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600',
    instructor: 'YUGA AI',
    rating: 4.8,
    notesCount: 12,
    students: 14200,
    tags: ['CBSE', 'Class 10', 'Physics', 'Chemistry', 'Biology']
  },
  {
    id: '3',
    title: 'Social Science - Class 10',
    description: 'Complete CBSE Class 10 Social Science including History (Nationalism in Europe, Nationalism in India, Making of Global World), Geography (Resources and Development, Water Resources, Agriculture, Minerals and Energy), Political Science (Power Sharing, Federalism, Democracy), and Economics (Development, Sectors of Economy, Money and Credit, Globalization)',
    category: 'Social Science',
    level: 'Intermediate',
    duration: '12 months',
    lessons: mockLessons.map(lesson => ({ ...lesson, id: lesson.id + '_social' })),
    progress: 30,
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-600',
    instructor: 'YUGA AI',
    rating: 4.7,
    notesCount: 12,
    students: 12800,
    tags: ['CBSE', 'Class 10', 'History', 'Geography', 'Political Science', 'Economics']
  },
  {
    id: '4',
    title: 'English - Class 10',
    description: 'CBSE Class 10 English covering Literature (First Flight, Footprints without Feet), Grammar, Writing Skills, and Communication. Includes poetry analysis, prose comprehension, letter writing, article writing, and story writing',
    category: 'English',
    level: 'Intermediate',
    duration: '12 months',
    lessons: mockLessons.map(lesson => ({ ...lesson, id: lesson.id + '_english' })),
    progress: 55,
    image: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: 'bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600',
    instructor: 'YUGA AI',
    rating: 4.8,
    notesCount: 12,
    students: 13500,
    tags: ['CBSE', 'Class 10', 'Literature', 'Grammar', 'Writing Skills']
  },
  {
    id: '5',
    title: 'Hindi - Class 10',
    description: 'CBSE Class 10 Hindi covering Kshitij (काव्य खंड और गद्य खंड), Kritika (कहानी संग्रह), व्याकरण, and रचनात्मक लेखन. Includes poetry appreciation, prose analysis, grammar rules, and creative writing in Hindi',
    category: 'Hindi',
    level: 'Intermediate',
    duration: '12 months',
    lessons: mockLessons.map(lesson => ({ ...lesson, id: lesson.id + '_hindi' })),
    progress: 40,
    image: 'https://images.pexels.com/photos/4050290/pexels-photo-4050290.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-600',
    instructor: 'YUGA AI',
    rating: 4.7,
    notesCount: 12,
    students: 11900,
    tags: ['CBSE', 'Class 10', 'Hindi Literature', 'Grammar', 'Creative Writing']
  },
  {
    id: '6',
    title: 'Computer Applications - Class 10',
    description: 'Introduction to Computer Applications covering Computer Fundamentals, Operating Systems, MS Office (Word, Excel, PowerPoint), Internet and Email, and Basic Programming concepts. Perfect for building digital literacy skills',
    category: 'Computer Science',
    level: 'Beginner',
    duration: '6 months',
    lessons: mockLessons.map(lesson => ({ ...lesson, id: lesson.id + '_computer' })),
    progress: 20,
    image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: 'bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600',
    instructor: 'YUGA AI',
    rating: 4.6,
    notesCount: 12,
    students: 9200,
    tags: ['CBSE', 'Class 10', 'Computer Basics', 'MS Office', 'Programming']
  }
];

export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'What is the value of √2 approximately?',
    options: [
      '1.414',
      '1.732',
      '2.236',
      '3.142'
    ],
    correctAnswer: 0,
    explanation: '√2 is approximately equal to 1.414. This is an important irrational number that students encounter in Class 10 Mathematics.',
    difficulty: 'easy',
    subject: 'Mathematics'
  },
  {
    id: '2',
    question: 'Which of the following is the correct formula for the area of a circle?',
    options: [
      '2πr',
      'πr²',
      'πd',
      '4πr²'
    ],
    correctAnswer: 1,
    explanation: 'The area of a circle is πr², where r is the radius of the circle. This is a fundamental formula in geometry.',
    difficulty: 'easy',
    subject: 'Mathematics'
  },
  {
    id: '3',
    question: 'What is the chemical formula for water?',
    options: [
      'H₂O',
      'CO₂',
      'NaCl',
      'CaCO₃'
    ],
    correctAnswer: 0,
    explanation: 'Water has the chemical formula H₂O, consisting of two hydrogen atoms and one oxygen atom bonded together.',
    difficulty: 'easy',
    subject: 'Science'
  },
  {
    id: '4',
    question: 'Who wrote the poem "Fire and Ice"?',
    options: [
      'Robert Frost',
      'William Shakespeare',
      'John Keats',
      'William Wordsworth'
    ],
    correctAnswer: 0,
    explanation: '"Fire and Ice" is a famous poem by Robert Frost that is part of the Class 10 English curriculum. It explores themes of desire and hatred.',
    difficulty: 'medium',
    subject: 'English'
  },
  {
    id: '5',
    question: 'In which year did the French Revolution begin?',
    options: [
      '1789',
      '1799',
      '1804',
      '1815'
    ],
    correctAnswer: 0,
    explanation: 'The French Revolution began in 1789 and is an important topic in Class 10 Social Science, particularly in the study of nationalism in Europe.',
    difficulty: 'medium',
    subject: 'Social Science'
  }
];

export const mockUserProgress: UserProgress = {
  totalCourses: 6,
  completedCourses: 0,
  currentStreak: 7,
  totalHours: 42,
  achievements: [
    {
      id: '1',
      title: 'First Course Started',
      description: 'Started your first Class 10 course',
      icon: '🎓',
      unlockedAt: new Date(Date.now() - 86400000),
      rarity: 'common'
    },
    {
      id: '2',
      title: 'Week Streak',
      description: 'Maintained a 7-day learning streak',
      icon: '🔥',
      unlockedAt: new Date(),
      rarity: 'rare'
    },
    {
      id: '3',
      title: 'Math Explorer',
      description: 'Completed 5 mathematics lessons',
      icon: '🧮',
      unlockedAt: new Date(Date.now() - 172800000),
      rarity: 'epic'
    }
  ],
  weeklyGoal: 10,
  weeklyProgress: 7
};

export const getAIResponse = (message: string): string => {
  const responses = [
    "That's an excellent question! Let me break this down for you step by step. Based on your Class 10 curriculum, I think you'll find this explanation particularly helpful...",
    "I can see you're making fantastic progress! Here's what I'd recommend focusing on next to build upon what you've already learned...",
    "Interesting point! This concept actually connects to several topics we've covered in your Class 10 syllabus. Let me show you how they relate...",
    "You're thinking like a true scholar! Let's dive deeper into this topic and explore some practical applications that will help in your board exams...",
    "Perfect! Your understanding is really developing well. Here's an advanced perspective that will challenge your thinking and prepare you for higher studies...",
    "Great insight! This connects to several key principles in your Class 10 curriculum. Let me explain how they work together...",
    "I love that you asked this! It shows you're thinking critically about the material. Here's a comprehensive explanation with examples from your textbook...",
    "This is a common question that many Class 10 students have. Let me provide you with a clear, practical answer with step-by-step examples..."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export const getSubjectSpecificResponse = (message: string, subject: string): string => {
  const subjectResponses: Record<string, string[]> = {
    'Mathematics': [
      "In Class 10 Mathematics, this concept is fundamental to understanding algebra and geometry...",
      "From a mathematical perspective, let me explain the underlying principles and their practical applications in your board exam...",
      "This mathematical concept has practical applications in real life. Here's how it works step by step..."
    ],
    'Science': [
      "In Class 10 Science, this principle applies across Physics, Chemistry, and Biology. Let me explain how...",
      "From a scientific standpoint, this concept helps us understand natural phenomena. Here's the detailed explanation...",
      "This scientific concept is crucial for your board exams. Here's how it connects to other topics in your syllabus..."
    ],
    'Social Science': [
      "In Class 10 Social Science, this topic connects to important historical and geographical concepts...",
      "From a social science perspective, understanding this helps us analyze society and governance...",
      "This concept is important for understanding our world today. Here's how it relates to current events..."
    ],
    'English': [
      "In Class 10 English literature, this concept helps us understand themes and literary devices...",
      "From a language perspective, understanding this will improve your writing and comprehension skills...",
      "This literary concept appears frequently in your board exam. Here's how to analyze it effectively..."
    ],
    'Hindi': [
      "कक्षा 10 हिंदी में यह विषय साहित्य और व्याकरण दोनों के लिए महत्वपूर्ण है...",
      "हिंदी भाषा के दृष्टिकोण से, यह अवधारणा आपकी लेखन और समझ कौशल में सुधार करेगी...",
      "यह साहित्यिक अवधारणा आपकी बोर्ड परीक्षा में अक्सर आती है। इसका विश्लेषण कैसे करें..."
    ]
  };

  const responses = subjectResponses[subject] || subjectResponses['Mathematics'];
  return responses[Math.floor(Math.random() * responses.length)];
};