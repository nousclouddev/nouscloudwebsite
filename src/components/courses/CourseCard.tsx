import { CalendarIcon, Clock, Tag } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <h3 className="text-xl font-semibold mb-2">{course.course_name}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
          <div className="flex items-center gap-1">
            <CalendarIcon size={16} />
            <span>{course.start_date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>
              {course.start_time} • {course.duration}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="flex flex-wrap gap-1 mb-4">
          {(course.key_areas || []).map((area, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {area}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex items-center gap-1 text-sm font-medium">
          <Tag size={16} />
          {course.price}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
