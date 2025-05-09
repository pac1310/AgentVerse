import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchAgents } from '../../lib/agentService';
import { Agent } from '../../types/agent';

const GlobalSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsLoading(true);
        setIsOpen(true);
        
        try {
          const results = await searchAgents(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error('Error searching agents:', error);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]);
        setIsOpen(false);
      }
    }, 300);
    
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsOpen(false);
  };
  
  const navigateToAgent = (agentId: string) => {
    navigate(`/agents/${agentId}`);
    setIsOpen(false);
    setSearchQuery('');
  };
  
  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search agents, capabilities, use cases..."
          value={searchQuery}
          onChange={handleSearch}
          onFocus={() => searchQuery.length >= 2 && setIsOpen(true)}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        />
        {searchQuery && (
          <button 
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={clearSearch}
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
      
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-50 border border-gray-200 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="py-4 px-4 text-center text-sm text-gray-500">
              <div className="animate-spin inline-block w-4 h-4 border-2 border-gray-300 border-t-primary-600 rounded-full mr-2"></div>
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-b">
                Search Results
              </div>
              <ul>
                {searchResults.map(agent => (
                  <li 
                    key={agent.id}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => navigateToAgent(agent.id)}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 mr-3 flex items-center justify-center rounded-full bg-primary-100 text-primary-700">
                        {typeof agent.logo === 'string' && agent.logo.startsWith('http') ? (
                          <img src={agent.logo} alt={agent.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <span className="text-sm font-medium">{agent.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{agent.description}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : searchQuery.length >= 2 ? (
            <div className="py-4 px-4 text-center text-sm text-gray-500">
              No agents found matching "{searchQuery}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch; 