
import { Brain, Zap, Shield } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary-foreground font-inter mb-4">
            About Us
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Bridging the gap between cutting-edge AI research and practical enterprise implementation
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-secondary-foreground font-inter">
              Enabling Enterprise AI Adoption
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              NousCloud bridges the gap between cutting-edge AI research and practical enterprise implementation. We specialize in agentic AI systems that transform how organizations operate, scale, and innovate.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our mission is to democratize AI adoption by providing comprehensive solutions that integrate seamlessly with existing enterprise infrastructure while maintaining the highest standards of security and governance.
            </p>
            <div className="flex gap-4 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm font-medium">Enterprise-Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm font-medium">Secure by Design</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm font-medium">Scalable Solutions</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-secondary/50 p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300">
              <Brain className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Intelligent Automation</h3>
              <p className="text-muted-foreground">Advanced AI agents that understand context and make autonomous decisions.</p>
            </div>
            <div className="bg-secondary/50 p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300">
              <Zap className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Rapid Implementation</h3>
              <p className="text-muted-foreground">From proof-of-concept to production in weeks, not months.</p>
            </div>
            <div className="bg-secondary/50 p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300">
              <Shield className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
              <p className="text-muted-foreground">Built-in governance, compliance, and security frameworks.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
