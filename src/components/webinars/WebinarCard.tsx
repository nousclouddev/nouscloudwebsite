import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Webinar } from "@/types/webinar";

interface WebinarCardProps {
  webinar: Webinar;
  onEnroll: (webinarId: string) => void;
}

const WebinarCard = ({ webinar, onEnroll }: WebinarCardProps) => {
  const date = new Date(webinar.dateTime);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="p-0">
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          <img
            src={webinar.imageUrl}
            alt={webinar.title}
            className="object-cover w-full h-full"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <h3 className="text-xl font-semibold mb-2">{webinar.title}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <CalendarIcon size={16} />
            <span>{format(date, "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{format(date, "h:mm a")} • {webinar.duration}</span>
          </div>
        </div>
        <p className="text-gray-600">{webinar.description}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button
          onClick={() => onEnroll(webinar.id)}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
        >
          Enroll Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WebinarCard;
