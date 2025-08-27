import React, { useEffect, useState, useCallback } from "react";
import { api } from "../utils/api";
import { Clock, BookOpen, Users, Star } from "lucide-react";
import { Course } from "../types";

interface RawCourse {
  id: string;
  name: string;
  image: string;
  chapters: number;
  duration: number;
}

interface CourseCardProps {
  onCourseClick: (course: Course) => void;
  searchQuery?: string;
}

const getSubjectColor = (subject: string) => {
  const colors: Record<string, string> = {
    Mathematics: "bg-purple-500",
    Science: "bg-green-500",
    English: "bg-blue-500",
    Hindi: "bg-yellow-500",
    "Social Science": "bg-red-500",
    "Computer Applications": "bg-indigo-500",
  };
  return colors[subject] || "bg-gray-500";
};

const CourseCard: React.FC<CourseCardProps> = ({
  onCourseClick,
  searchQuery = "",
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const transformCourse = useCallback(
    (raw: RawCourse, index: number): Course => ({
      id: raw.id,
      title: raw.name,
      description: `${raw.name} includes ${raw.chapters} chapters.`,
      image: raw.image,
      category: raw.name,
      duration: `${raw.duration} mins`,
      lessons: Array.from({ length: raw.chapters }, (_, i) => ({
        title: `Lesson ${i + 1}`,
      })),
      level:
        index % 3 === 0
          ? "Beginner"
          : index % 3 === 1
          ? "Intermediate"
          : "Advanced",
      progress: Math.floor(Math.random() * 100),
      color: getSubjectColor(raw.name),
      chapters: Array.from({ length: raw.chapters }, (_, i) => ({
        title: `Chapter ${i + 1}`,
      })),
      instructor: "AI Tutor",
      rating: 4.5 + Math.random() * 0.5,
      students: Math.floor(Math.random() * 10000),
      tags: [raw.name, "NCERT", "Class 10"],
      notesCount: Math.floor(Math.random() * 10),
    }),
    []
  );

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<RawCourse[]>("/course/courses");
      const transformed = response.data.map(transformCourse);
      
      // Filter out Hindi courses
      const filtered = transformed.filter(course => course.category !== "Hindi");
      
      setCourses(filtered);
      setFilteredCourses(filtered);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  }, [transformCourse]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = courses.filter((course) => {
        return (
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.category.toLowerCase().includes(query) ||
          course.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      });
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
  }, [searchQuery, courses]);

  if (loading) {
    return (
      <div className="text-center py-12 col-span-full text-gray-500">
        <p>Loading courses...</p>
      </div>
    );
  }

  if (filteredCourses.length === 0 && searchQuery) {
    return (
      <div className="text-center py-12 col-span-full">
        <div className="text-gray-400 mb-4">
          <BookOpen className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-xl font-medium text-gray-600 mb-2">
          No courses found
        </h3>
        <p className="text-gray-500 mb-4">
          We couldn't find any courses matching "{searchQuery}"
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredCourses.map((course) => (
        <div
          key={course.id}
          onClick={() => onCourseClick(course)}
          className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
        >
          <div className="relative h-48 overflow-hidden">
            {/* <img
              src={course.image || "/fallback.jpg"}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            /> */}
            <div
              className={`absolute inset-0 ${course.color} opacity-10`}
            ></div>

            <div className="absolute top-4 right-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                  course.level === "Beginner"
                    ? "bg-green-500"
                    : course.level === "Intermediate"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              >
                {course.level}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-20 p-4">
              <div className="flex items-center justify-between text-white text-sm mb-2">
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>
              <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                <div
                  className="h-2 bg-white rounded-full transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                {course.category}
              </span>
              <div className="flex items-center text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm text-gray-600 ml-1">
                  {course.rating?.toFixed(1)}
                </span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
              {course.title}
            </h3>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {course.description}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  <span>{course.lessons.length} lessons</span>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{course.students?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseCard;
