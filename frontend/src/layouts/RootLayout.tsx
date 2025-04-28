import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

// Navigation menu items data
const navItems = [
  { label: "Exploring", href: "/" },
  { label: "My Pet Profile", href: "/pet-profile" },
  { label: "Health Portal", href: "/health-portal" },
  { label: "Schedule Appointment", href: "/schedule" },
  { label: "Join our Community", href: "/signup" },
];

export const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center relative bg-white overflow-hidden">
      {/* Navigation Bar */}
      <header className="w-full h-[102px] bg-white">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 h-full">
          <Link to="/" className="relative">
            <img
              className="w-[161px] h-[138px]"
              alt="Simple minimalist logo"
              src="/simple-minimalist-one-line-dog-cat-logo-1.png"
            />
            <img
              className="absolute top-0 left-0 w-[161px] h-[138px]"
              alt="Simple minimalist logo overlay"
              src="/simple-minimalist-one-line-dog-cat-logo-2.png"
            />
          </Link>

          <nav className="flex items-center gap-10">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="font-paragraph-2 text-[#222222] text-center whitespace-nowrap hover:text-[#b4d1e2] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link to="/login">
            <Button 
              className="px-5 py-3 bg-[#7c5c42] hover:bg-[#6a4f38] text-white rounded-2xl transition-colors font-paragraph-2"
            >
              Login
            </Button>
          </Link>
        </div>
      </header>

      {children}

      {/* Footer */}
      <footer className="w-full h-[389px] mt-16 bg-transparent shadow-[0px_4px_4px_#00000040] [background:url(..//footer.png)_50%_50%_/_cover]">
        <div className="absolute bottom-12 left-9 font-['Poppins',Helvetica] font-normal text-[#222222] text-[13px] leading-[22px] whitespace-nowrap">
          Copyright © 2025. My Pet Manager. All rights reserved.
        </div>
      </footer>
    </div>
  );
};