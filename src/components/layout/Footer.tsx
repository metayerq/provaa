
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Custom X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter signup logic would go here
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <footer className="bg-zinc-900 text-zinc-300 pt-8 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pb-6">
          {/* About Section */}
          <div>
            <h3 className="text-white font-semibold uppercase tracking-wider mb-3">About</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white transition-colors">
                  We're Hiring
                </Link>
              </li>
              <li>
                <Link to="/press" className="hover:text-white transition-colors">
                  Press Kit
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold uppercase tracking-wider mb-3">Support</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/help" className="hover:text-white transition-colors">Help Center</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/host-resources" className="hover:text-white transition-colors">
                  Host Resources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold uppercase tracking-wider mb-3">Categories</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/events?category=wine" className="hover:text-white transition-colors">
                  Wine Tastings
                </Link>
              </li>
              <li>
                <Link to="/events?category=chef" className="hover:text-white transition-colors">
                  Chef's Tables
                </Link>
              </li>
              <li>
                <Link to="/events?category=private" className="hover:text-white transition-colors">
                  Private Dinners
                </Link>
              </li>
              <li>
                <Link to="/events?category=artisan" className="hover:text-white transition-colors">
                  Artisan Workshops
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter and Social section */}
        <div className="border-t border-zinc-800 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-white text-lg font-semibold mb-3">STAY IN THE LOOP</h3>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-sm">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                required
              />
              <Button type="submit" size="sm" className="bg-white text-black hover:bg-gray-200">
                <Mail className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-zinc-500 mt-2">Get notified about new experiences</p>
          </div>

          <div className="text-right">
            <h3 className="text-white text-lg font-semibold mb-3">MEET THE MAKERS, TASTE THE PASSION</h3>
            <div className="flex justify-end gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white transition">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white transition">
                <XIcon className="h-5 w-5" />
                <span className="sr-only">X</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white transition">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Smaller Legal section */}
        <div className="border-t border-zinc-800 pt-3 mt-3 flex flex-col md:flex-row justify-between text-xs">
          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2 md:mb-0">
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms and Conditions
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="hover:text-white transition-colors">
              Cookies Policy
            </Link>
          </div>

          <div>
            <select className="bg-zinc-800 text-white border border-zinc-700 rounded px-2 py-1 text-xs">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="it">Italiano</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-zinc-500 mt-3">
          <p>&copy; {new Date().getFullYear()} Provaa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
