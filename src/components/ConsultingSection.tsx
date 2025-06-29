
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Shield, DollarSign } from "lucide-react";

const ConsultingSection = () => {
  const consultingServices = [
    {
      icon: Sparkles,
      title: "GenAI Practice",
      description: "Autonomous agent design, lifecycle management, and AI governance frameworks",
      features: [
        "Custom agent architecture",
        "AI governance & compliance",
        "Privacy-preserving AI systems",
        "Lifecycle management"
      ]
    },
    {
      icon: Shield,
      title: "DevSecOps Transformation",
      description: "Secure CI/CD pipelines with integrated MLOps and AIOps capabilities",
      features: [
        "CI/CD pipeline design",
        "Infrastructure as Code",
        "MLOps & AIOps integration",
        "Security automation"
      ]
    },
    {
      icon: DollarSign,
      title: "Cloud FinOps",
      description: "Cost optimization and budget forecasting with advanced analytics dashboards",
      features: [
        "Cost analysis & optimization",
        "Budget forecasting models",
        "Real-time dashboards",
        "Multi-cloud observability"
      ]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary-foreground font-inter mb-4">
            Consulting Track
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tailored Solutions for Real-World Challenges
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {consultingServices.map((service, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-gray-200 group">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConsultingSection;
