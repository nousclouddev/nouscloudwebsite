import { useState } from "react";
import { CalendarIcon, Clock, Tag, Info } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Course } from "@/types/course";
import CourseRegistrationForm from "./CourseRegistrationForm";

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
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
        <div className="ml-auto flex gap-2">
          {course.details && course.details.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDetailsOpen(true)}
              className="text-xs"
            >
              <Info size={14} className="mr-1" />
              Details
            </Button>
          )}
          <Button
            variant="link"
            className="p-0 text-primary"
            onClick={() => setOpen(true)}
          >
            Register Now
          </Button>
        </div>

        <CourseRegistrationForm
          isOpen={open}
          onClose={() => setOpen(false)}
          course={course}
        />

        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold mb-4">
                {course.course_name} - Course Details
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {course.details && course.details.length > 0 ? (
                <ol className="space-y-3 list-decimal list-inside">
                  {course.details.map((detail, index) => (
                    <li key={index} className="text-sm leading-relaxed text-gray-700">
                      {detail}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-gray-500">No detailed information available for this course.</p>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
