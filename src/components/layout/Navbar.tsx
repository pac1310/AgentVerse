import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Settings, Menu, LogOut, User } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../lib/AuthContext';
import GlobalSearch from '../search/GlobalSearch';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="bg-white border-b border-gray-200 fixed w-full h-16 z-30">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
          
          <Link to="/" className="flex items-center ml-2 lg:ml-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 mr-2">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">OneAI</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center justify-center flex-1 max-w-2xl mx-4">
          <GlobalSearch />
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/register">
            <Button 
              variant="primary" 
              size="sm" 
              className="hidden sm:flex"
            >
              Register Agent
            </Button>
          </Link>
          
          <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
            <Settings className="h-5 w-5" />
          </button>

          <button 
            onClick={handleLogout}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
          
          <button className="p-1 rounded-full border-2 border-primary-600">
            <User className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;