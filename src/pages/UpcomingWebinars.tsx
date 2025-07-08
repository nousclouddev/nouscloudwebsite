import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebaseconfig";
import { Webinar, WebinarFormData } from "@/types/webinar";
import WebinarCard from "@/components/webinars/WebinarCard";
import WebinarEnrollmentForm from "@/components/webinars/WebinarEnrollmentForm";
import { toast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { webinarImages } from "@/lib/images";

// Sample data - replace with actual data from your backend
const sampleWebinars: Webinar[] = [
  {
    id: "1",
    title: "Introduction to AI Development",
    description: "Learn the fundamentals of AI development and get started with building your first AI-powered application.",
    imageUrl: webinarImages["ai-dev"],
    dateTime: "2025-07-15T10:00:00Z",
    duration: "1.5 hours"
  },
  {
    id: "2",
    title: "Cloud Computing Essentials",
    description: "Discover the core concepts of cloud computing and how to leverage cloud services for your projects.",
    imageUrl: webinarImages["cloud"],
    dateTime: "2025-07-20T15:00:00Z",
    duration: "2 hours"
  },
  {
    id: "3",
    title: "Data Science for Beginners",
    description: "Get started with data science and learn how to analyze data using Python and popular data science libraries.",
    imageUrl: webinarImages["data-science"],
    dateTime: "2025-07-25T13:00:00Z",
    duration: "1.5 hours"
  },
];

const UpcomingWebinars = () => {
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleEnroll = (webinarId: string) => {
    const webinar = sampleWebinars.find(w => w.id === webinarId);
    if (webinar) {
      setSelectedWebinar(webinar);
      setIsFormOpen(true);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedWebinar(null);
  };

  const handleFormSubmit = async (formData: WebinarFormData) => {
    if (!selectedWebinar) return;

    try {
      const enrollment = {
        ...formData,
        webinarId: selectedWebinar.id,
        timestamp: new Date(),
      };

      await addDoc(collection(db, "webinar-enrollments"), enrollment);

      toast({
        title: "Successfully enrolled!",
        description: "You've been enrolled in the webinar. Check your email for confirmation.",
      });

      handleFormClose();
    } catch (error) {
      console.error("Error submitting enrollment:", error);
      toast({
        title: "Error",
        description: "There was a problem enrolling in the webinar. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />
      <main className="py-24">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Upcoming Webinars
            </span>
          </h1>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            Join our expert-led webinars to stay ahead in the rapidly evolving tech landscape
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleWebinars.map((webinar) => (
              <WebinarCard
                key={webinar.id}
                webinar={webinar}
                onEnroll={handleEnroll}
              />
            ))}
          </div>

          {selectedWebinar && (
            <WebinarEnrollmentForm
              isOpen={isFormOpen}
              onClose={handleFormClose}
              onSubmit={handleFormSubmit}
              webinarTitle={selectedWebinar.title}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UpcomingWebinars;
