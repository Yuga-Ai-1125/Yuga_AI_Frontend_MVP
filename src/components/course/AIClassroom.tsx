// AIClassroom.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, MessageCircle, Download, Maximize, Settings, Users, Clock, BookOpen, HelpCircle, PanelLeft, PanelRight } from 'lucide-react';
import { Course, Lesson } from '../../types';
import { RealisticAvatar } from './RealisticAvatar';
import DynamicWhiteboard from './DynamicWhiteboard';
import { RealTimeChat } from './RealTimeChat';
import { MCQPopup } from './MCQPopup';
import { VoiceAssistant } from "../voice/VoiceAssistant";
import { NEET2MCQBox } from './NEET2MCQBox';

interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  subject: string;
}

interface AIClassroomProps {
  course: Course;
  lesson: Lesson;
  isOpen: boolean;
  onClose: () => void;
}

const normalizeCategory = (category: string): string => {
  const cat = category.toLowerCase().replace(/\s+/g, '');
  if (cat === 'neet' || cat === 'neetmcq') return 'NEET MCQ';
  if (cat === 'neet2.o' || cat === 'neet2.0' || cat === 'neetmcq2.o' || cat === 'neetmcq2.0') return 'NEET MCQ 2.O';
  if (cat === 'mathematics' || cat === 'math') return 'Mathematics';
  if (cat === 'science') return 'Science';
  if (cat === 'socialscience') return 'SocialScience';
  if (cat === 'english') return 'English';
  if (cat === 'hindi') return 'Hindi';
  if (cat === 'computerscience') return 'ComputerScience';
  return 'NEET MCQ';
};

export const AIClassroom: React.FC<AIClassroomProps> = ({ course, lesson, isOpen, onClose }) => {
  const [isLessonActive, setIsLessonActive] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentSpeech, setCurrentSpeech] = useState('');
  const [whiteboardContent, setWhiteboardContent] = useState<any[]>([]);
  const [avatarGender, setAvatarGender] = useState<'male' | 'female'>('female');
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Panel visibility states - Hide whiteboard by default for NEET MCQ 2.O
  const [isWhiteboardVisible, setIsWhiteboardVisible] = useState(course.category !== 'NEET MCQ 2.O');
  const [isNEET2MCQVisible, setIsNEET2MCQVisible] = useState(true);

  // MCQ functionality for NEET MCQ - EXACTLY LIKE OLD VERSION
  const [showMCQ, setShowMCQ] = useState(false);
  const [currentMCQIndex, setCurrentMCQIndex] = useState(0);
  const [mcqQuestions, setMCQQuestions] = useState<MCQQuestion[]>([]);
  const [mcqAnswered, setMCqAnswered] = useState(false);
  const [hasShownMCQ, setHasShownMCQ] = useState(false);
  const [waitingForSpeech, setWaitingForSpeech] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [isFeedbackGiven, setIsFeedbackGiven] = useState(false);

  // NEET MCQ 2.O states
  const [showNEET2MCQ, setShowNEET2MCQ] = useState(false);
  const [currentNEET2Question, setCurrentNEET2Question] = useState<MCQQuestion | null>(null);
  const [currentNEET2QuestionIndex, setCurrentNEET2QuestionIndex] = useState(0);
  const [explanationText, setExplanationText] = useState('');
  const [isExplaining, setIsExplaining] = useState(false);
  const [showClarityPopup, setShowClarityPopup] = useState(false);
  const [waitingForClarityResponse, setWaitingForClarityResponse] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [highlightedText, setHighlightedText] = useState<string>('');
  const [shouldShowClarityPopup, setShouldShowClarityPopup] = useState(false);

  // New state for dynamic chapter introduction and lecture (only for NEET Physics/Chemistry/Biology)
  const [hasGeneratedIntroduction, setHasGeneratedIntroduction] = useState(false);
  const [lectureContent, setLectureContent] = useState<string>('');
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [currentKeyPointIndex, setCurrentKeyPointIndex] = useState(0);
  const [summary, setSummary] = useState<string>('');
  const [isGeneratingLecture, setIsGeneratingLecture] = useState(false);

  const avatarRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mcqBoxRef = useRef<HTMLDivElement>(null);

  const neet2Questions: MCQQuestion[] = [
    {
      id: 'NEET2-MCQ-1',
      question: 'Which of the following is NOT a function of the liver?',
      options: [
        'Production of bile',
        'Detoxification',
        'Storage of glycogen', 
        'Production of insulin'
      ],
      correctAnswer: 'Production of insulin',
      subject: 'NEET MCQ 2.O'
    },
    {
      id: 'NEET2-MCQ-2',
      question: 'In humans, which blood vessel carries oxygenated blood from the lungs to the heart?',
      options: [
        'Pulmonary artery',
        'Pulmonary vein',
        'Aorta',
        'Superior vena cava'
      ],
      correctAnswer: 'Pulmonary vein',
      subject: 'NEET MCQ 2.O'
    },
    {
      id: 'NEET2-MCQ-3',
      question: 'Which of the following elements has the highest electron affinity?',
      options: [
        'Fluorine',
        'Chlorine',
        'Bromine',
        'Iodine'
      ],
      correctAnswer: 'Chlorine',
      subject: 'NEET MCQ 2.O'
    },
    {
      id: 'NEET2-MCQ-4',
      question: 'A convex lens of focal length 20 cm is placed in contact with a concave lens of focal length 10 cm. The power of the combination is:',
      options: [
        '-5 D',
        '+5 D',
        '-15 D',
        '+15 D'
      ],
      correctAnswer: '-5 D',
      subject: 'NEET MCQ 2.O'
    },
    {
      id: 'NEET2-MCQ-5',
      question: 'Which of the following is responsible for the transmission of nerve impulses across synapses?',
      options: [
        'Acetylcholine',
        'Insulin',
        'Hemoglobin',
        'Adrenaline'
      ],
      correctAnswer: 'Acetylcholine',
      subject: 'NEET MCQ 2.O'
    },
    {
      id: 'NEET2-MCQ-6',
      question: 'A square loop of side 10 cm carrying a current of 2 A is placed in a uniform magnetic field of 0.5 T. What is the maximum torque acting on the loop?',
      options: [
        '0.01 N⋅m',
        '0.02 N⋅m', 
        '0.05 N⋅m',
        '0.10 N⋅m'
      ],
      correctAnswer: '0.01 N⋅m',
      explanation: 'The maximum torque on a current loop is given by τ = NIAB, where N=1, I=2A, A=(0.1m)²=0.01m², B=0.5T. So τ = 1 × 2 × 0.01 × 0.5 = 0.01 N⋅m.',
      subject: 'NEET MCQ 2.O'
    },
    {
      id: 'NEET2-MCQ-7',
      question: 'In the reaction: CaCO₃ → CaO + CO₂, what type of chemical reaction is taking place?',
      options: [
        'Combination reaction',
        'Decomposition reaction',
        'Displacement reaction',
        'Neutralization reaction'
      ],
      correctAnswer: 'Decomposition reaction',
      explanation: 'Calcium carbonate (CaCO₃) decomposes on heating to form calcium oxide (CaO) and carbon dioxide (CO₂). This thermal decomposition reaction is commonly studied in NEET MCQ inorganic chemistry.',
      subject: 'NEET MCQ 2.O'
    }
  ];

  // EXACTLY LIKE OLD VERSION - MCQ Generation for NEET MCQ
  const generateMCQForSubject = (courseCategory: string): MCQQuestion[] => {
    const subjectMapping: Record<string, string> = {
      'Mathematics': 'Mathematics',
      'Math': 'Mathematics',
      'Science': 'Science',
      'Physics': 'Science',
      'Chemistry': 'Science',
      'Biology': 'Science',
      'Social Science': 'Social Science',
      'History': 'Social Science',
      'Geography': 'Social Science',
      'English': 'English',
      'Literature': 'English',
      'Language Arts': 'English',
      'NEET': 'NEET MCQ',
      'NEET MCQ': 'NEET MCQ',
      'NEET 2.O': 'NEET MCQ 2.O',
      'NEET MCQ 2.O': 'NEET MCQ 2.O'
    };

    const subject = subjectMapping[courseCategory] || 'Mathematics';

    const mcqQuestions: Record<string, MCQQuestion[]> = {
      'Mathematics': [
        {
          id: 'MATH-MCQ-1',
          question: 'What is the value of √16?',
          options: ['2', '4', '8', '16'],
          correctAnswer: '4',
          explanation: '√16 = 4 because 4 × 4 = 16. The square root of a number is the value that, when multiplied by itself, gives the original number.',
          subject: 'Mathematics'
        }
      ],
      'Science': [
        {
          id: 'SCI-MCQ-1',
          question: 'What is the chemical symbol for water?',
          options: ['H₂O', 'CO₂', 'O₂', 'H₂'],
          correctAnswer: 'H₂O',
          explanation: 'Water has the chemical formula H₂O, indicating it contains two hydrogen atoms bonded to one oxygen atom.',
          subject: 'Science'
        }
      ],
      'Social Science': [
        {
          id: 'SS-MCQ-1',
          question: 'In which year did World War II end?',
          options: ['1944', '1945', '1946', '1947'],
          correctAnswer: '1945',
          explanation: 'World War II ended in 1945 with the surrender of Germany in May and Japan in September.',
          subject: 'Social Science'
        }
      ],
      'English': [
        {
          id: 'ENG-MCQ-1',
          question: 'Who wrote "Romeo and Juliet"?',
          options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
          correctAnswer: 'William Shakespeare',
          explanation: '"Romeo and Juliet" is one of William Shakespeare\'s most famous plays.',
          subject: 'English'
        }
      ],
      'NEET MCQ': [
        {
          id: 'NEET-MCQ-1',
          question: 'Which of the following is a fundamental force in nature?',
          options: ['Gravitational force', 'Frictional force', 'Tension', 'Normal force'],
          correctAnswer: 'Gravitational force',
          explanation: 'Gravitational force is one of the four fundamental forces of nature. Friction, tension, and normal force are contact forces and not fundamental.',
          subject: 'NEET MCQ'
        },
        {
          id: 'NEET-MCQ-2',
          question: 'Which law states that energy cannot be created or destroyed?',
          options: ['Hooke law', 'Faraday law','Law of conservation of energy', 'Newton second law'],
          correctAnswer: 'Law of conservation of energy',
          explanation: 'The law of conservation of energy states that the total energy of an isolated system remains constant. Energy can only change from one form to another.',
          subject: 'NEET MCQ'
        },
        {
          id: 'NEET-MCQ-3',
          question: 'Which of the following is the SI unit of power?',
          options: ['Joule', 'Newton', 'Watt', 'Pascal'],
          correctAnswer: 'Watt',
          explanation: 'Power is the rate of doing work and its SI unit is Watt. One Watt equals one Joule per second.',
          subject: 'NEET MCQ'
        },
        {
          id: 'NEET-MCQ-4',
          question: 'Which of the following is a strong acid?',
          options: ['Hydrochloric acid', 'Acetic acid', 'Carbonic acid', 'Citric acid'],
          correctAnswer: 'Hydrochloric acid',
          explanation: 'Hydrochloric acid is a strong acid as it dissociates completely in water, whereas the others are weak acids.',
          subject: 'NEET MCQ'
        },
        {
          id: 'NEET-MCQ-5',
          question: 'Which element has the highest electronegativity?',
          options: ['Oxygen', 'Chlorine', 'Nitrogen', 'Fluorine'],
          correctAnswer: 'Fluorine',
          explanation: 'Fluorine has the highest electronegativity because it has a small size and high tendency to attract electrons.',
          subject: 'NEET MCQ'
        },
        {
          id: 'NEET-MCQ-6',
          question: 'Which of the following is an example of a covalent compound?',
          options: ['Sodium chloride', 'Water','Calcium oxide', 'Potassium bromide'],
          correctAnswer: 'Water',
          explanation: 'Water is a covalent compound because the atoms share electrons to form bonds. The others are mainly ionic compounds.',
          subject: 'NEET MCQ'
        },
        {
          id: 'NEET-MCQ-7',
          question: 'Which plant tissue provides mechanical support and flexibility to young stems and leaves?',
          options: ['Collenchyma', 'Parenchyma', 'Sclerenchyma', 'Xylem'],
          correctAnswer: 'Collenchyma',
          explanation: 'Collenchyma cells have unevenly thickened walls which provide support and flexibility to growing plant parts.',
          subject: 'NEET MCQ'
        },
        {
          id: 'NEET-MCQ-8',
          question: 'Which plant hormone is responsible for cell elongation and bending towards light?',
          options: ['Gibberellin', 'Cytokinin', 'Abscisic acid', 'Auxin'],
          correctAnswer: 'Auxin',
          explanation: 'Auxin promotes cell elongation and helps plants bend towards light, a phenomenon called phototropism.',
          subject: 'NEET MCQ'
        },
        {
          id: 'NEET-MCQ-9',
          question: 'Which part of human brain controls heart rate and breathing?',
          options: ['Medulla oblongata', 'Cerebellum', 'Cerebrum', 'Hypothalamus'],
          correctAnswer: 'Medulla oblongata',
          explanation: 'Medulla oblongata controls autonomic functions like heart rate, breathing, and blood pressure.',
          subject: 'NEET MCQ'
        },
        {
          id: 'NEET-MCQ-10',
          question: 'Which blood cells produce antibodies to fight infections?',
          options: ['Platelets','B lymphocytes', 'T lymphocytes', 'Red blood cells',],
          correctAnswer: 'B lymphocytes',
          explanation: 'B lymphocytes are responsible for producing antibodies as part of the immune response.',
          subject: 'NEET MCQ'
        }
      ],
      'NEET MCQ 2.O': neet2Questions
    };

    return mcqQuestions[subject] || mcqQuestions['Mathematics'];
  };

  // Get chapter topics for syllabus-centric teaching - ONLY for NEET Physics/Chemistry/Biology
  const getChapterTopics = (subject: string, chapter: string): string[] => {
    const topicsMap: Record<string, Record<string, string[]>> = {
      'NEET Physics': {
        // Class 11 Physics
        'Units and Measurements': [
          'Significant Figures',
          'Errors in Measurement',
          'Measuring Instruments'
        ],
        'Mathematical Tools': [
          'Binomial Expression and Approximation',
          'Functions & Graphs',
          'Logarithms',
          'Differentiation and Integration'
        ],
        'Motion in a Straight Line': [
          'Frame of Reference',
          'Motion under Gravity (Free Fall Motion)',
          'Graph of 1D Motion',
          'Variable Acceleration'
        ],
        'Motion in a Plane': [
          'Vector Addition',
          'Resolution of Vectors',
          'Vector Projection',
          'Projectile Motion',
          'Relative Motion',
          'Circular Motion'
        ],
        'Newton\'s Laws of Motion': [
          'Newton\'s First Law of Motion',
          'Linear Momentum',
          'Free Body Diagram',
          'Working with Newton\'s Second Law',
          'Calculation of Acceleration',
          'Frame of Reference',
          'Rocket Propulsion',
          'Types of Friction',
          'Graph between Applied Force and Force of Friction',
          'Angle of Friction and Angle of Repose',
          'Acceleration of Body on Rough Surface',
          'Dynamics of Circular Motion'
        ],
        'Work, Energy & Power': [
          'Work',
          'Work Energy Theorem',
          'Conservative and Non-Conservative Force',
          'Potential Energy',
          'Equilibrium',
          'Law of Conservation of Energy',
          'Power',
          'Vertical Circular Motion'
        ],
        'Centre of Mass & System of Particles': [
          'Centre of Mass',
          'Head-on Collision',
          'Oblique Collision'
        ],
        'Rotational Motion': [
          'Moment of Inertia',
          'Theorems of Moment of Inertia',
          'Radius of Gyration',
          'Angular Momentum',
          'Rolling Motion',
          'Rolling Motion on Inclined Plane'
        ],
        'Gravitation': [
          'Law of Gravitation',
          'Acceleration due to Gravity',
          'Gravitational Potential Energy',
          'Gravitational Potential',
          'Relation between Field and Potential',
          'Escape Velocity',
          'Satellite Motion',
          'Kepler\'s Laws of Planetary Motion',
          'Weightlessness'
        ],
        'Mechanical Properties of Solids': [
          'Hooke\'s Law',
          'Modulus of Elasticity',
          'Young\'s Modulus'
        ],
        'Mechanical Properties of Fluids': [
          'Pressure',
          'Buoyancy',
          'Buoyant Force',
          'Equation of Continuity',
          'Bernoulli\'s Theorem',
          'Viscosity',
          'Surface Tension'
        ],
        'Thermal Properties of Matter': [
          'Thermal Expansion',
          'Application of Thermal Expansion',
          'Specific Heat Capacity',
          'Latent Heat',
          'Calorimetry',
          'Conduction',
          'Radiation'
        ],
        'Kinetic Theory of Gases': [
          'Ideal Gases',
          'Kinetic Theory of Gases',
          'Different Speeds of Gas Molecules',
          'Maxwell\'s Law',
          'Degree of Freedom',
          'Law of Equipartition of Energy'
        ],
        'Thermodynamics': [
          'Thermal Equilibrium and Zeroth Law',
          'First Law of Thermodynamics',
          'Different Types of Processes',
          'Carnot Cycle and Carnot Engine',
          'Heat Pump'
        ],
        'Oscillations': [
          'Periodic Motion and Oscillatory Motion',
          'Some Basic Terms Related to Oscillatory Motion',
          'Simple Harmonic Motion (SHM)',
          'Equations of SHM',
          'Energy in SHM',
          'Calculation of Time Period of Spring Block System',
          'Time Period of Pendulum',
          'Oscillation of Liquid Column'
        ],
        'Waves': [
          'Characteristics of Waves',
          'Progressive Wave on String',
          'Characteristics of Sound Wave',
          'Principle of Superposition of Wave',
          'Stationary Waves',
          'Echo'
        ],

        // Class 12 Physics
        'Electric Charges and Fields': [
          'Charge',
          'Coulomb\'s Law',
          'Electric Field of a Continuous Charge Distribution',
          'Motion of a Charged Particle in Uniform Electric Field',
          'Electric Field Lines',
          'Electric Flux',
          'Gauss Law',
          'Application of Gauss\'s Law',
          'Electric Dipole',
          'Dipole in a Uniform External Field',
          'Short Dipole in Non-Uniform Electric Field'
        ],
        'Electrostatic Potential and Capacitance': [
          'Electrostatic Potential/Potential Difference',
          'Equipotential Surface',
          'Electric Potential Due to Dipole',
          'Electrostatics of Conductor'
        ],
        'Current Electricity': [
          'Kirchhoff\'s Laws and Combination of Resistances',
          'Wheatstone Bridge and Symmetric Circuits',
          'Electrical Measuring Instruments',
          'RC Circuit'
        ],
        'Moving Charges and Magnetism': [
          'Biot-Savart\'s Law',
          'Magnetic Field Due to a Current Carrying Ring and Problems on Combination of Ring and Rod',
          'Ampere\'s Law and Its Applications',
          'Force on a Moving Charge in a Magnetic Field',
          'Helical Path',
          'Lorentz Force and Velocity Selector',
          'Magnetic Force on a Current Carrying Conductor',
          'Gyromagnetic Ratio',
          'Torque on a Current Carrying Loop'
        ],
        'Magnetism and Matter': [
          'Bar Magnet and Its Properties',
          'Circular Coil as Magnetic Dipole',
          'Tangent Galvanometer',
          'Oscillation Magnetometer',
          'Magnetisation and Magnetic Intensity',
          'Classification of Magnetic Materials',
          'Ferromagnetism and Hysteresis'
        ],
        'Electromagnetic Induction': [
          'Magnetic Flux and Lenz\'s Law',
          'Calculation of Induced EMF',
          'Induced Electric Field',
          'Self Inductance',
          'Mutual Inductance',
          'LC Oscillations and Transformer',
          'Faraday\'s Law'
        ],
        'Alternating Current': [
          'Introduction to Alternating Current',
          'Average and RMS Values',
          'Types of AC Circuits',
          'Power & Power Factor',
          'Choke Coil',
          'Series LCR Circuit and Resonant Frequency',
          'LC Oscillations and Transformer'
        ],
        'Electromagnetic Waves': [
          'Characteristics of Electromagnetic Waves'
        ],
        'Ray Optics and Optical Instruments': [
          'Reflection from Plane Mirror',
          'Reflection from Spherical Mirror',
          'Refraction from Plane Surface',
          'Total Internal Refraction',
          'Newton\'s Formula',
          'Combination of Lens and Mirror',
          'Displacement Method to Find Focal Length',
          'Dispersion of Light',
          'Optical Instruments'
        ],
        'Wave Optics': [
          'Nature of Light',
          'Interference of Light',
          'Diffraction of Light',
          'Polarisation'
        ],
        'Dual Nature of Radiation and Matter': [
          'Quantum Theory of Light',
          'Photoelectric Effect'
        ],
        'Atoms': [
          'Bohr\'s Model'
        ],
        'Nuclei': [
          'Mass Energy',
          'Nuclear Size',
          'Nuclear Stability',
          'Binding Energy',
          'Nuclear Energy'
        ],
        'Semiconductor Electronics: Materials, Devices and Simple Circuits': [
          'PN Junction Diode',
          'Application of PN Junction Diode',
          'Logic Gate'
        ]
      },
      'NEET Chemistry': {
        // Class 11 Chemistry
        'Some Basic Concepts of Chemistry': [
          'Mole Concept',
          'Determination of Formula of Compound',
          'Stoichiometric Calculations',
          'Concentration Terms',
          'Relation Between Molarity and Normality'
        ],
        'Redox Reactions': [
          'Oxidation Number',
          'Redox Reactions',
          'Balancing of Redox Reactions',
          'Electrochemical Cell'
        ],
        'Structure of Atom': [
          'Subatomic Particles',
          'Concept of Atomic Number and Mass Number',
          'Bohr\'s Model of an Atom',
          'Particle Nature of Electromagnetic Radiation',
          'Photoelectric Effect',
          'Quantum Mechanical Model',
          'Quantum Numbers',
          'Electronic Configuration of Atoms'
        ],
        'Thermodynamics': [
          'P-V Work',
          'Heat Capacity',
          'Thermochemistry',
          'Second Law of Thermodynamics'
        ],
        'Equilibrium': [
          'Applications of Equilibrium Constant',
          'Equilibrium Constant',
          'Factors Affecting State of Equilibrium',
          'Expressing Hydrogen Ion Concentration',
          'Buffer Solution',
          'Solubility of Sparingly Soluble Salts'
        ],
        'Organic Chemistry – Some Basic Principles and Techniques': [
          'Naming the Organic Compounds',
          'Isomerism in Organic Compounds',
          'Electronic Displacements in Covalent Compounds',
          'Reaction Intermediates',
          'Hybridisation'
        ],
        'Hydrocarbons': [
          'Conformations of Hydrocarbons',
          'Isomerism in Alkenes',
          'Stability of Alkene',
          'Chemical Reactions of Alkenes',
          'Chemical Reactions of Alkynes',
          'Aromatic Hydrocarbons',
          'Chemical Reactions of Aromatic Hydrocarbons'
        ],
        'Classification of Elements and Periodicity in Properties': [
          'Modern Periodic Table',
          'Periodic Trends in Properties of Elements'
        ],
        'Chemical Bonding and Molecular Structure': [
          'General Introduction',
          'Polarity of Bonds',
          'Covalent Character in Ionic Bonds',
          'Geometry or Shapes of Molecules',
          'Concept of Orbital Overlap in Covalent Bonds',
          'Molecular Orbital Theory (MOT)',
          'Hydrogen Bond'
        ],
        'Principles Related To Practical Organic Chemistry': [
          'Analysis of Organic Compounds',
          'Volumetric Analysis',
          'Qualitative Salt Analysis',
          'Enthalpy'
        ],
        'The p-Block Elements – Part 1': [
          'Group-13 Elements',
          'Group-14 Elements'
        ],

        // Class 12 Chemistry
        'Solutions': [
          'Solubility of Gases in Liquids',
          'Vapour Pressure of Liquid Solutions',
          'Colligative Properties',
          'Abnormal Molar Masses'
        ],
        'Chemical Kinetics': [
          'Dependence of Reaction Rate on Concentration',
          'Integrated Rate Expressions',
          'Dependence of Reaction Rate on Temperature'
        ],
        'Electrochemistry': [
          'Electrolytic Conduction',
          'Variation of Conductivity and Molar Conductivity with Concentration',
          'Kohlrausch\'s Law',
          'Electrochemical or Galvanic Cell',
          'Electrochemical Series',
          'Dependence of Cell and Electrode Potentials on Concentration',
          'Electrolytic Cells and Electrolysis',
          'Fuel Cells'
        ],
        'Haloalkanes and Haloarenes': [
          'Chemical Properties of Haloalkanes',
          'Chemical Properties of Haloarenes',
          'Polyhalogen Compounds'
        ],
        'Alcohols, Phenols and Ethers': [
          'Alcohols – Reactions Involving Cleavage of (O-H) Bond, (C-O) Bond, and Both Alkyl & Hydroxyl Groups',
          'Phenols – Reactions of Phenolic Group, Reactions of Benzene Ring, Special Reactions',
          'Distinction Between Alcohols and Phenols'
        ],
        'Aldehydes, Ketones and Carboxylic Acids': [
          'Aldehydes & Ketones – Nucleophilic Addition, Oxidation, Reduction, Reaction with Base',
          'Carboxylic Acids – Properties and Reactions'
        ],
        'Amines': [
          'Preparation Methods',
          'Chemical Properties',
          'Ring Substitution in Aromatic Amines',
          'Distinction Between Amines'
        ],
        'Biomolecules': [
          'Glucose and Fructose',
          'Glucose – Reaction Due to Open Chain Structure',
          'Disaccharides',
          'Proteins',
          'Nucleic Acids'
        ],
        'Coordination Compounds': [
          'Ligands',
          'Werner\'s Theory',
          'Coordination Compounds',
          'Isomerism in Coordination Compounds',
          'Bonding in Coordination Compounds'
        ],
        'The d- and f-Block Elements': [
          'Introduction',
          'General Properties of Transition Elements',
          'Compounds of Transition Metals',
          'Inner Transition Elements (Lanthanoids)',
          'Inner Transition Elements (Actinoids)'
        ],
        'The p-Block Elements – Part 2': [
          'Group-15 Elements',
          'Group-16 Elements',
          'Group-17 Elements',
          'Group-18 Elements'
        ]
      },
      'NEET Biology': {
        // Class 11 Biology
        'The Living World': [
          'What is living? Biodiversity',
          'Need for classification',
          'Taxonomy & Systematics',
          'Concept of species and taxonomical hierarchy',
          'Binomial nomenclature'
        ],
        'Biological Classification': [
          'Five kingdom classification',
          'Salient features and classification of Monera, Protista, and Fungi into major groups',
          'Lichens',
          'Viruses and Viroids'
        ],
        'Plant Kingdom': [
          'Salient features and classification of plants into major groups — Algae, Bryophytes, Pteridophytes, Gymnosperms (three to five salient features and at least two examples of each category)'
        ],
        'Animal Kingdom': [
          'Salient features and classification of animals — Non-chordates up to phylum level and chordates up to class level (three to five salient features and at least two examples)'
        ],
        'Morphology of Flowering Plants': [
          'Morphology and modifications',
          'Root, stem, leaf, inflorescence (cymose and racemose), flower, fruit, and seed',
          'Families — Malvaceae, Cruciferae, Leguminosae, Compositae, Gramineae'
        ],
        'Anatomy of Flowering Plants': [
          'Tissues',
          'Anatomy and functions of different parts of flowering plants — root, stem, and leaf'
        ],
        'Structural Organisation in Animals': [
          'Animal tissues',
          'Morphology, anatomy, and functions of different systems (digestive, circulatory, respiratory, nervous, and reproductive) of a frog (brief account only)'
        ],
        'Cell: The Unit of Life': [
          'Cell theory and cell as the basic unit of life',
          'Structure of prokaryotic and eukaryotic cells',
          'Plant and animal cells',
          'Cell envelope, membrane, and wall',
          'Cell organelles — structure and function (ER, Golgi bodies, lysosomes, vacuoles, mitochondria, ribosomes, plastids, microbodies)',
          'Cytoskeleton, cilia, flagella, centrioles',
          'Nucleus — membrane, chromatin, nucleolus'
        ],
        'Biomolecules': [
          'Chemical constituents of living cells',
          'Structure and function of proteins, carbohydrates, lipids, and nucleic acids',
          'Enzymes — types, properties, mechanism of action, classification, and nomenclature'
        ],
        'Cell Cycle and Cell Division': [
          'Cell cycle',
          'Mitosis',
          'Meiosis',
          'Significance of cell division'
        ],
        'Transport in Plants': [
          'Means of transport',
          'Diffusion, facilitated diffusion, active transport',
          'Water potential',
          'Osmosis',
          'Transpiration',
          'Ascent of sap',
          'Translocation of solutes',
          'Phloem transport'
        ],
        'Mineral Nutrition': [
          'Essential minerals, macro and micronutrients',
          'Role of nutrients',
          'Deficiency symptoms',
          'Nitrogen metabolism',
          'Nitrogen cycle'
        ],
        'Photosynthesis in Higher Plants': [
          'Photosynthesis as a means of autotrophic nutrition',
          'Site of photosynthesis',
          'Photosynthetic pigments',
          'Photochemical and biosynthetic phases',
          'Cyclic and non-cyclic photophosphorylation',
          'Chemiosmotic hypothesis',
          'Photorespiration',
          'C3 and C4 pathways',
          'Factors affecting photosynthesis'
        ],
        'Respiration in Plants': [
          'Exchange of gases',
          'Cellular respiration — glycolysis, fermentation (anaerobic), TCA cycle, electron transport system (aerobic)',
          'Energy relations — ATP generation, amphibolic pathways, respiratory quotient'
        ],
        'Plant Growth and Development': [
          'Seed germination',
          'Phases and rate of plant growth',
          'Conditions of growth',
          'Differentiation, dedifferentiation, and redifferentiation',
          'Growth regulators — auxin, gibberellin, cytokinin, ethylene, ABA'
        ],
        'Digestion and Absorption': [
          'Digestive system of humans',
          'Digestion and absorption of carbohydrates, proteins, and fats',
          'Digestive glands and their secretions',
          'Disorders of the digestive system'
        ],
        'Breathing and Exchange of Gases': [
          'Respiratory organs in animals',
          'Human respiratory system',
          'Mechanism and regulation of breathing',
          'Exchange and transport of gases',
          'Respiratory volumes',
          'Disorders — Asthma, Emphysema, Occupational respiratory diseases'
        ],
        'Body Fluids and Circulation': [
          'Composition of blood',
          'Blood groups',
          'Coagulation',
          'Lymph',
          'Human heart structure and cardiac cycle',
          'Cardiac output',
          'ECG',
          'Double circulation',
          'Regulation of cardiac activity',
          'Disorders — Hypertension, Coronary artery disease, Angina pectoris, Heart failure'
        ],
        'Excretory Products and Their Elimination': [
          'Modes of excretion — Ammonotelism, Ureotelism, Uricotelism',
          'Human excretory system',
          'Urine formation',
          'Osmoregulation',
          'Kidney function regulation — Renin-Angiotensin, ANF, ADH',
          'Disorders — Uraemia, Renal failure, Renal calculi, Nephritis',
          'Dialysis and artificial kidney'
        ],
        'Locomotion and Movement': [
          'Types of movement — ciliary, flagellar, muscular',
          'Skeletal muscles — contractile proteins and muscle contraction',
          'Skeletal system and joints',
          'Disorders — Myasthenia gravis, Tetany, Muscular dystrophy, Arthritis, Osteoporosis, Gout'
        ],
        'Neural Control and Coordination': [
          'Neuron and nerves',
          'Human nervous system — central, peripheral, and visceral',
          'Generation and conduction of nerve impulse'
        ],
        'Chemical Coordination and Integration': [
          'Endocrine glands and hormones',
          'Human endocrine system — hypothalamus, pituitary, pineal, thyroid, parathyroid, adrenal, pancreas, gonads',
          'Mechanism of hormone action',
          'Hypo/hyperactivity disorders — Dwarfism, Acromegaly, Cretinism, Goiter, Diabetes, Addison\'s disease'
        ],

        // Class 12 Biology
        'Reproduction in Organisms': [
          'Asexual and sexual reproduction',
          'Reproductive structures and cycles in various organisms'
        ],
        'Sexual Reproduction in Flowering Plants': [
          'Flower structure',
          'Male and female gametophyte development',
          'Pollination — types, agents, examples',
          'Outbreeding devices',
          'Pollen–pistil interaction',
          'Double fertilization',
          'Post-fertilization events — endosperm, embryo, seed, fruit development',
          'Apomixis, parthenocarpy, polyembryony'
        ],
        'Human Reproduction': [
          'Male and female reproductive systems',
          'Microscopic anatomy of testis and ovary',
          'Gametogenesis — spermatogenesis, oogenesis',
          'Menstrual cycle',
          'Fertilization, embryo development, implantation',
          'Pregnancy, placenta, parturition, lactation'
        ],
        'Reproductive Health': [
          'Need for reproductive health',
          'Prevention of STDs',
          'Birth control methods',
          'Contraception',
          'MTP',
          'Amniocentesis',
          'Infertility',
          'Assisted reproductive technologies — IVF, ZIFT, GIFT'
        ],
        'Principles of Inheritance and Variation': [
          'Mendelian inheritance',
          'Deviations — incomplete dominance, co-dominance, multiple alleles, polygenic inheritance',
          'Chromosome theory of inheritance',
          'Sex determination',
          'Linkage, crossing over',
          'Sex-linked inheritance',
          'Mendelian and chromosomal disorders'
        ],
        'Molecular Basis of Inheritance': [
          'Search for genetic material',
          'DNA and RNA structure',
          'Packaging',
          'Replication',
          'Central dogma',
          'Transcription',
          'Translation',
          'Gene expression and regulation — Lac Operon',
          'Human Genome Project',
          'DNA fingerprinting',
          'Protein biosynthesis'
        ],
        'Evolution': [
          'Origin of life',
          'Biological evolution',
          'Evidences from paleontology, anatomy, embryology, molecular biology',
          'Darwin\'s theory',
          'Modern synthetic theory',
          'Mechanisms — mutation, recombination, natural selection, gene flow, genetic drift',
          'Hardy-Weinberg principle',
          'Adaptive radiation',
          'Human evolution'
        ],
        'Human Health and Disease': [
          'Health and diseases',
          'Pathogens and diseases — Malaria, Filariasis, Ascariasis, Typhoid, Pneumonia, Common cold, Amoebiasis, Ringworm, Dengue, Chikungunya',
          'Immunology and vaccines',
          'Cancer',
          'HIV/AIDS',
          'Adolescence, drug, alcohol, and tobacco abuse'
        ],
        'Strategies for Enhancement in Food Production': [
          'Animal husbandry',
          'Plant breeding',
          'Tissue culture',
          'Single-cell protein',
          'Biofortification'
        ],
        'Microbes in Human Welfare': [
          'Microbes in household food processing, industrial production, sewage treatment, energy generation, biocontrol, and biofertilizers'
        ],
        'Biotechnology – Principles and Processes': [
          'Principles and process of biotechnology',
          'Genetic engineering — recombinant DNA technology'
        ],
        'Biotechnology and Its Applications': [
          'Applications in health and agriculture — human insulin, vaccines, gene therapy',
          'GMOs — Bt crops, transgenic animals',
          'Biosafety, biopiracy, and patents'
        ],
        'Organisms and Populations': [
          'Organisms and environment',
          'Population interactions — mutualism, competition, predation, parasitism',
          'Population attributes — growth, birth rate, death rate, age distribution'
        ],
        'Ecosystem': [
          'Structure, components, productivity, decomposition, energy flow',
          'Pyramids of number, biomass, and energy'
        ],
        'Biodiversity and Conservation': [
          'Concept, importance, and patterns of biodiversity',
          'Loss and conservation of biodiversity',
          'Hotspots',
          'Endangered species',
          'Extinction',
          'Red Data Book',
          'Biosphere reserves',
          'National parks',
          'Sanctuaries',
          'Sacred groves'
        ],
        'Environmental Issues': [
          'Pollution, global warming, ozone depletion, deforestation, waste management, and sustainable development'
        ]
      }
    };

    return topicsMap[subject]?.[chapter] || [
      'Fundamental Concepts',
      'Key Principles',
      'Important Applications',
      'Problem Solving Techniques'
    ];
  };

  // NEW FUNCTION: Generate dynamic chapter lecture using Groq API - ONLY for NEET Physics/Chemistry/Biology
  const generateChapterLecture = async () => {
    if (hasGeneratedIntroduction) return;

    try {
      setIsGeneratingLecture(true);
      const chapterTopics = getChapterTopics(course.category, lesson.title);
      
      const lecturePrompt = `You are a friendly, engaging NEET teacher introducing and teaching a new chapter.

      CHAPTER: "${lesson.title}"
      SUBJECT: ${course.category}
      
      TOPICS TO COVER:
      ${chapterTopics.map((topic, index) => `${index + 1}. ${topic}`).join('\n')}
      
      Structure your lecture as:
      1. Warm welcome and chapter importance (why this chapter matters for NEET)
      2. Brief overview of what we'll learn
      3. Detailed explanation of key concepts (cover all the main topics from the list)
      4. Real-world applications and NEET relevance
      5. NEET-relevant questions with detailed answers related to this chapter
      6. Summary and key takeaways
      
      Make it:
      - Friendly and engaging like a great teacher
      - Concept-focused and easy to understand
      - Relevant to NEET examination patterns
      - Include examples and analogies where helpful
      - The response must be plain text only and must not include any Markdown or formatting symbols such as *, **, #, _, or backticks
      - Maximum 700 words
      
      Speak directly to the student as if you're in a classroom.`;

      // Dynamic API URL - Fixed for production
      const apiUrl = window.location.hostname === 'yugaai.app' || window.location.hostname === '66.116.198.191'
        ? '/api/voice/query'
        : 'http://localhost:5000/api/voice/query';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio: null,
          messages: [
            {
              role: 'user',
              content: lecturePrompt
            }
          ],
          courseCategory: course.category
        })
      });

      if (response.ok) {
        const data = await response.json();
        const lecture = data.response || getSubjectIntroduction(course.category, lesson.title);
        
        // Set both speech and lecture content
        setCurrentSpeech(lecture);
        setLectureContent(lecture);
        
        // Generate key points and summary from the lecture
        await generateKeyPointsAndSummary(lecture);
        
        setHasGeneratedIntroduction(true);
      } else {
        throw new Error('Failed to generate lecture');
      }
    } catch (error) {
      console.error('Error generating chapter lecture:', error);
      // Fallback to static introduction
      const fallbackLecture = getSubjectIntroduction(course.category, lesson.title);
      setCurrentSpeech(fallbackLecture);
      setLectureContent(fallbackLecture);
      await generateKeyPointsAndSummary(fallbackLecture);
      setHasGeneratedIntroduction(true);
    } finally {
      setIsGeneratingLecture(false);
    }
  };

  // NEW FUNCTION: Generate key points and summary from lecture content
  const generateKeyPointsAndSummary = async (lecture: string) => {
    try {
      // Generate key points
      const keyPointsPrompt = `Extract the most important key points from this lecture text. Format as a bullet point list without any additional text:

LECTURE:
${lecture}

KEY POINTS:`;

      // Dynamic API URL - Fixed for production
      const apiUrl = window.location.hostname === 'yugaai.app' || window.location.hostname === '66.116.198.191'
        ? '/api/voice/query'
        : 'http://localhost:5000/api/voice/query';

      const keyPointsResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio: null,
          messages: [
            {
              role: 'user',
              content: keyPointsPrompt
            }
          ],
          courseCategory: course.category
        })
      });

      if (keyPointsResponse.ok) {
        const keyPointsData = await keyPointsResponse.json();
        const keyPointsText = keyPointsData.response || '';
        // Parse bullet points from response
        const points = keyPointsText.split('\n')
          .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
          .map(point => point.replace(/^[-•]\s*/, '').trim())
          .filter(point => point.length > 0);
        
        setKeyPoints(points.length > 0 ? points : [
          'Fundamental concepts and principles',
          'Key formulas and equations',
          'Important applications',
          'Problem-solving techniques',
          'NEET examination focus areas'
        ]);
      }

      // Generate summary
      const summaryPrompt = `Create a concise single-paragraph summary of this lecture in plain text only, focusing on the main concepts, important points, and overall takeaways. Do not use any formatting symbols such as *, **, #, _, or backticks:

LECTURE:
${lecture}

SUMMARY:`;

      const summaryResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio: null,
          messages: [
            {
              role: 'user',
              content: summaryPrompt
            }
          ],
          courseCategory: course.category
        })
      });

      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json();
        const summaryText = summaryData.response || 'This chapter covers important concepts relevant to NEET examination. Focus on understanding fundamental principles and their applications.';
        setSummary(summaryText);
      }

      // Update whiteboard with all three sections
      updateWhiteboardWithSections(lecture);

    } catch (error) {
      console.error('Error generating key points and summary:', error);
      // Fallback key points and summary
      setKeyPoints([
        'Fundamental concepts and principles',
        'Key formulas, equations and definitions', 
        'Important applications',
        'Problem-solving techniques',
        'NEET examination focus areas'
      ]);
      setSummary('This chapter covers important concepts relevant to NEET examination. Focus on understanding fundamental principles and their applications.');
      updateWhiteboardWithSections(lecture);
    }
  };

  // NEW FUNCTION: Update whiteboard with three sections in new order
  const updateWhiteboardWithSections = (lecture: string) => {
    const whiteboardSections = [
      `${course.title} - ${lesson.title}`,
      "",
      "KEY POINTS", 
      "=".repeat(50),
      ...keyPoints.map(point => `• ${point}`),
      "",
      "CLASS LECTURE",
      "=".repeat(50),
      ...lecture.split('\n').filter(line => line.trim()),
      "",
      "SUMMARY",
      "=".repeat(50),
      summary
    ];
    
    setWhiteboardContent(whiteboardSections);
  };

  // NEW FUNCTION: Add key point in real-time as lecture progresses
  const addKeyPointInRealTime = () => {
    if (currentKeyPointIndex < keyPoints.length - 1) {
      setCurrentKeyPointIndex(prev => prev + 1);
      
      // Update whiteboard to show only key points up to current index
      const visibleKeyPoints = keyPoints.slice(0, currentKeyPointIndex + 1);
      
      const whiteboardSections = [
        `${course.title} - ${lesson.title}`,
        "",
        "KEY POINTS", 
        "=".repeat(50),
        ...visibleKeyPoints.map(point => `• ${point}`),
        "",
        "CLASS LECTURE",
        "=".repeat(50),
        ...lectureContent.split('\n').filter(line => line.trim()),
        "",
        "SUMMARY",
        "=".repeat(50),
        summary
      ];
      
      setWhiteboardContent(whiteboardSections);
    }
  };

  // Update whiteboard when key points or summary change
  useEffect(() => {
    if (lectureContent && (keyPoints.length > 0 || summary)) {
      updateWhiteboardWithSections(lectureContent);
    }
  }, [keyPoints, summary, lectureContent]);

  // NEW EFFECT: Simulate real-time key point generation during speech
  useEffect(() => {
    if (isLessonActive && currentSpeech && keyPoints.length > 0 && currentKeyPointIndex < keyPoints.length) {
      // Calculate when to show next key point based on speech progress
      const speechWords = currentSpeech.split(' ');
      const totalWords = speechWords.length;
      const keyPointInterval = Math.floor(totalWords / keyPoints.length);
      
      const timer = setTimeout(() => {
        addKeyPointInRealTime();
      }, 3000 + (currentKeyPointIndex * 5000)); // Show first key point after 3s, then every 5s

      return () => clearTimeout(timer);
    }
  }, [isLessonActive, currentSpeech, currentKeyPointIndex, keyPoints.length]);

  const handleNEET2Answer = (selectedAnswer: string, isCorrect: boolean) => {
    setUserAnswer(selectedAnswer);
    setIsCorrect(isCorrect);
    
    if (isCorrect) {
      setCurrentSpeech("Excellent! That's the correct answer. Would you like an explanation?");
    } else {
      setCurrentSpeech("That is not correct. Let me explain the right answer.");
      setTimeout(() => {
        handleNEET2ExplanationRequest(currentNEET2Question!);
      }, 2000);
    }
  };

  const stopAllMedia = () => {
    // Stop any ongoing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsAudioPlaying(false);
    
    // Stop avatar video
    const video = avatarRef.current?.videoRef?.current;
    if (video) {
      video.pause();
    }
    
    // Stop text-to-speech
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    // Reset explanation states
    setIsExplaining(false);
    setShowClarityPopup(false);
    setWaitingForClarityResponse(false);
    setShouldShowClarityPopup(false);
  };

  const playAudioFromBase64 = async (base64Audio: string): Promise<void> => {
    return new Promise((resolve) => {
      try {
        // Stop any currently playing audio first
        stopAllMedia();

        // Create audio element from base64 data
        const audioBlob = new Blob([
          Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0))
        ], { type: 'audio/mp3' });

        const audioUrl = URL.createObjectURL(audioBlob);
        const audioElement = new Audio(audioUrl);
        audioRef.current = audioElement;

        // Play the video when audio starts - CRITICAL FOR NEET MCQ 2.O
        const video = avatarRef.current?.videoRef?.current;
        if (video) {
          video.play().catch(error => {
            console.error('Error playing avatar video:', error);
          });
        }

        audioElement.onplay = () => {
          setIsAudioPlaying(true);
        };

        audioElement.onended = () => {
          setIsAudioPlaying(false);
          // Pause the avatar video when audio ends
          const video = avatarRef.current?.videoRef?.current;
          if (video) {
            video.pause();
          }
          
          // Show clarity popup after ANY explanation audio ends - regardless of timing
          if (shouldShowClarityPopup) {
            setShowClarityPopup(true);
            setWaitingForClarityResponse(true);
          }
          resolve();
        };

        audioElement.onerror = () => {
          setIsAudioPlaying(false);
          console.error('Error playing audio response');
          // Show clarity popup even if audio fails for explanations
          if (shouldShowClarityPopup) {
            setShowClarityPopup(true);
            setWaitingForClarityResponse(true);
          }
          resolve();
        };

        audioElement.play();
      } catch (err) {
        console.error('Error playing audio:', err);
        setIsAudioPlaying(false);
        // Show clarity popup even if audio fails for explanations
        if (shouldShowClarityPopup) {
          setShowClarityPopup(true);
          setWaitingForClarityResponse(true);
        }
        resolve();
      }
    });
  };

  const preprocessTextForTTS = (text: string): string => {
    if (!text) return text;
    
    return text
      // Replace chemical formulas with spaced versions for better TTS
      .replace(/CaCO₃/g, 'C A C O 3')
      .replace(/CaO/g, 'C A O')
      .replace(/CO₂/g, 'C O 2')
      .replace(/H₂O/g, 'H 2 O')
      .replace(/H₂/g, 'H 2')
      .replace(/O₂/g, 'O 2')
      .replace(/CO₂/g, 'C O 2')
      // Replace arrows with "gives"
      .replace(/→/g, ' gives ')
      // Remove asterisks and other markdown symbols
      .replace(/\*/g, '')
      .replace(/#/g, '')
      .replace(/`/g, '')
      .replace(/- /g, '')
      .trim();
  };

  const getBalancedPrompt = (question: MCQQuestion, userAnswer: string, isCorrect: boolean) => {
    const isNumerical = /\d/.test(question.question) && question.options.some(opt => /\d/.test(opt));
    
    let prompt = `Provide a clear, concise explanation for this NEET question (100-150 words):

QUESTION: "${question.question}"
CORRECT ANSWER: "${question.correctAnswer}"
${userAnswer && !isCorrect ? `STUDENT'S WRONG ANSWER: "${userAnswer}"` : ''}

REQUIREMENTS:
• Focus on key concept (1-2 sentences)
• ${isNumerical ? 'Show calculation steps briefly' : 'Explain scientific principle'}
• Mention why correct answer is right
• Briefly explain why wrong options are incorrect
• No markdown, simple language
• Maximum 150 words
• Use "gives" instead of arrows
• Spell out chemical formulas clearly

Make it educational but concise.`;

    return prompt;
  };

  const handleNEET2ExplanationRequest = async (question: MCQQuestion) => {
    setIsExplaining(true);
    setExplanationText('');
    setShowClarityPopup(false);
    setWaitingForClarityResponse(false);
    setShouldShowClarityPopup(true); // Enable clarity popup for this explanation
    
    try {
      const balancedPrompt = getBalancedPrompt(question, userAnswer, isCorrect);

      // Dynamic API URL - Fixed for production
      const apiUrl = window.location.hostname === 'yugaai.app' || window.location.hostname === '66.116.198.191'
        ? '/api/voice/query'
        : 'http://localhost:5000/api/voice/query';

      // Call Groq API for explanation
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio: null,
          messages: [
            {
              role: 'user',
              content: balancedPrompt
            }
          ],
          courseCategory: 'NEET MCQ'
        })
      });

      if (response.ok) {
        const data = await response.json();
        let fullExplanation = data.response || `The correct answer is ${question.correctAnswer}.`;
        
        // Clean up the response but keep chemical subscripts for display
        fullExplanation = fullExplanation
          .replace(/\*\*/g, '')
          .replace(/#/g, '')
          .replace(/```/g, '')
          .replace(/`/g, '')
          .trim();

        // Preprocess for TTS
        const processedExplanation = preprocessTextForTTS(fullExplanation);

        // Update whiteboard with explanation (keep original formatting with subscripts)
        setWhiteboardContent(prev => [
          ...prev,
          `Question: ${question.question}`,
          `Your answer: ${userAnswer || 'Not answered'}`,
          `Correct answer: ${question.correctAnswer}`,
          ``,
          fullExplanation
        ]);
        
        // Set explanation text (keep original formatting with subscripts)
        setExplanationText(fullExplanation);
        setHighlightedText(fullExplanation);
        
        // Play audio if available
        if (data.audio) {
          await playAudioFromBase64(data.audio);
        } else {
          // Fallback: use TTS with consistent voice
          setCurrentSpeech(processedExplanation);
        }

        setIsExplaining(false);

      } else {
        throw new Error('Failed to get explanation from Groq');
      }
    } catch (error) {
      console.error('Error getting explanation from Groq:', error);
      // Concise fallback explanation
      const fallbackExplanation = `Correct answer: ${question.correctAnswer}. 
      
Key concept: ${question.correctAnswer === 'Production of insulin' ? 
'Insulin is produced by pancreas, not liver. Liver produces bile, detoxifies, and stores glycogen.' :
question.correctAnswer === 'Pulmonary vein' ?
'Pulmonary vein carries oxygenated blood from lungs to heart. Pulmonary artery carries deoxygenated blood.' :
'Focus on understanding the fundamental principle.'}`;

      const processedFallback = preprocessTextForTTS(fallbackExplanation);

      setWhiteboardContent(prev => [
        ...prev,
        `Question: ${question.question}`,
        `Your answer: ${userAnswer || 'Not answered'}`,
        `Correct answer: ${question.correctAnswer}`,
        ``,
        fallbackExplanation
      ]);
      
      setExplanationText(fallbackExplanation);
      setHighlightedText(fallbackExplanation);
      setIsExplaining(false);
      setCurrentSpeech(processedFallback);
    }
  };

  const handleNEET2NextQuestion = () => {
    // Stop ALL media immediately - even if explanation is not complete
    stopAllMedia();

    const nextIndex = (currentNEET2QuestionIndex + 1) % neet2Questions.length;
    setCurrentNEET2QuestionIndex(nextIndex);
    setCurrentNEET2Question(neet2Questions[nextIndex]);
    setExplanationText('');
    setHighlightedText('');
    setShowClarityPopup(false);
    setWaitingForClarityResponse(false);
    setUserAnswer('');
    setIsCorrect(false);
    setShouldShowClarityPopup(false); // Disable clarity popup for new question
    setCurrentSpeech(`Here's question ${nextIndex + 1} of ${neet2Questions.length}. Please select your answer.`);
    
    // Reset whiteboard for new question
    setWhiteboardContent([
      `${course.title} - ${lesson.title}`,
      `NEET MCQ 2.O MCQs - Question ${nextIndex + 1}`,
      "Key Learning Objectives:",
      "• Understand fundamental principles",
      "• Apply concepts to real scenarios",
      "• Develop critical thinking skills"
    ]);

    // Scroll MCQ box to top when new question loads
    setTimeout(() => {
      if (mcqBoxRef.current) {
        mcqBoxRef.current.scrollTop = 0;
      }
    }, 100);
  };

  const handleTryAgain = () => {
    // Stop ALL media immediately
    stopAllMedia();

    setExplanationText('');
    setHighlightedText('');
    setShowClarityPopup(false);
    setWaitingForClarityResponse(false);
    setUserAnswer('');
    setIsCorrect(false);
    setShouldShowClarityPopup(false); // Disable clarity popup for retry
    setCurrentSpeech("Let's try this question again. Please select your answer.");
  };

  const handleClarityResponse = (isClear: boolean) => {
    setShowClarityPopup(false);
    setWaitingForClarityResponse(false);
    setShouldShowClarityPopup(false); // Disable clarity popup after response
    
    if (isClear) {
      setCurrentSpeech("Great! Let's continue with the next question.");
      setTimeout(() => {
        handleNEET2NextQuestion();
      }, 2000);
    } else {
      setCurrentSpeech("Let me explain this again from the basics.");
      setTimeout(() => {
        // Enhanced explanation with basic concepts
        const enhancedPrompt = `Explain this NEET question from basic concepts for a student who didn't understand the previous explanation. Use very simple language and start from fundamental concepts:

QUESTION: "${currentNEET2Question?.question}"
CORRECT ANSWER: "${currentNEET2Question?.correctAnswer}"
STUDENT'S ANSWER: "${userAnswer}"

REQUIREMENTS:
• Start with fundamental concepts
• Break down step by step
• Use simple analogies
• Explain why each option is right or wrong
• Build up to the correct answer gradually
• Maximum 200 words
• Use very simple and clear language
• Use "gives" instead of arrows
• Spell out chemical formulas clearly

Make it very clear and foundational.`;
        
        // Dynamic API URL - Fixed for production
        const apiUrl = window.location.hostname === 'yugaai.app' || window.location.hostname === '66.116.198.191'
          ? '/api/voice/query'
          : 'http://localhost:5000/api/voice/query';

        // Call Groq API for enhanced explanation
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            audio: null,
            messages: [
              {
                role: 'user',
                content: enhancedPrompt
              }
            ],
            courseCategory: 'NEET MCQ'
          })
        })
        .then(response => response.json())
        .then(data => {
          let enhancedExplanation = data.response || `Let me explain this more clearly. ${currentNEET2Question?.explanation}`;
          
          enhancedExplanation = enhancedExplanation
            .replace(/\*\*/g, '')
            .replace(/#/g, '')
            .replace(/```/g, '')
            .replace(/`/g, '')
            .trim();

          const processedEnhanced = preprocessTextForTTS(enhancedExplanation);

          setWhiteboardContent(prev => [
            ...prev,
            ``,
            `Enhanced Explanation:`,
            enhancedExplanation
          ]);
          
          setExplanationText(enhancedExplanation);
          setHighlightedText(enhancedExplanation);
          
          if (data.audio) {
            playAudioFromBase64(data.audio);
          } else {
            setCurrentSpeech(processedEnhanced);
          }
        })
        .catch(error => {
          console.error('Error getting enhanced explanation:', error);
          handleNEET2ExplanationRequest(currentNEET2Question!);
        });
      }, 1500);
    }
  };

  // FIXED: Speech End Handler for NEET MCQ flow
  const handleSpeechEnd = () => {
    // Show clarity popup for explanations only after TTS speech ends
    if (!isAudioPlaying && explanationText && !showClarityPopup && !waitingForClarityResponse && shouldShowClarityPopup) {
      setShowClarityPopup(true);
      setWaitingForClarityResponse(true);
    }

    // FIXED: MCQ functionality for NEET MCQ - Only show Continue Learning after last question
    if (isLessonActive && !hasShownMCQ && !showMCQ && course.category === 'NEET MCQ') {
      setTimeout(() => {
        const questions = generateMCQForSubject(course.category);
        setMCQQuestions(questions);
        setCurrentMCQIndex(0);
        setCurrentSpeech("Let's try these questions to test your understanding so far.");
        setShowMCQ(true);
        setHasShownMCQ(true);
      }, 2000);
    } else if (waitingForSpeech && !isFeedbackGiven) {
      setIsFeedbackGiven(true);
      setWaitingForSpeech(false);
      setCurrentSpeech('');

      // FIXED: Only set quiz complete for non-NEET MCQ subjects after first question
      // For NEET MCQ, quiz completion is handled in handleNextMCQQuestion
      if (course.category !== 'NEET MCQ') {
        setIsQuizComplete(true);
        setMCqAnswered(true);
      }
    }
  };

  // FIXED: MCQ Answer Handler for NEET MCQ - Don't set quiz complete here
  const handleMCQAnswer = (selectedAnswer: string, isCorrect: boolean) => {
    if (course.category === 'NEET MCQ') {
      const currentQuestion = mcqQuestions[currentMCQIndex];

      if (selectedAnswer === '') {
        setCurrentSpeech(`You haven't answered the question. The correct answer is ${currentQuestion.correctAnswer}. ${currentQuestion.explanation}`);
      } else if (isCorrect) {
        setCurrentSpeech("Excellent, that's the correct answer!");
      } else {
        setCurrentSpeech(`Not quite right. The correct answer is ${currentQuestion.correctAnswer}. ${currentQuestion.explanation}`);
      }

      setIsFeedbackGiven(false);
      setWaitingForSpeech(true);
      setMCqAnswered(true);
      
      // FIXED: Don't set isQuizComplete here for NEET MCQ - it will be set in handleNextMCQQuestion
    } else {
      setTimeout(() => {
        if (isCorrect) {
          setCurrentSpeech("Excellent! That's the correct answer. Well done! You're showing great understanding. Let's continue with our lesson.");
        } else {
          const correctAnswer = mcqQuestions[currentMCQIndex]?.correctAnswer || '';
          const explanation = mcqQuestions[currentMCQIndex]?.explanation || '';
          setCurrentSpeech(`That's not quite right. The correct answer is ${correctAnswer}. ${explanation} Let's continue with our lesson.`);
        }
        setMCqAnswered(true);
        setIsQuizComplete(true);
      }, 500);
    }
  };

  // FIXED: Next MCQ Question Handler - Only set quiz complete after last question for NEET MCQ
  const handleNextMCQQuestion = () => {
    if (currentMCQIndex < mcqQuestions.length - 1) {
      setCurrentMCQIndex(prev => prev + 1);
      setMCqAnswered(false);
      setIsFeedbackGiven(false);
      setCurrentSpeech('');
    } else {
      // FIXED: Only set quiz complete when it's the last question for NEET MCQ
      setIsQuizComplete(true);
    }
  };

  const handleMCQClose = () => {
    setShowMCQ(false);
    setIsFeedbackGiven(false);
    setCurrentSpeech('');
  };

  const getSubjectIntroduction = (category: string, lessonTitle: string) => {
    const subjectIntroductions: Record<string, string> = {
      'Mathematics': `Welcome to today's mathematics lesson. I'm Professor Diya, your AI mathematics instructor.`,
      'Science': `Welcome to today's science lesson. I'm Professor Diya, your AI science instructor.`,
      'Hindi': `नमस्ते! आज के हिंदी पाठ "${lessonTitle}" में आपका स्वागत है।`,
      'English': `Welcome to today's English lesson. I'm Professor Diya, your AI English instructor.`,
      'Physics': `Welcome to today's physics lesson. I'm Professor Diya, your AI physics instructor.`,
      'Chemistry': `Welcome to today's chemistry lesson. I'm Professor Diya, your AI chemistry instructor.`,
      'Biology': `Welcome to today's biology lesson. I'm Professor Diya, your AI biology instructor.`,
      'Social Science': `Welcome to today's social science lesson. I'm Professor Diya, your AI social science instructor.`,
      'NEET MCQ': `Welcome to today's NEET preparation session. I'm Professor Diya, your AI mentor. We will connect core ideas from Physics, Chemistry, and Biology, focus on problem-solving strategies, and build exam-ready confidence.`,
      'NEET MCQ 2.O': `Welcome to NEET MCQ section. Let's practice some questions.`,
      'NEET Physics': `Welcome to ${lessonTitle}. I'm Professor Diya, your AI physics mentor for NEET preparation. Let's build a strong foundation in physics concepts.`,
      'NEET Chemistry': `Welcome to ${lessonTitle}. I'm Professor Diya, your AI chemistry mentor for NEET preparation. Let's master the chemical concepts together.`,
      'NEET Biology': `Welcome to ${lessonTitle}. I'm Professor Diya, your AI biology mentor for NEET preparation. Let's explore the fascinating world of living organisms.`
    };

    return subjectIntroductions[category] || subjectIntroductions['Mathematics'];
  };

  const lessonSegments = [
    {
      title: "Introduction",
      content: lectureContent || getSubjectIntroduction(course.category, lesson.title),
      duration: 30,
    },
    {
      title: "Core Concepts",
      content: "Let's dive into the fundamental concepts.",
      duration: 45,
    },
    {
      title: "Practical Examples",
      content: "Now I'll show you real-world applications.",
      duration: 40,
    },
    {
      title: "Advanced Applications",
      content: "Let's explore more sophisticated applications.",
      duration: 35,
    },
    {
      title: "Summary",
      content: "Let's review what we've learned today.",
      duration: 25,
    }
  ];

  const currentLessonSegment = lessonSegments[currentSegment];

  // Initialize the classroom when it opens
  useEffect(() => {
    if (isOpen) {
      // Reset introduction state when classroom opens
      setHasGeneratedIntroduction(false);
      setLectureContent('');
      setKeyPoints([]);
      setCurrentKeyPointIndex(0);
      setSummary('');
      
      // Set initial whiteboard content based on course type
      if (course.category === 'NEET MCQ 2.O') {
        setWhiteboardContent([
          `${course.title} - ${lesson.title}`,
          "NEET MCQ 2.O MCQs - Question 1",
          "Key Learning Objectives:",
          "• Understand fundamental principles",
          "• Apply concepts to real scenarios",
          "• Develop critical thinking skills"
        ]);
      } else if (course.category === 'NEET MCQ') {
        // For regular NEET MCQ - MCQ based (EXACTLY LIKE OLD VERSION)
        setWhiteboardContent([
          `${course.title} - ${lesson.title}`,
          "Key Learning Objectives:",
          "• Understand fundamental principles",
          "• Apply concepts to real scenarios",
          "• Develop critical thinking skills"
        ]);
      } else {
        // For NEET Physics, Chemistry, Biology - dynamic lecture with sections
        setWhiteboardContent([
          `${course.title} - ${lesson.title}`,
          "Loading chapter lecture...",
          "",
          "Please wait while we prepare your personalized lesson with:",
          "• Key Points (appearing in real-time)",
          "• Class Lecture", 
          "• Summary"
        ]);
      }
    }
  }, [isOpen, course, lesson]);

  // Generate dynamic lecture when lesson becomes active (only for specific subjects)
  useEffect(() => {
    if (isLessonActive && !hasGeneratedIntroduction && 
        (course.category === 'NEET Physics' || course.category === 'NEET Chemistry' || course.category === 'NEET Biology')) {
      generateChapterLecture();
    }
  }, [isLessonActive, hasGeneratedIntroduction, course.category]);

  const handleStartLesson = () => {
    setIsLessonActive(true);
    setLessonProgress(5);

    if (course.category === 'NEET MCQ 2.O') {
      setCurrentNEET2QuestionIndex(0);
      setCurrentNEET2Question(neet2Questions[0]);
      setShowNEET2MCQ(true);
      setCurrentSpeech("Welcome to NEET MCQ 2.O MCQs! Let's test your knowledge with some challenging questions.");
    } else if (course.category === 'NEET MCQ') {
      // For regular NEET MCQ
      setCurrentSpeech(getSubjectIntroduction(course.category, lesson.title));
      setWhiteboardContent([
        `${course.title} - ${lesson.title}`,
        "Key Learning Objectives:",
        "• Understand fundamental principles",
        "• Apply concepts to real scenarios",
        "• Develop critical thinking skills"
      ]);
    } else {
      // For NEET Physics, Chemistry, Biology - show loading message while generating lecture
      setCurrentSpeech("Hi, We are preparing your personalized NEET lecture");
    }
  };

  const handlePauseLesson = () => {
    setIsLessonActive(false);
    setCurrentSpeech('');
    
    // Stop all media when paused
    stopAllMedia();
  };

  const handleQuestionAsked = (response: string) => {
    setCurrentSpeech(response);
  };

  const handleAskDoubt = () => {
    if (avatarRef.current) {
      avatarRef.current.startRecording();
      setIsRecording(true);
      
      setTimeout(() => {
        setIsRecording(false);
      }, 5000);
    }
  };

  // Handle classroom close - stop all media
  const handleClose = () => {
    stopAllMedia();
    
    // Reset all states
    setIsLessonActive(false);
    setCurrentSpeech('');
    setHasGeneratedIntroduction(false);
    setLectureContent('');
    setKeyPoints([]);
    setCurrentKeyPointIndex(0);
    
    // Call original onClose
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col overflow-hidden">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900 text-white p-4 flex items-center justify-between flex-shrink-0 z-10">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div className="max-w-[30%]">
            <h1 className="text-xl font-bold truncate">{course.title}</h1>
            <p className="text-purple-200 text-sm truncate">{lesson.title}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Panel Toggle Buttons */}
          {course.category === 'NEET MCQ 2.O' && (
            <button
              onClick={() => setIsNEET2MCQVisible(!isNEET2MCQVisible)}
              className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
              title={isNEET2MCQVisible ? 'Hide MCQ Panel' : 'Show MCQ Panel'}
            >
              <PanelLeft className="w-5 h-5" />
            </button>
          )}
          
          <button
            onClick={() => setIsWhiteboardVisible(!isWhiteboardVisible)}
            className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            title={isWhiteboardVisible ? 'Hide Whiteboard' : 'Show Whiteboard'}
          >
            <PanelRight className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center space-x-2 text-sm">
            <Users className="w-4 h-4" />
            <span>1,247 students</span>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-sm">
            <Clock className="w-4 h-4" />
            <span>{lesson.duration}</span>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-300 transition-colors p-2"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Classroom Interface - Responsive layout */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-y-auto">
        {/* Left: Avatar + Controls */}
        <div className={`${isNEET2MCQVisible && isWhiteboardVisible ? 'flex-1' : isNEET2MCQVisible || isWhiteboardVisible ? 'flex-1 lg:flex-2' : 'flex-1'} bg-gradient-to-br from-slate-800 via-purple-900 to-indigo-900 relative overflow-hidden min-h-[60vh] lg:min-h-0`}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-500 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 lg:p-8 pt-16 lg:pt-8">
            <RealisticAvatar
              ref={avatarRef}
              gender={avatarGender}
              isTeaching={isLessonActive}
              currentSpeech={currentSpeech}
              emotion={isLessonActive ? 'teaching' : 'friendly'}
              soundEnabled={soundEnabled}
              onQuestionAsked={handleQuestionAsked}
              onSpeechEnd={handleSpeechEnd}
              onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
            />

            {isGeneratingLecture && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Generating personalized lecture...</span>
                </div>
              </div>
            )}

            {lessonProgress > 0 && (
              <div className="absolute bottom-28 lg:bottom-32 left-1/2 transform -translate-x-1/2 w-full max-w-xs px-4">
                <div className="bg-black bg-opacity-50 backdrop-blur-lg rounded-2xl p-4 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Lesson Progress</span>
                    <span className="text-sm">{Math.round(lessonProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                    <div
                      className="h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-1000"
                      style={{ width: `${lessonProgress}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-purple-200 truncate">{lessonSegments[currentSegment]?.title}</p>
                    <p className="text-xs text-purple-300 mt-1">
                      Segment {currentSegment + 1} of {lessonSegments.length}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="absolute bottom-4 lg:bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="bg-black bg-opacity-50 backdrop-blur-lg rounded-2xl px-3 py-2 flex items-center justify-center space-x-2 lg:space-x-3">
                <button
                  onClick={isLessonActive ? handlePauseLesson : handleStartLesson}
                  className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                  title={isLessonActive ? 'Pause Lesson' : 'Start Lesson'}
                >
                  {isLessonActive ? <Pause className="w-5 h-5 lg:w-6 lg:h-6" /> : <Play className="w-5 h-5 lg:w-6 lg:h-6" />}
                </button>

                <button
                  onClick={handleAskDoubt}
                  className={`h-10 lg:h-12 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform px-4 ${
                    isRecording 
                      ? 'bg-gradient-to-r from-red-600 to-red-700 animate-pulse' 
                      : 'bg-gradient-to-r from-red-500 to-red-600'
                  }`}
                  title="Ask Doubt"
                >
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="w-5 h-5 lg:w-6 lg:h-6" />
                    <span className="text-sm font-medium hidden lg:inline">
                      {isRecording ? 'Recording...' : 'Ask Doubt'}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="w-10 h-10 lg:w-12 lg:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-colors"
                  title={soundEnabled ? 'Mute Sound' : 'Unmute Sound'}
                >
                  {soundEnabled ? <Volume2 className="w-5 h-5 lg:w-6 lg:h-6" /> : <VolumeX className="w-5 h-5 lg:w-6 lg:h-6" />}
                </button>

                <button
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-white transition-colors ${
                    isChatOpen ? 'bg-green-500' : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                  }`}
                  title="Open Chat"
                >
                  <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>

                <button
                  onClick={() => setAvatarGender(avatarGender === 'male' ? 'female' : 'male')}
                  className="w-10 h-10 lg:w-12 lg:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-colors"
                  title={`Switch to ${avatarGender === 'male' ? 'female' : 'male'} avatar`}
                >
                  <Settings className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>
          </div>

          {isChatOpen && (
            <div className="absolute top-16 lg:top-4 left-4 right-4 lg:left-4 lg:right-auto lg:w-80 h-96 z-20">
              <RealTimeChat
                onQuestionAsked={handleQuestionAsked}
                onClose={() => setIsChatOpen(false)}
              />
            </div>
          )}
        </div>

        {/* Middle: NEET MCQ 2.O MCQ Box */}
        {course.category === 'NEET MCQ 2.O' && showNEET2MCQ && currentNEET2Question && isNEET2MCQVisible && (
          <div ref={mcqBoxRef} className="w-full lg:w-96 bg-white border-l border-gray-200 flex flex-col shadow-xl order-2 lg:order-none">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex items-center justify-between flex-shrink-0">
              <h2 className="font-bold">NEET MCQ 2.O MCQs</h2>
              <div className="flex items-center space-x-2">
                <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  {currentNEET2QuestionIndex + 1} / {neet2Questions.length}
                </div>
                {isLessonActive && (
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <NEET2MCQBox
                key={currentNEET2QuestionIndex}
                question={currentNEET2Question}
                currentQuestionIndex={currentNEET2QuestionIndex}
                totalQuestions={neet2Questions.length}
                onAnswerSelect={handleNEET2Answer}
                onExplanationRequest={handleNEET2ExplanationRequest}
                onNextQuestion={handleNEET2NextQuestion}
                onTryAgain={handleTryAgain}
                explanationText={explanationText}
                isExplaining={isExplaining}
                showClarityPopup={showClarityPopup}
                onClarityResponse={handleClarityResponse}
                userAnswer={userAnswer}
                isCorrect={isCorrect}
                isAudioPlaying={isAudioPlaying}
                highlightedText={highlightedText}
              />
            </div>
          </div>
        )}

        {/* Right: Whiteboard */}
        {isWhiteboardVisible && (
          <div className="w-full lg:w-96 bg-white border-l border-gray-200 flex flex-col shadow-xl order-3 lg:order-none">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex items-center justify-between flex-shrink-0">
              <h2 className="font-bold">Smart Whiteboard</h2>
              <div className="flex items-center space-x-2">
                {isLessonActive && (
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                )}
                <button className="text-white hover:text-gray-200">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>

            <DynamicWhiteboard
              content={whiteboardContent}
              lessonTitle={lesson.title}
              currentSegment={lessonSegments[currentSegment]?.title || ''}
              isActive={isLessonActive}
              explanation={course.category === 'NEET MCQ 2.O' ? explanationText : ''}
              isExplaining={course.category === 'NEET MCQ 2.O' ? isExplaining : false}
              isAudioPlaying={isAudioPlaying}
              highlightedText={highlightedText}
              hasSections={course.category === 'NEET Physics' || course.category === 'NEET Chemistry' || course.category === 'NEET Biology'}
              currentKeyPointIndex={currentKeyPointIndex}
              totalKeyPoints={keyPoints.length}
            />
          </div>
        )}
      </div>

      {/* Voice Assistant Component */}
      <VoiceAssistant
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        courseCategory={normalizeCategory(course.category)}
        onQuestionAsked={handleQuestionAsked}
      />

      {/* FIXED: MCQ Popup for NEET MCQ subject - Now properly shows next questions */}
      {course.category === 'NEET MCQ' && (
        <MCQPopup
          isOpen={showMCQ}
          question={mcqQuestions[currentMCQIndex]}
          onAnswerSubmit={handleMCQAnswer}
          onClose={handleMCQClose}
          onNextQuestion={handleNextMCQQuestion}
          onContinueLearning={() => {
            setIsLessonActive(true);
            setTimeout(() => {
              setCurrentSpeech("How were the questions? If you have any doubts, double click the 'Ask Doubt' button. I'm here to help and answer all your questions.");
            }, 100);
          }}
          subject={course.category}
          currentQuestionIndex={currentMCQIndex}
          totalQuestions={mcqQuestions.length}
          isAnswered={mcqAnswered}
          isQuizComplete={isQuizComplete}
        />
      )}
    </div>
  );
};