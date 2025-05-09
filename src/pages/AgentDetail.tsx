import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAgentIcon } from '../data/agents';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeft, Clock, Download, Edit, ExternalLink, Github, Globe, Heart, Loader, Save, Share2, Star, Users, X, AlertCircle, CheckCircle } from 'lucide-react';
import { fetchAgentById, isAgentCreator, updateAgent } from '../lib/agentService';
import { Agent } from '../types/agent';
import { useAuth } from '../lib/AuthContext';
import Input from '../components/ui/Input';

function formatJsonString(jsonString: string): string {
  try {
    const parsedJson = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
    return JSON.stringify(parsedJson, null, 2);
  } catch (e) {
    return jsonString;
  }
}

// Function to extract and format JSON from a string that might contain HTTP request info
const extractAndFormatJson = (str: string): string => {
  // Try to extract JSON part from a string that might contain HTTP request info
  try {
    // Look for JSON object pattern that starts with {
    const jsonMatch = str.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonPart = jsonMatch[0];
      // Try to parse and format
      const parsedJson = JSON.parse(jsonPart);
      return JSON.stringify(parsedJson, null, 2);
    }
    return str;
  } catch (e) {
    return str;
  }
};

const tryParseJson = (str: string): boolean => {
  if (!str) return false;
  try {
    // Try direct JSON parsing first
    JSON.parse(str);
    return true;
  } catch (e) {
    // If direct parsing fails, try to extract JSON from HTTP request format
    try {
      const jsonMatch = str.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        JSON.parse(jsonMatch[0]);
        return true;
      }
    } catch (e) {
      // Not a valid JSON in any form
    }
    return false;
  }
};

const JsonDisplay = ({ content }: { content: string }) => {
  if (!content) return null;
  
  // Process the content - extract JSON if needed
  const processedContent = extractAndFormatJson(content);
  
  // Enhanced JSON display with better syntax highlighting
  return (
    <pre className="mt-2 p-4 bg-gray-50 rounded-md overflow-auto text-sm whitespace-pre shadow-inner">
      <code className="language-json">
        {processedContent.split('\n').map((line, i) => {
          // Enhanced regex pattern to handle nested structures better
          const keyValueRegex = /"([^"]+)":\s*("([^"]*)"|\{|\[|[0-9.]+|true|false|null)/g;
          
          // Apply different color styling to different parts of the JSON
          const highlightedLine = line.replace(
            keyValueRegex,
            (match, key, value) => {
              if (value.startsWith('"')) {
                return `<span class="text-blue-700">"${key}"</span>: <span class="text-green-600">${value}</span>`;
              } else if (!isNaN(Number(value))) {
                return `<span class="text-blue-700">"${key}"</span>: <span class="text-amber-600">${value}</span>`;
              } else {
                return `<span class="text-blue-700">"${key}"</span>: <span class="text-purple-600">${value}</span>`;
              }
            }
          )
          .replace(/"([^"]*)"/g, (match) => `<span class="text-green-600">${match}</span>`)
          .replace(/\b(true|false|null)\b/g, (match) => `<span class="text-amber-600">${match}</span>`)
          .replace(/[\[\]\{\},]/g, (match) => `<span class="text-gray-500">${match}</span>`);
          
          // Add indentation highlighting - safely handle potential null from match
          const indentMatch = line.match(/^\s*/);
          const indentation = indentMatch ? indentMatch[0].length : 0;
          const paddingLeft = `${indentation * 0.25}rem`;
          
          return (
            <div 
              key={i} 
              dangerouslySetInnerHTML={{ __html: highlightedLine }}
              style={{ 
                borderLeft: indentation > 0 ? '1px solid rgba(209, 213, 219, 0.5)' : 'none',
                paddingLeft
              }}
              className={indentation > 0 ? 'hover:bg-gray-100' : ''}
            />
          );
        })}
      </code>
    </pre>
  );
};

// New Notification component
const Notification = ({ 
  type, 
  message, 
  onClose 
}: { 
  type: 'success' | 'error'; 
  message: string; 
  onClose: () => void;
}) => {
  // Auto-close after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div 
      className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg max-w-md flex items-start animate-in slide-in-from-right duration-300 ${
        type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
      ) : (
        <AlertCircle className="h-5 w-5 mr-3 text-red-500 flex-shrink-0" />
      )}
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-500"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

const AgentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState<Partial<Agent>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const { session } = useAuth();
  const navigate = useNavigate();
  
  // For notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const loadAgent = async () => {
    try {
      if (id) {
        setLoading(true);
        setError(null);
        console.log(`Loading agent with ID: ${id}`);
        
        const data = await fetchAgentById(id);
        console.log(`Agent data received:`, data);
        
        setAgent(data);
        
        if (data) {
          setEditFormData({
            name: data.name,
            description: data.description,
            detailedDescription: data.detailedDescription,
            inputFormat: data.inputFormat,
            outputFormat: data.outputFormat,
            version: data.version,
            capabilities: [...data.capabilities],
            tags: [...data.tags],
            dependencies: data.dependencies ? [...data.dependencies] : [],
            documentationUrl: data.documentationUrl,
            demoUrl: data.demoUrl,
            apiEndpoint: data.apiEndpoint,
            exampleRequest: data.exampleRequest,
            exampleResponse: data.exampleResponse,
          });
        } else {
          setError(`Agent with ID ${id} not found`);
        }
        
        if (session && data) {
          const creatorCheck = await isAgentCreator(id);
          setIsCreator(creatorCheck);
        }
      }
    } catch (err: any) {
      console.error('Error loading agent:', err);
      setError(err.message || 'Failed to load agent details');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadAgent();
  }, [id, session]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const values = e.target.value.split(',').map(item => item.trim());
    setEditFormData(prev => ({ ...prev, [fieldName]: values }));
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoFile(e.target.files[0]);
    }
  };
  
  const handleSave = async () => {
    if (!id || !agent) return;
    
    try {
      setIsSaving(true);
      setError(null);
      
      const updateData = {
        ...agent,
        ...editFormData,
        logo: agent.logo,
      };
      
      const updatedAgent = await updateAgent(id, updateData, logoFile || undefined);
      setAgent(updatedAgent);
      setIsEditing(false);
      
      setLogoFile(null);
      
      // Show success notification
      setNotification({
        type: 'success',
        message: 'Agent updated successfully! Redirecting to the new agent...'
      });
      
      // Navigate to the new agent page after a brief delay
      setTimeout(() => {
        // Navigate to the new agent ID page
        navigate(`/agents/${updatedAgent.id}`);
        
        // Full page reload to ensure we load fresh data
        window.location.reload();
      }, 1500); // Delay so the user sees the success message
    } catch (err: any) {
      console.error('Error updating agent:', err);
      
      // Display more specific error message
      if (err.message && err.message.includes('not found')) {
        setError(`Agent not found. The agent may have been deleted.`);
        setNotification({
          type: 'error',
          message: 'Error: Agent not found. The agent may have been deleted. Please try creating a new agent.'
        });
      } else if (err.code === 'PGRST116') {
        setError('Database error: Could not find the agent to update.');
        setNotification({
          type: 'error',
          message: 'Error: Could not find the agent to update. Please refresh and try again, or create a new agent.'
        });
      } else {
        setError(err.message || 'Failed to update agent');
        setNotification({
          type: 'error',
          message: `Failed to update agent: ${err.message || 'Unknown error'}`
        });
      }
      
      // Wait 3 seconds and then redirect to registration if this was a "not found" error
      if (err.message && err.message.includes('not found')) {
        setTimeout(() => {
          navigate('/register');
        }, 3000);
      }
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancelEdit = () => {
    if (agent) {
      setEditFormData({
        name: agent.name,
        description: agent.description,
        detailedDescription: agent.detailedDescription,
        inputFormat: agent.inputFormat,
        outputFormat: agent.outputFormat,
        version: agent.version,
        capabilities: [...agent.capabilities],
        tags: [...agent.tags],
        dependencies: agent.dependencies ? [...agent.dependencies] : [],
        documentationUrl: agent.documentationUrl,
        demoUrl: agent.demoUrl,
        apiEndpoint: agent.apiEndpoint,
        exampleRequest: agent.exampleRequest,
        exampleResponse: agent.exampleResponse,
      });
    }
    
    setLogoFile(null);
    setIsEditing(false);
  };
  
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading agent details...</p>
      </div>
    );
  }
  
  if (error || !agent) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Agent not found</h2>
        <p className="mt-2 text-gray-600">
          {error || "The agent you're looking for doesn't exist or has been removed."}
        </p>
        <div className="mt-6 flex gap-4 justify-center">
          <Link to="/discover">
            <Button>
              Back to Discovery
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary">
              Register New Agent
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const AgentIcon = getAgentIcon(agent.logo);
  const isLogoUrl = agent.logo && typeof agent.logo === 'string' && agent.logo.startsWith('http');
  
  return (
    <div className="animate-in space-y-8">
      {/* Show notification if present */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div>
        <Link 
          to="/discover" 
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Discovery
        </Link>
        
        {/* Show error message if present */}
        {error && !notification && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
            {error}
          </div>
        )}
        
        <div className="flex flex-col items-start w-full mb-6">
          {/* Agent title and info */}
          <div className="flex items-center w-full">
            <div className="p-3 rounded-lg bg-primary-50 text-primary-600 mr-4">
              {isLogoUrl ? (
                <img 
                  src={agent.logo} 
                  alt={agent.name} 
                  className="h-8 w-8 object-contain"
                  onError={(e) => {
                    console.error('Error loading image:', e);
                    e.currentTarget.src = '';
                    e.currentTarget.style.display = 'none';
                    
                    if (e.currentTarget.parentNode) {
                      const iconElement = document.createElement('div');
                      iconElement.className = 'h-8 w-8 text-primary-600';
                      iconElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>';
                      e.currentTarget.parentNode.appendChild(iconElement);
                    }
                  }}
                />
              ) : (
                <AgentIcon className="h-8 w-8" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{agent.name}</h1>
              <p className="text-gray-600 mt-1">Created by {agent.creator}</p>
            </div>
          </div>

          {/* Action buttons in one row below the title, Material Design style */}
          <div className="flex gap-2 mt-4">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  icon={<X className="h-4 w-4" />}
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  icon={isSaving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  icon={<Edit className="h-4 w-4" />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Agent
                </Button>
                <Button
                  variant="outline"
                  icon={<Heart className="h-4 w-4" />}
                >
                  Favorite
                </Button>
                <Button
                  variant="outline"
                  icon={<Share2 className="h-4 w-4" />}
                >
                  Share
                </Button>
                <Button
                  variant="primary"
                  icon={<Download className="h-4 w-4" />}
                >
                  Use Agent
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {isEditing ? (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Edit Agent Information</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
                    <Input 
                      type="text" 
                      name="name" 
                      value={editFormData.name || ''} 
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                      name="description" 
                      value={editFormData.description || ''} 
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoChange} 
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty to keep the current logo</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Input Format</label>
                      <textarea 
                        name="inputFormat" 
                        value={editFormData.inputFormat || ''} 
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Output Format</label>
                      <textarea 
                        name="outputFormat" 
                        value={editFormData.outputFormat || ''} 
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        rows={4}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capabilities (comma-separated)</label>
                    <Input 
                      type="text" 
                      value={editFormData.capabilities?.join(', ') || ''} 
                      onChange={(e) => handleArrayChange(e, 'capabilities')}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categories (comma-separated)</label>
                    <Input 
                      type="text" 
                      value={editFormData.tags?.join(', ') || ''} 
                      onChange={(e) => handleArrayChange(e, 'tags')}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dependencies (comma-separated)</label>
                    <Input 
                      type="text" 
                      value={editFormData.dependencies?.join(', ') || ''} 
                      onChange={(e) => handleArrayChange(e, 'dependencies')}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                    <Input 
                      type="text" 
                      name="version" 
                      value={editFormData.version || ''} 
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Documentation URL</label>
                    <Input 
                      type="url" 
                      name="documentationUrl" 
                      value={editFormData.documentationUrl || ''} 
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Demo URL</label>
                    <Input 
                      type="url" 
                      name="demoUrl" 
                      value={editFormData.demoUrl || ''} 
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">API Endpoint</label>
                    <Input 
                      type="text" 
                      name="apiEndpoint" 
                      value={editFormData.apiEndpoint || ''} 
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Example Request</label>
                    <textarea 
                      name="exampleRequest" 
                      value={editFormData.exampleRequest || ''} 
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Example Response</label>
                    <textarea 
                      name="exampleResponse" 
                      value={editFormData.exampleResponse || ''} 
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold text-gray-900">About this Agent</h2>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {agent.description}
                  </p>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Input Format</h3>
                      {tryParseJson(agent.inputFormat) ? (
                        <JsonDisplay content={agent.inputFormat} />
                      ) : (
                        <p className="mt-2 text-gray-900">{agent.inputFormat}</p>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Output Format</h3>
                      {tryParseJson(agent.outputFormat) ? (
                        <JsonDisplay content={agent.outputFormat} />
                      ) : (
                        <p className="mt-2 text-gray-900">{agent.outputFormat}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500">Capabilities</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {agent.capabilities.map((capability) => (
                        <span 
                          key={capability} 
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                        >
                          {capability}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {agent.dependencies && agent.dependencies.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-500">Dependencies</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {agent.dependencies.map((dependency) => (
                          <span 
                            key={dependency} 
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                          >
                            {dependency}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold text-gray-900">Integration</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">API Endpoint</h3>
                      <div className="mt-2 p-3 bg-gray-50 rounded-md text-gray-800 font-mono text-sm">
                        {agent.apiEndpoint || 'No API endpoint available'}
                      </div>
                    </div>
                    
                    {agent.exampleRequest && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Example Request</h3>
                        <JsonDisplay content={agent.exampleRequest} />
                      </div>
                    )}
                    
                    {agent.exampleResponse && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Example Response</h3>
                        <JsonDisplay content={agent.exampleResponse} />
                      </div>
                    )}
                    
                    {agent.documentationUrl && (
                      <div className="mt-4">
                        <a 
                          href={agent.documentationUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 inline-flex items-center"
                        >
                          <span>View Full Documentation</span>
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Agent Information</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Categories</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {agent.tags.map((tag) => (
                      <Link 
                        key={tag} 
                        to={`/discover?category=${tag}`}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-600 hover:bg-primary-100"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Version</h3>
                  <p className="mt-1 text-gray-900">{agent.version}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created</h3>
                  <p className="mt-1 text-gray-900 flex items-center">
                    <Clock className="h-4 w-4 inline mr-1 text-gray-500" />
                    {new Date(agent.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                  <p className="mt-1 text-gray-900 flex items-center">
                    <Clock className="h-4 w-4 inline mr-1 text-gray-500" />
                    {new Date(agent.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {agent.metrics && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Performance Metrics</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agent.metrics.performance !== undefined && (
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-500">Performance</span>
                        <span className="text-sm font-medium text-gray-900">{agent.metrics.performance}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${agent.metrics.performance}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {agent.metrics.reliability !== undefined && (
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-500">Reliability</span>
                        <span className="text-sm font-medium text-gray-900">{agent.metrics.reliability}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${agent.metrics.reliability}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {agent.metrics.latency !== undefined && (
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-500">Latency</span>
                        <span className="text-sm font-medium text-gray-900">{agent.metrics.latency} ms</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-amber-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (agent.metrics.latency / 10))}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {agent.demoUrl && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Resources</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <a 
                    href={agent.demoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center text-gray-700 hover:text-primary-600"
                  >
                    <Globe className="h-5 w-5 mr-2" />
                    <span>Live Demo</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentDetail;