import React from "react";

const Footer = () => {
  return (
    <footer className="bg-stone-50 border-t border-stone-200 text-stone-600 p-6 text-center">
      <div className="container mx-auto">
        <p className="mb-2 text-sm text-stone-600">
          &copy; {new Date().getFullYear()} MBSTU Admission Management. All
          rights reserved.
        </p>
        <div className="flex justify-center space-x-6 text-sm font-medium">
          <a href="#" className="hover:text-stone-900 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-stone-900 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-stone-900 transition-colors">
            Contact Us
          </a> 
        </div>
      </div>
    </footer>
  );
};

export default Footer;
