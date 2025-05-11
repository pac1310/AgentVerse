import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { fetchAgents } from '../lib/agentService';
import { Agent } from '../types/agent';
import { getAgentIcon } from '../data/agents';
import { Link } from 'react-router-dom';
import { Search, Sliders, ChevronDown, ChevronUp, Clock, X } from 'lucide-react';
import Button from '../components/ui/Button';

const AgentDiscovery = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('newest');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  
  // Placeholder for all available categories and capabilities
  const categories = [
    { id: 'nlp', name: 'Natural Language Processing', count: 0 },
    { id: 'cv', name: 'Computer Vision', count: 1 },
    { id: 'data', name: 'Data Analysis', count: 2 },
    { id: 'code', name: 'Code Generation', count: 1 },
    { id: 'doc', name: 'Document Processing', count: 0 },
    { id: 'rec', name: 'Recommendation Systems', count: 1 },
  ];
  
  const capabilities = [
    'Text Generation',
    'Text Classification',
    'Named Entity Recognition',
    'Sentiment Analysis',
    'Image Recognition',
    'Object Detection',
    'Data Visualization',
    'Anomaly Detection',
  ];
  
  useEffect(() => {
    const loadAgents = async () => {
      setLoading(true);
      try {
        const agentData = await fetchAgents();
        setAgents(agentData);
      } catch (error) {
        console.error('Error loading agents:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAgents();
  }, []);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };
  
  const toggleCapability = (capability: string) => {
    setSelectedCapabilities(prev => 
      prev.includes(capability) 
        ? prev.filter(c => c !== capability) 
        : [...prev, capability]
    );
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedCapabilities([]);
  };
  
  const hasActiveFilters = searchTerm || selectedCategories.length > 0 || selectedCapabilities.length > 0;
  
  // Filter agents based on search and selected filters
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = searchTerm === '' || 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      agent.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategories = selectedCategories.length === 0 || 
      selectedCategories.some(category => agent.tags.includes(category));
      
    const matchesCapabilities = selectedCapabilities.length === 0 || 
      selectedCapabilities.some(capability => agent.capabilities.includes(capability));
      
    return matchesSearch && matchesCategories && matchesCapabilities;
  });
  
  // Sort agents based on selected sort option
  const sortedAgents = [...filteredAgents].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });
  
  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Discover AI Agents</h1>
        <p className="text-gray-600 mt-2">
          Find the perfect AI agents for your needs
        </p>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search agents..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={hasActiveFilters ? "primary" : "outline"}
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                className="flex items-center"
              >
                <Sliders className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 bg-white text-primary-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {selectedCategories.length + selectedCapabilities.length + (searchTerm ? 1 : 0)}
                  </span>
                )}
                {filtersExpanded ? (
                  <ChevronUp className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2" />
                )}
              </Button>
              
              <div className="flex items-center">
                <label htmlFor="sort" className="text-sm text-gray-600 mr-2 whitespace-nowrap">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Expandable Filter Section */}
          {filtersExpanded && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-900">Filter by:</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
                  >
                    <X className="h-4 w-4 mr-1" /> Clear filters
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                          className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {category.name} ({category.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Capabilities</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {capabilities.map((capability) => (
                      <label key={capability} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCapabilities.includes(capability)}
                          onChange={() => toggleCapability(capability)}
                          className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                        />
                        <span className="ml-2 text-sm text-gray-700">{capability}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Results Count */}
      <div className="text-sm text-gray-500">
        Showing {sortedAgents.length} {sortedAgents.length === 1 ? 'agent' : 'agents'}
      </div>
      
      {/* Agent Cards Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading agents...</p>
        </div>
      ) : sortedAgents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">No agents found</h3>
          <p className="mt-2 text-gray-600">
            Try adjusting your filters or search terms
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedAgents.map((agent) => {
            const AgentIcon = getAgentIcon(agent.logo);
            const isLogoUrl = agent.logo && typeof agent.logo === 'string' && agent.logo.startsWith('http');
            
            return (
              <Link to={`/agents/${agent.id}`} key={agent.id}>
                <Card className="h-full hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 rounded-lg bg-primary-50 text-primary-600">
                        {isLogoUrl ? (
                          <img 
                            src={agent.logo} 
                            alt={agent.name} 
                            className="h-8 w-8 object-contain"
                          />
                        ) : (
                          <AgentIcon className="h-8 w-8" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 leading-tight">{agent.name}</h3>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{agent.description}</p>
                    
                    <div className="mt-4">
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Capabilities</h4>
                      <div className="flex flex-wrap gap-2">
                        {agent.capabilities.slice(0, 3).map((capability) => (
                          <span 
                            key={capability} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {capability}
                          </span>
                        ))}
                        {agent.capabilities.length > 3 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{agent.capabilities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(agent.createdAt).toLocaleDateString()}
                      </div>
                      
                      {agent.metrics && (
                        <div className="flex items-center">
                          <span className="font-medium text-primary-600">
                            {agent.metrics.performance || 0}% effective
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AgentDiscovery;