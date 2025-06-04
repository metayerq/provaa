
import React, { useEffect } from "react";
import Navbar from "./navbar";
import Footer from "./Footer";
import SEOHead from "../SEOHead";

interface LayoutProps {
  children: React.ReactNode;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  seoTitle,
  seoDescription,
  seoImage 
}) => {
  useEffect(() => {
    // Initialize intersection observer for scroll-based animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    // Observe elements that should animate on scroll
    const animatedElements = document.querySelectorAll(
      ".featured-card, .how-it-works-item"
    );
    
    animatedElements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        ogImage={seoImage}
      />
      <Navbar />
      <main className="flex-grow pt-16">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
