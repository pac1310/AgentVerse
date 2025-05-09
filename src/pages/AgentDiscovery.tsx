import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { AgentCard } from '../components/agents/AgentCard';
import { AgentFilters, Agent, AgentCategory } from '../types/agent';
import { agentCapabilities } from '../data/agents';
import { fetchAgents, fetchAgentCategories } from '../lib/agentService';

const AgentDiscovery: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<AgentFilters>({
    categories: [],
    capabilities: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [categories, setCategories] = useState<AgentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch agents and categories from Supabase on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [agentsData, categoriesData] = await Promise.all([
          fetchAgents(),
          fetchAgentCategories()
        ]);
        
        setAgents(agentsData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Filter agents based on search query and active filters
  const filteredAgents = agents.filter(agent => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        agent.name.toLowerCase().includes(query) ||
        agent.description.toLowerCase().includes(query) ||
        (agent.detailedDescription?.toLowerCase().includes(query) || false) ||
        agent.capabilities.some(c => c.toLowerCase().includes(query)) ||
        agent.tags.some(t => t.toLowerCase().includes(query));
      
      if (!matchesSearch) return false;
    }
    
    // Category filter
    if (activeFilters.categories?.length) {
      const matchesCategory = activeFilters.categories.some(category => 
        agent.tags.includes(category)
      );
      
      if (!matchesCategory) return false;
    }
    
    // Capability filter
    if (activeFilters.capabilities?.length) {
      const matchesCapability = activeFilters.capabilities.some(capability => 
        agent.capabilities.includes(capability)
      );
      
      if (!matchesCapability) return false;
    }
    
    return true;
  });
  
  const toggleCategory = (categoryId: string) => {
    setActiveFilters(prev => {
      const categories = prev.categories || [];
      if (categories.includes(categoryId)) {
        return { ...prev, categories: categories.filter(id => id !== categoryId) };
      } else {
        return { ...prev, categories: [...categories, categoryId] };
      }
    });
  };
  
  const toggleCapability = (capability: string) => {
    setActiveFilters(prev => {
      const capabilities = prev.capabilities || [];
      if (capabilities.includes(capability)) {
        return { ...prev, capabilities: capabilities.filter(c => c !== capability) };
      } else {
        return { ...prev, capabilities: [...capabilities, capability] };
      }
    });
  };
  
  const clearFilters = () => {
    setActiveFilters({
      categories: [],
      capabilities: [],
    });
    setSearchQuery('');
  };
  
  return (
    <div className="animate-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Discover AI Agents</h1>
        <p className="text-gray-600 mt-2">
          Find the perfect AI agents for your needs
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Mobile filter toggle */}
        <div className="lg:hidden flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            icon={<Filter className="h-4 w-4" />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          
          {(activeFilters.categories?.length || activeFilters.capabilities?.length) > 0 && (
            <Button
              variant="ghost"
              size="sm"
              icon={<X className="h-4 w-4" />}
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
        
        {/* Filters sidebar - desktop always visible, mobile conditionally */}
        <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Search</h2>
                <Input
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearFilters}
                  >
                    Clear All
                  </Button>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`category-${category.id}`}
                          checked={activeFilters.categories?.includes(category.id) || false}
                          onChange={() => toggleCategory(category.id)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`category-${category.id}`} className="ml-2 text-sm text-gray-700">
                          {category.name} ({category.count})
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Capabilities</h3>
                  <div className="space-y-2">
                    {agentCapabilities.slice(0, 8).map((capability) => (
                      <div key={capability} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`capability-${capability}`}
                          checked={activeFilters.capabilities?.includes(capability) || false}
                          onChange={() => toggleCapability(capability)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`capability-${capability}`} className="ml-2 text-sm text-gray-700">
                          {capability}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="lg:w-3/4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <Card>
              <CardContent className="p-12 text-center">
                <h3 className="text-lg font-medium text-gray-900">Error loading agents</h3>
                <p className="mt-2 text-sm text-gray-500">{error}</p>
                <div className="mt-6">
                  <Button onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-500">
                    Showing <span className="font-medium">{filteredAgents.length}</span> agents
                  </span>
                  
                  {(activeFilters.categories?.length > 0 || activeFilters.capabilities?.length > 0 || searchQuery !== '') && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {searchQuery && (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                          Search: {searchQuery}
                          <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="ml-1 text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      
                      {activeFilters.categories?.map(categoryId => {
                        const category = categories.find(c => c.id === categoryId);
                        if (!category) return null;
                        return (
                          <span key={categoryId} className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800">
                            {category.name}
                            <button
                              type="button"
                              onClick={() => toggleCategory(categoryId)}
                              className="ml-1 text-primary-500 hover:text-primary-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        );
                      })}
                      
                      {activeFilters.capabilities?.map(capability => (
                        <span key={capability} className="inline-flex items-center rounded-full bg-secondary-100 px-3 py-1 text-xs font-medium text-secondary-800">
                          {capability}
                          <button
                            type="button"
                            onClick={() => toggleCapability(capability)}
                            className="ml-1 text-secondary-500 hover:text-secondary-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center">
                  <select
                    className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    defaultValue="newest"
                  >
                    <option value="newest">Sort by: Newest</option>
                    <option value="name">Sort by: Name (A-Z)</option>
                    <option value="performance">Sort by: Performance</option>
                  </select>
                </div>
              </div>
              
              {filteredAgents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {filteredAgents.map((agent) => (
                    <AgentCard key={agent.id} agent={agent} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No agents found</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Try adjusting your search or filter criteria to find what you're looking for.
                    </p>
                    <div className="mt-6">
                      <Button onClick={clearFilters}>
                        Clear all filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentDiscovery;