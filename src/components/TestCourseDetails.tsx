import React from 'react';
import CourseCard from './courses/CourseCard';
import { Course } from '@/types/course';

// Test component to verify Details functionality
const TestCourseDetails = () => {
  const testCourse: Course = {
    course_name: "Test Course with Details",
    description: "This is a test course to verify the Details modal functionality",
    start_date: "2025-08-15",
    start_time: "10:00",
    duration: "2h 00m",
    price: "0",
    key_areas: ["Testing", "React", "TypeScript"],
    details: [
      "Learn how to implement modal dialogs in React",
      "Understand state management for UI components",
      "Practice with TypeScript interfaces and props",
      "Explore responsive design patterns",
      "Master component composition techniques",
      "Build accessible user interfaces",
      "Implement proper error handling",
      "Test component functionality thoroughly"
    ]
  };

  const testCourseWithoutDetails: Course = {
    course_name: "Test Course without Details",
    description: "This course has no details to test conditional rendering",
    start_date: "2025-08-16",
    start_time: "14:00",
    duration: "1h 30m",
    price: "50",
    key_areas: ["Basic", "Simple"]
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Course Details Functionality Test</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div>
          <h2 className="text-xl font-semibold mb-4">Course WITH Details</h2>
          <CourseCard course={testCourse} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Course WITHOUT Details</h2>
          <CourseCard course={testCourseWithoutDetails} />
        </div>
      </div>
    </div>
  );
};

export default TestCourseDetails;