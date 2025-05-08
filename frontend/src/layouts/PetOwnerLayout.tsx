import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../pages/AppContext'; // Context import

import {
    Home,
    PawPrint,
    FileArchive,
    Calendar,
    ChevronDown,
    Menu, 
    X, LogOut, User, Search, Bell } from "lucide-react";

// Admin navigation items data
const adminNavItems = [
    { label: "Home", href: "/mainDashboard", icon: <Home size={20} /> },
    { label: "Pet Profile", href: "/pets", icon: <PawPrint size={20} /> },
    { label: "Health Portal", href: "/admin/health-records", icon: <FileArchive size={20} /> },
    { label: "Schedule", href: "/appointments", icon: <Calendar size={20} /> },
];

interface PetOwnerLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
}

// sets name on top 
export const PetOwnerLayout = ({ children, currentPath = "/mainDashboard" }: PetOwnerLayoutProps) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // **Dynamic User from Context**
  const { user } = useAppContext();
  
  // Generate breadcrumbs based on current path
 const generateBreadcrumbs = (path: string) => {
  const segments = path.split("/").filter(Boolean);

  // Show 'Dashboard' as the root label
  if (segments.length === 0 || segments[0] === "mainDashboard") {
    return [{ label: "Dashboard", href: "/mainDashboard" }];
  }

  return segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    return {
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
      href,
    };
  });
};

  
  const breadcrumbs = generateBreadcrumbs(currentPath);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#7c5c42] text-white transition-all duration-300 ease-in-out hidden md:block`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen ? (
            <Link to="/admin" className="text-xl font-semibold whitespace-nowrap">
              My Pet Manager
            </Link>
          ) : (
            <Link to="/admin" className="flex justify-center w-full">
              <img
                className="w-10 h-10"
                alt="Logo"
                src="/simple-minimalist-one-line-dog-cat-logo-1.png"
              />
            </Link>
          )}
          <button onClick={toggleSidebar} className="text-white p-1">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="mt-8">
          <ul className="space-y-2 px-2">
            {adminNavItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  className={`flex items-center py-3 px-4 rounded-lg hover:bg-[#6a4f38] transition-colors ${
                    location.pathname === item.href ? 'bg-[#6a4f38]' : ''
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {sidebarOpen && (
          <div className="absolute bottom-0 w-64 p-4 border-t border-[#6a4f38]">
            <Link
              to="/"
              className="flex items-center py-2 px-4 rounded-lg hover:bg-[#6a4f38] transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              <span>Logout</span>
            </Link>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="h-16 px-4 flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={toggleSidebar} 
                className="mr-4 text-gray-600 md:hidden"
              >
                <Menu size={24} />
              </button>
              
              <div className="hidden md:flex">
                {/* Breadcrumbs */}
                <nav className="text-sm">
                  <ol className="flex items-center space-x-2">
                    {breadcrumbs.map((crumb, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && <span className="text-gray-400">/</span>}
                        <li>
                          <Link 
                            to={crumb.href}
                            className={`${
                              index === breadcrumbs.length - 1
                                ? 'text-[#7c5c42] font-medium'
                                : 'text-gray-500 hover:text-[#7c5c42]'
                            }`}
                          >
                            {crumb.label}
                          </Link>
                        </li>
                      </React.Fragment>
                    ))}
                  </ol>
                </nav>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="form-input pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c5c42] focus:border-transparent"
                />
              </div>
              
              {/* Notifications */}
              <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* User Menu */}
              <div className="relative">
                <button 
                  onClick={toggleUserMenu}
                  className="flex items-center text-gray-700 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-[#7c5c42] flex items-center justify-center text-white">
                    <User size={18} />
                  </div>
                  <span className="ml-2 mr-1 hidden md:block">{user?.firstName || 'User'}</span> {/* Dynamic User Name */}
                  <ChevronDown size={16} className="hidden md:block" />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                    <Link
                      to="/admin/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <Link
                      to="/"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PetOwnerLayout;