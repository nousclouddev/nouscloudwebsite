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
  return rawCourses.map((c: any, index: number) => ({
    ...c,
    key_areas: Array.isArray(c.key_areas)
      ? c.key_areas
      : typeof c.key_areas === "string"
        ? c.key_areas.split(/[,#]/).map((s: string) => s.trim()).filter(Boolean)
        : [],
    details: Array.isArray(c.details) ? c.details : 
      // Temporary mock data for testing - remove when API provides details
      index === 0 ? [
        "Learn the fundamentals of autonomous agents and their decision-making processes",
        "Understand how AI agents interact with complex environments",
        "Explore real-world applications in robotics, gaming, and automation",
        "Hands-on exercises with popular AI frameworks and tools",
        "Build your first intelligent agent from scratch",
        "Learn about multi-agent systems and coordination",
        "Understand reinforcement learning principles",
        "Explore ethical considerations in autonomous AI systems",
        "Get insights into industry best practices and career opportunities",
        "Access to exclusive resources and community support"
      ] : index === 1 ? [
        "Introduction to cloud service models (IaaS, PaaS, SaaS)",
        "Understanding major cloud providers (AWS, Azure, Google Cloud)",
        "Learn about cloud security and compliance frameworks",
        "Hands-on experience with cloud deployment strategies",
        "Cost optimization techniques for cloud infrastructure",
        "Monitoring and logging in cloud environments",
        "Disaster recovery and backup strategies",
        "Containerization and orchestration with Docker and Kubernetes"
      ] : [],
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
