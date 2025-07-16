
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SolutionsSection from "@/components/SolutionsSection";
import ConsultingSection from "@/components/ConsultingSection";
import UpcomingCoursesSection from "@/components/UpcomingCoursesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen font-inter">
      <Navbar />
      <HeroSection />
      <div id="about">
        <AboutSection />
      </div>
      <div id="solutions">
        <SolutionsSection />
      </div>
      <div id="consulting">
        <ConsultingSection />
      </div>
      <div id="upcoming-courses">
        <UpcomingCoursesSection />
      </div>
      <div id="contact">
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
