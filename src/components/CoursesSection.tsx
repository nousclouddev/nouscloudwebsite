
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Users } from "lucide-react";

const CoursesSection = () => {
  const courses = [
    {
      title: "Agentic AI Fundamentals",
      difficulty: "Beginner",
      duration: "6 weeks",
      students: "2,450",
      topics: ["AI Agents", "Prompt Engineering", "CrewAI", "LangGraph"],
      description: "Master the foundations of autonomous AI systems and agent-based workflows."
    },
    {
      title: "Enterprise GenAI Implementation",
      difficulty: "Intermediate",
      duration: "8 weeks",
      students: "1,820",
      topics: ["RAG Systems", "Vector Databases", "Security", "Governance"],
      description: "Learn to deploy GenAI solutions securely in enterprise environments."
    },
    {
      title: "Advanced MLOps & AIOps",
      difficulty: "Advanced",
      duration: "10 weeks",
      students: "950",
      topics: ["Model Deployment", "Monitoring", "CI/CD", "Infrastructure"],
      description: "Build production-ready ML pipelines with automated operations."
    },
    {
      title: "Cloud FinOps Mastery",
      difficulty: "Intermediate",
      duration: "6 weeks",
      students: "1,340",
      topics: ["Cost Optimization", "Forecasting", "Dashboards", "Multi-cloud"],
      description: "Optimize cloud spending and build comprehensive cost management systems."
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary-foreground font-inter mb-4">
            Professional Courses
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Accelerate your AI and engineering expertise with hands-on training
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-gray-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={`text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                    {course.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    {course.students}
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    Course
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-relaxed">
                  {course.description}
                </CardDescription>
                <div className="flex flex-wrap gap-1">
                  {course.topics.map((topic, topicIndex) => (
                    <Badge key={topicIndex} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                  Enroll Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
