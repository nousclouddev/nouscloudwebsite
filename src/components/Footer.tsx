
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-secondary-foreground text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold font-inter">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                NousCloud
              </span>
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Transforming enterprises with next-generation AI and engineering solutions.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                <span className="text-sm font-bold">Li</span>
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                <span className="text-sm font-bold">X</span>
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                <span className="text-sm font-bold">GH</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Agentic AI</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GenAI Tools</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cloud FinOps</a></li>
              <li><a href="#" className="hover:text-white transition-colors">DevSecOps</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Consulting</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Training</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Implementation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <Separator className="bg-white/20 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2024 NousCloud. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
