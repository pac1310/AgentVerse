import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAgentIcon } from '../data/agents';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeft, Clock, Download, ExternalLink, Github, Globe, Heart, Share2, Star, Users } from 'lucide-react';
import { fetchAgentById } from '../lib/agentService';
import { Agent } from '../types/agent';

function formatJsonString(jsonString: string): string {
  try {
    const parsedJson = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
    return JSON.stringify(parsedJson, null, 2);
  } catch (e) {
    return jsonString;
  }
}

const tryParseJson = (str: string): boolean => {
  if (!str) return false;
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

const JsonDisplay = ({ content }: { content: string }) => {
  if (!content) return null;
  
  return (
    <pre className="mt-2 p-4 bg-gray-50 rounded-md overflow-auto text-sm whitespace-pre">
      <code className="language-json">
        {formatJsonString(content).split('\n').map((line, i) => {
          const keyValueRegex = /"([^"]+)":\s*("([^"]*)"|\{|\[|[0-9.]+|true|false|null)/g;
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
          
          return <div key={i} dangerouslySetInnerHTML={{ __html: highlightedLine }} />;
        })}
      </code>
    </pre>
  );
};

const AgentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadAgent = async () => {
      try {
        if (id) {
          setLoading(true);
          const data = await fetchAgentById(id);
          setAgent(data);
        }
      } catch (err) {
        console.error('Error loading agent:', err);
        setError('Failed to load agent details');
      } finally {
        setLoading(false);
      }
    };
    
    loadAgent();
  }, [id]);
  
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
        <p className="mt-2 text-gray-600">The agent you're looking for doesn't exist or has been removed.</p>
        <Link to="/discover">
          <Button className="mt-6">
            Back to Discovery
          </Button>
        </Link>
      </div>
    );
  }
  
  const AgentIcon = getAgentIcon(agent.logo);
  const isLogoUrl = agent.logo && typeof agent.logo === 'string' && agent.logo.startsWith('http');
  
  console.log('Agent data:', agent);
  console.log('Logo value:', agent.logo);
  console.log('Is logo URL:', isLogoUrl);
  
  return (
    <div className="animate-in space-y-8">
      <div>
        <Link 
          to="/discover" 
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Discovery
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-primary-50 text-primary-600 mr-4">
              {isLogoUrl ? (
                <img 
                  src={agent.logo} 
                  alt={agent.name} 
                  className="h-8 w-8 object-contain"
                  onError={(e) => {
                    console.error('Error loading image:', e);
                    e.currentTarget.src = ''; // Clear the src to prevent multiple error events
                    e.currentTarget.style.display = 'none'; // Hide the broken image
                    
                    // Check if parentNode exists before appending
                    if (e.currentTarget.parentNode) {
                      // Show the fallback icon
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
          
          <div className="flex flex-wrap gap-2">
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
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
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
              
              {agent.dependencies && (
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
                  <h3 className="text-sm font-medium text-gray-500 mb-2">API Endpoint</h3>
                  <div className="bg-gray-50 rounded-md p-3 font-mono text-sm overflow-x-auto">
                    {agent.apiEndpoint || `https://api.oneai.wdc.com/v1/agents/${agent.id}/invoke`}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Example Request</h3>
                  <div className="bg-gray-50 rounded-md p-3 font-mono text-sm overflow-x-auto">
                    {agent.exampleRequest ? (
                      tryParseJson(agent.exampleRequest) ? (
                        <JsonDisplay content={agent.exampleRequest} />
                      ) : (
                        <pre className="whitespace-pre-wrap">{agent.exampleRequest}</pre>
                      )
                    ) : (
                      <pre className="whitespace-pre-wrap">{`POST /v1/agents/${agent.id}/invoke HTTP/1.1
Host: api.oneai.wdc.com
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "input": "Your input data here",
  "options": {
    "temperature": 0.7,
    "max_tokens": 150
  }
}`}</pre>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Example Response</h3>
                  <div className="bg-gray-50 rounded-md p-3 font-mono text-sm overflow-x-auto">
                    {agent.exampleResponse ? (
                      tryParseJson(agent.exampleResponse) ? (
                        <JsonDisplay content={agent.exampleResponse} />
                      ) : (
                        <pre className="whitespace-pre-wrap">{agent.exampleResponse}</pre>
                      )
                    ) : (
                      <pre className="whitespace-pre-wrap">{`{
  "result": {
    // Agent-specific output structure
  },
  "usage": {
    "total_tokens": 125,
    "processing_time_ms": 230
  }
}`}</pre>
                    )}
                  </div>
                </div>
                
                <div className="pt-4">
                  {agent.documentationUrl ? (
                    <a 
                      href={agent.documentationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button 
                        variant="outline" 
                        icon={<ExternalLink className="h-4 w-4" />}
                      >
                        View Complete Documentation
                      </Button>
                    </a>
                  ) : (
                    <Button 
                      variant="outline" 
                      icon={<ExternalLink className="h-4 w-4" />}
                      disabled
                    >
                      Documentation Unavailable
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Information</h3>
              
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Version</dt>
                  <dd className="mt-1 text-sm text-gray-900">{agent.version}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">{new Date(agent.createdAt).toLocaleDateString()}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900">{new Date(agent.updatedAt).toLocaleDateString()}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Categories</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <div className="flex flex-wrap gap-2">
                      {agent.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize"
                        >
                          {tag.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          {agent.metrics && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                
                <div className="space-y-4">
                  {Object.entries(agent.metrics).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {typeof value === 'number' ? (
                            key === 'latency' ? `${value}ms` : `${value}%`
                          ) : value}
                        </span>
                      </div>
                      {typeof value === 'number' && key !== 'latency' && (
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full" 
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {agent.usage && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Statistics</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Users className="h-5 w-5 mx-auto text-gray-500" />
                    <div className="mt-2 text-2xl font-semibold text-gray-900">
                      {new Intl.NumberFormat().format(agent.usage.count)}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">Total Usages</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Clock className="h-5 w-5 mx-auto text-gray-500" />
                    <div className="mt-2 text-2xl font-semibold text-gray-900">
                      {new Date(agent.usage.lastUsed).toLocaleDateString()}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">Last Used</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
              
              <ul className="space-y-3">
                {agent.documentationUrl && (
                  <li>
                    <a 
                      href={agent.documentationUrl}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Documentation
                    </a>
                  </li>
                )}
                <li>
                  <a 
                    href="#" 
                    className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    Source Code
                  </a>
                </li>
                {agent.demoUrl && (
                  <li>
                    <a 
                      href={agent.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Demo Site
                    </a>
                  </li>
                )}
                <li>
                  <a 
                    href="#" 
                    className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Rating & Reviews
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgentDetail;