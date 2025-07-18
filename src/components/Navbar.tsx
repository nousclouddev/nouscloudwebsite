import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Solutions", href: "#solutions" },
    { name: "Consulting", href: "#consulting" },
    { name: "Upcoming Courses", href: "#upcoming-courses" },
    { name: "Contact", href: "#contact" },
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold font-inter">
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                NousCloud
              </span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.isPage ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-700 hover:text-primary font-medium transition-colors duration-200 relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ) : (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-gray-700 hover:text-primary font-medium transition-colors duration-200 relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </button>
              )
            ))}
            <a
              href="https://agent.nouscloud.tech/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-2 rounded shadow-md hover:from-blue-600 hover:to-cyan-500 transition-colors duration-200"
              style={{letterSpacing: '0.03em'}}
            >
              Agent Hub
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                link.isPage ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block px-3 py-2 text-gray-700 hover:text-primary font-medium transition-colors duration-200 w-full text-left"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <button
                    key={link.name}
                    onClick={() => scrollToSection(link.href)}
                    className="block px-3 py-2 text-gray-700 hover:text-primary font-medium transition-colors duration-200 w-full text-left"
                  >
                    {link.name}
                  </button>
                )
              ))}
              <div className="px-3 py-2">
                <a
                  href="https://agent.nouscloud.tech/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-bold bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-2 rounded shadow-md text-center hover:from-blue-600 hover:to-cyan-500 transition-colors duration-200"
                  style={{letterSpacing: '0.03em'}}
                >
                  Agent Hub
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
