import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, BarChart3, BookOpen, Settings, HelpCircle, ChevronLeft, ChevronRight, Wrench, Shield } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, isCollapsed, toggleCollapse }) => {
  const location = useLocation();
  
  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Discover', path: '/discover', icon: Search },
    { name: 'Register', path: '/register', icon: PlusCircle },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Documentation', path: '/docs', icon: BookOpen },
  ];

  const adminItems = [
    { name: 'Admin Tools', path: '/admin', icon: Shield },
  ];

  const bottomNavigationItems = [
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Help & Support', path: '/help', icon: HelpCircle },
  ];

  const NavItem = ({ item }: { item: typeof navigationItems[0] }) => {
    const isActive = location.pathname === item.path || 
                     (item.path !== '/' && location.pathname.startsWith(item.path));
    const Icon = item.icon;
    
    return (
      <Link
        to={item.path}
        className={clsx(
          "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
          isActive
            ? "bg-primary-50 text-primary-700"
            : "text-gray-700 hover:bg-gray-100",
          isCollapsed ? "justify-center" : ""
        )}
        title={isCollapsed ? item.name : undefined}
      >
        <Icon className={clsx(
          "h-5 w-5 flex-shrink-0", 
          isCollapsed ? "mx-auto" : "mr-3", 
          isActive ? "text-primary-600" : "text-gray-500"
        )} />
        {!isCollapsed && <span>{item.name}</span>}
      </Link>
    );
  };

  const Section = ({ title, items }: { title: string, items: typeof navigationItems }) => {
    if (isCollapsed) {
      return (
        <div className="my-4 space-y-1">
          {items.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </div>
      );
    }

    return (
      <div className="mb-4">
        <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          {title}
        </h3>
        <nav className="space-y-1">
          {items.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>
      </div>
    );
  };

  return (
    <aside
      className={clsx(
        "fixed inset-y-0 left-0 z-20 flex flex-col bg-white border-r border-gray-200 pt-16 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* Toggle button for collapsing/expanding the sidebar (desktop only) */}
      <button
        onClick={toggleCollapse}
        className="absolute hidden lg:flex items-center justify-center w-6 h-6 top-20 -right-3 bg-white rounded-full border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-100 z-30"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
      
      <div className="flex flex-col flex-1 overflow-y-auto p-4">
        {/* Main navigation */}
        <nav className="flex-1 space-y-1">
          {navigationItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>
        
        {/* Admin section */}
        <div className={`mt-6 pt-4 ${isCollapsed ? '' : 'border-t border-gray-200'}`}>
          {isCollapsed ? (
            <div className="space-y-2">
              {adminItems.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </div>
          ) : (
            <>
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Admin Tools
              </h3>
              <nav className="space-y-1">
                {adminItems.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </nav>
            </>
          )}
        </div>
        
        {/* Recently viewed section - only shown when sidebar is expanded */}
        {!isCollapsed && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Recently Viewed
            </h3>
            <div className="mt-2 space-y-1">
              <Link to="/agents/textanalyzer" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                TextAnalyzer Pro
              </Link>
              <Link to="/agents/vision-assistant" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                Vision Assistant
              </Link>
              <Link to="/agents/datainsight" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                DataInsight
              </Link>
            </div>
          </div>
        )}
        
        {/* Bottom navigation */}
        <div className={`mt-auto ${isCollapsed ? 'pt-4 space-y-2' : 'mt-6 space-y-1'}`}>
          <nav className="space-y-1">
            {bottomNavigationItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;