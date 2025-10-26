// ChapterSelection.tsx
import React from 'react';
import { ArrowLeft, BookOpen, GraduationCap } from 'lucide-react';

interface ChapterSelectionProps {
  subject: string;
  onBack: () => void;
  onChapterSelect: (chapter: string, className: string) => void;
}

const ChapterSelection: React.FC<ChapterSelectionProps> = ({ 
  subject, 
  onBack, 
  onChapterSelect 
}) => {
  // Chapter data for each subject
  const chapterData = {
    "NEET Physics": {
      "Class 11": [
        "Units and Measurements",
        "Mathematical Tools",
        "Motion in a Straight Line",
        "Motion in a Plane",
        "Newton's Laws of Motion",
        "Work, Energy & Power",
        "Centre of Mass & System of Particles",
        "Rotational Motion",
        "Gravitation",
        "Mechanical Properties of Solids",
        "Mechanical Properties of Fluids",
        "Thermal Properties of Matter",
        "Kinetic Theory of Gases",
        "Thermodynamics",
        "Oscillations",
        "Waves"
      ],
      "Class 12": [
        "Electric Charges and Fields",
        "Electrostatic Potential and Capacitance",
        "Current Electricity",
        "Moving Charges and Magnetism",
        "Magnetism and Matter",
        "Electromagnetic Induction",
        "Alternating Current",
        "Electromagnetic Waves",
        "Ray Optics and Optical Instruments",
        "Wave Optics",
        "Dual Nature of Radiation and Matter",
        "Atoms",
        "Nuclei",
        "Semiconductor Electronics: Materials, Devices and Simple Circuits"
      ]
    },
    "NEET Chemistry": {
      "Class 11": [
        "Some Basic Concepts of Chemistry",
        "Redox Reactions",
        "Structure of Atom",
        "Thermodynamics",
        "Equilibrium",
        "Organic Chemistry - Some Basic Principles and Techniques",
        "Hydrocarbons",
        "Classification of Elements and Periodicity in Properties",
        "Chemical Bonding and Molecular Structure",
        "Principles Related To Practical Organic Chemistry",
        "The p-Block Elements Part 1"
      ],
      "Class 12": [
        "Solutions",
        "Chemical Kinetics",
        "Electrochemistry",
        "Haloalkanes and Haloarenes",
        "Alcohols, Phenols and Ethers",
        "Aldehydes, Ketones and Carboxylic Acids",
        "Amines",
        "Biomolecules",
        "Coordination Compounds",
        "The d- and f- Block Elements",
        "The p-Block Elements Part 2"
      ]
    },
    "NEET Biology": {
      "Class 11": [
        "The Living World",
        "Biological Classification",
        "Plant Kingdom",
        "Animal Kingdom",
        "Morphology of Flowering Plants",
        "Anatomy of Flowering Plants",
        "Structural Organisation in Animals",
        "Cell: The Unit of Life",
        "Biomolecules",
        "Cell Cycle and Cell Division",
        "Transport in Plants",
        "Mineral Nutrition",
        "Photosynthesis in Higher Plants",
        "Respiration in Plants",
        "Plant Growth and Development",
        "Digestion and Absorption",
        "Breathing and Exchange of Gases",
        "Body Fluids and Circulation",
        "Excretory Products and Their Elimination",
        "Locomotion and Movement",
        "Neural Control and Coordination",
        "Chemical Coordination and Integration"
      ],
      "Class 12": [
        "Reproduction in Organisms",
        "Sexual Reproduction in Flowering Plants",
        "Human Reproduction",
        "Reproductive Health",
        "Principles of Inheritance and Variation",
        "Molecular Basis of Inheritance",
        "Evolution",
        "Human Health and Disease",
        "Strategies for Enhancement in Food Production",
        "Microbes in Human Welfare",
        "Biotechnology – Principles and Processes",
        "Biotechnology and Its Applications",
        "Organisms and Populations",
        "Ecosystem",
        "Biodiversity and Conservation",
        "Environmental Issues"
      ]
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      "NEET Physics": "bg-blue-600",
      "NEET Chemistry": "bg-green-600",
      "NEET Biology": "bg-red-600",
    };
    return colors[subject] || "bg-blue-600";
  };

  const getChapterIntroduction = (chapter: string, className: string, subject: string): string => {
    const baseIntro = `Welcome to ${chapter} in ${subject} ${className}. This chapter covers fundamental concepts that are essential for your NEET preparation. Let's dive into the key topics and build a strong foundation together.`;
    
    return baseIntro;
  };

  const currentChapters = chapterData[subject as keyof typeof chapterData];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Courses
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{subject}</h1>
              <p className="text-gray-600 mt-1">Select a class and chapter to begin learning</p>
            </div>
          </div>
          <div className={`w-12 h-12 ${getSubjectColor(subject)} rounded-lg flex items-center justify-center`}>
            <BookOpen className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Class Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Object.entries(currentChapters).map(([className, chapters]) => (
            <div key={className} className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Class Header */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-bold text-white">{className}</h2>
                </div>
                <p className="text-purple-200 mt-1">
                  {chapters.length} chapters • Complete syllabus for NEET preparation
                </p>
              </div>

              {/* Chapters List */}
              <div className="p-6">
                <div className="grid grid-cols-1 gap-3">
                  {chapters.map((chapter, index) => (
                    <button
                      key={index}
                      onClick={() => onChapterSelect(chapter, className)}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm">{chapter}</h3>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {getChapterIntroduction(chapter, className, subject).substring(0, 80)}...
                          </p>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <div className={`w-8 h-8 ${getSubjectColor(subject)} bg-opacity-10 rounded-full flex items-center justify-center`}>
                            <BookOpen className="w-4 h-4 text-purple-600" />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">About {subject}</h3>
          </div>
          <p className="text-gray-600">
            This course covers the complete NCERT syllabus for {subject.split(' ')[1]} as per NEET requirements. 
            Each chapter includes interactive lessons, practice questions, and detailed explanations to help you 
            master the concepts and excel in your NEET examination.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChapterSelection;