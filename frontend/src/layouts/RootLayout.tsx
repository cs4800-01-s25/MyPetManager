import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";

// Navigation menu items data
const navItems = [
  { label: "Exploring", href: "/" },
  { label: "Health Portal", href: "/example-health-portal" },
  { label: "Schedule Appointment", href: "/example-schedule" },
  { label: "Join our Community", href: "/signup" },
];

export const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();             // ← import useLocation
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Re-check token on *every* location change:
  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center relative bg-white overflow-hidden">
      {/* Navigation Bar */}
      <header className="w-full h-[102px] bg-white">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 h-full">
          <Link to="/" className="relative">
            {/* your logos… */}
          </Link>

          <nav className="flex items-center gap-10">
            {navItems.map((item, i) => (
              <Link
                key={i}
                to={item.href}
                className="font-paragraph-2 text-[#222222] whitespace-nowrap hover:text-[#b4d1e2] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {isAuthenticated ? (
            <Button
              onClick={handleLogout}
              className="px-5 py-3 bg-[#7c5c42] hover:bg-[#6a4f38] text-white rounded-2xl transition-colors font-paragraph-2"
            >
              Logout
            </Button>
          ) : (
            <Link to="/login">
              <Button className="px-5 py-3 bg-[#7c5c42] hover:bg-[#6a4f38] text-white rounded-2xl transition-colors font-paragraph-2">
                Login
              </Button>
            </Link>
          )}
        </div>
      </header>

      {children}

      {/* Footer… */}
    </div>
  );
};

export default RootLayout;