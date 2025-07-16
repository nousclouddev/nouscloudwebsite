import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/courses/CourseCard";
import { Course } from "@/types/course";

const fetchCourses = async (): Promise<Course[]> => {
  const res = await fetch(
    "https://033t07qttc.execute-api.ap-south-1.amazonaws.com/prod/public/courses/upcoming"
  );
  if (!res.ok) throw new Error("Failed fetching courses");
  const data = await res.json();
  // Some API versions wrap the courses array in a `courses` or `data` key.
  // Fallback to the raw response if neither wrapper exists.
  return data.courses ?? data.data ?? data;
};

const UpcomingCourses = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["upcoming-courses"],
    queryFn: fetchCourses,
  });

  const courses = Array.isArray(data) ? data.slice(0, 3) : [];

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />
      <main className="py-24">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Upcoming Courses
            </span>
          </h1>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            Explore our upcoming courses and reserve your spot today
          </p>
          {isLoading && <p className="text-center">Loading...</p>}
          {error && (
            <p className="text-center text-red-500">Error loading courses</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, idx) => (
              <CourseCard key={idx} course={course} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UpcomingCourses;
