import { useState } from "react";
import { CalendarIcon, Clock, Tag } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";
import CourseRegistrationForm from "./CourseRegistrationForm";

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const [open, setOpen] = useState(false);
  const isFree = !course.price || Number(course.price) === 0;

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
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
      <CardFooter className="pt-0 flex items-center gap-2">
        <div className="flex items-center gap-1 text-sm font-medium">
          <Tag size={16} />
          {isFree ? (
            <span className="text-green-600 font-semibold">Free</span>
          ) : (
            <>₹{course.price}</>
          )}
        </div>
        <Button
          variant="link"
          className="ml-auto p-0 text-primary"
          onClick={() => setOpen(true)}
        >
          Register
        </Button>
        <CourseRegistrationForm
          isOpen={open}
          onClose={() => setOpen(false)}
          course={course}
        />
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
