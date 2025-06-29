import { Button } from "@/components/ui/button";
import backgroundImage from "@/assets/background2.png"; // Adjust path based on your structure

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden pt-16">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gray-900/80 z-0"></div>
      
      {/* Visible background image - now using imported image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage}
          alt="Technology background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Rest of your component remains the same */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="20%" y1="30%" x2="40%" y2="25%" stroke="rgba(96, 165, 250, 0.6)" strokeWidth="1.5" />
          <line x1="60%" y1="35%" x2="80%" y2="30%" stroke="rgba(96, 165, 250, 0.6)" strokeWidth="1.5" />
          <line x1="30%" y1="60%" x2="50%" y2="55%" stroke="rgba(96, 165, 250, 0.6)" strokeWidth="1.5" />
          <line x1="70%" y1="65%" x2="90%" y2="60%" stroke="rgba(96, 165, 250, 0.6)" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold font-inter mb-6 leading-tight">
            From Prompt to Pipeline
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Transforming Enterprises with Agentic AI
          </p>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-lg font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            Get Started
          </Button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent z-0"></div>
    </section>
  );
};

export default HeroSection;