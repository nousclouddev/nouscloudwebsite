
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, User, Bot, Cloud, Database, Code, GitBranch, Lightbulb } from "lucide-react";

const SolutionsSection = () => {
  const teamSolutions = [
    {
      icon: Bot,
      title: "Agentic AI Workflows",
      description: "Autonomous agents that handle complex business processes end-to-end"
    },
    {
      icon: Lightbulb,
      title: "GenAI Tools Integration",
      description: "GPT-4, Claude, and Gemini integration for enhanced productivity"
    },
    {
      icon: Cloud,
      title: "Cloud FinOps Dashboards",
      description: "Real-time cost monitoring and optimization across cloud platforms"
    },
    {
      icon: GitBranch,
      title: "DevSecOps & MLOps",
      description: "Secure, automated pipelines for AI model deployment and management"
    }
  ];

  const individualSolutions = [
    {
      icon: Code,
      title: "DevOps & FinOps Training",
      description: "Hands-on training in modern infrastructure and cost management"
    },
    {
      icon: Database,
      title: "Practical GenAI",
      description: "RAG systems, embeddings, and advanced prompt engineering techniques"
    },
    {
      icon: Bot,
      title: "Agentic Systems",
      description: "Build with CrewAI, LangGraph, and other cutting-edge frameworks"
    },
    {
      icon: Building2,
      title: "Enterprise Integration",
      description: "Learn to integrate AI solutions into existing business systems"
    }
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary-foreground font-inter mb-4">
            Our Solutions in Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Solving complex enterprise problems with agentic AI
          </p>
        </div>

        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="teams" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              For Teams & Companies
            </TabsTrigger>
            <TabsTrigger value="individuals" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              For Individual Engineers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="teams">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamSolutions.map((solution, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-gray-200">
                  <CardHeader className="pb-4">
                    <solution.icon className="w-10 h-10 text-primary mb-2" />
                    <CardTitle className="text-lg">{solution.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {solution.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="individuals">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {individualSolutions.map((solution, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-gray-200">
                  <CardHeader className="pb-4">
                    <solution.icon className="w-10 h-10 text-primary mb-2" />
                    <CardTitle className="text-lg">{solution.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {solution.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default SolutionsSection;
