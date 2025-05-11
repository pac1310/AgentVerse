import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

// Storage keys
const SIDEBAR_COLLAPSED_KEY = 'sidebarCollapsed';
const SETTINGS_STORAGE_KEY = 'oneai_user_settings';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar open state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop sidebar collapsed state
  
  // Load sidebar collapsed state from settings or direct localStorage on component mount
  useEffect(() => {
    // First check if we have it in the settings object
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.sidebarCollapsed !== undefined) {
          setSidebarCollapsed(settings.sidebarCollapsed);
          return;
        }
      }
    } catch (error) {
      console.error("Failed to parse settings:", error);
    }
    
    // Fall back to direct localStorage value if settings don't have it
    const savedState = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (savedState !== null) {
      setSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);
  
  // Also listen for changes to the settings
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === SETTINGS_STORAGE_KEY) {
        try {
          const newSettings = JSON.parse(event.newValue || '{}');
          if (newSettings.sidebarCollapsed !== undefined) {
            setSidebarCollapsed(newSettings.sidebarCollapsed);
          }
        } catch (error) {
          console.error("Failed to parse updated settings:", error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleSidebarCollapse = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    
    // Save to localStorage for persistence
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, JSON.stringify(newState));
    
    // Also update in settings if they exist
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        settings.sidebarCollapsed = newState;
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      }
    } catch (error) {
      console.error("Failed to update settings with new sidebar state:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar 
        isOpen={sidebarOpen} 
        isCollapsed={sidebarCollapsed} 
        toggleCollapse={toggleSidebarCollapse} 
      />
      
      <div className={`transition-all duration-300 pt-16 ${
        sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}>
        <main className="px-4 py-6 md:px-6 md:py-8">
          <Outlet />
        </main>
      </div>
      
      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-gray-900 bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default Layout;