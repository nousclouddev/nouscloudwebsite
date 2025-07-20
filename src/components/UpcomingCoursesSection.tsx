import { useQuery } from "@tanstack/react-query";
import CourseCard from "@/components/courses/CourseCard";
import { Course } from "@/types/course";

const fetchCourses = async (): Promise<Course[]> => {
  const res = await fetch(
    "https://033t07qttc.execute-api.ap-south-1.amazonaws.com/prod/public/courses/upcoming"
  );
  if (!res.ok) throw new Error("Failed fetching courses");
  const data = await res.json();
  const rawCourses = data.courses ?? data.data ?? data;
  if (!Array.isArray(rawCourses)) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return rawCourses.map((c: any) => ({
    ...c,
    key_areas: Array.isArray(c.key_areas)
      ? c.key_areas
      : typeof c.key_areas === "string"
        ? c.key_areas.split(/[,#]/).map((s: string) => s.trim()).filter(Boolean)
        : [],
  }));
};

const UpcomingCoursesSection = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["upcoming-courses"],
    queryFn: fetchCourses,
  });

  const courses = Array.isArray(data) ? data : [];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Upcoming Courses
          </span>
        </h2>
        <p className="text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
          Explore our upcoming courses and reserve your spot today
        </p>
        {isLoading && <p className="text-center">Loading...</p>}
        {error && (
          <p className="text-center text-red-500">Error loading courses</p>
        )}
        {!isLoading && courses.length === 0 && !error && (
          <p className="text-center">No upcoming courses found.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, idx) => (
            <CourseCard key={idx} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingCoursesSection;
