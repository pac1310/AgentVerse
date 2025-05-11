import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { BookOpen, Code, Server, Database, Settings, Terminal, GitBranch, Users, ZapIcon, Zap, Shield, RefreshCw, FileText, Layout, Link as LinkIcon, ExternalLink, HelpCircle } from 'lucide-react';

const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('getting-started');

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="animate-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Documentation</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive guides and references for the OneAI Agent Discovery Platform
        </p>
      </div>

      {/* Table of contents navigation */}
      <div className="flex gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        <button
          onClick={() => handleSectionClick('getting-started')}
          className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
            activeSection === 'getting-started' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Getting Started
        </button>
        <button
          onClick={() => handleSectionClick('agent-models')}
          className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
            activeSection === 'agent-models' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Agent Models
        </button>
        <button
          onClick={() => handleSectionClick('api-reference')}
          className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
            activeSection === 'api-reference' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          API Reference
        </button>
        <button
          onClick={() => handleSectionClick('integration')}
          className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
            activeSection === 'integration' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Integration Guides
        </button>
        <button
          onClick={() => handleSectionClick('best-practices')}
          className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
            activeSection === 'best-practices' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Best Practices
        </button>
        <button
          onClick={() => handleSectionClick('faq')}
          className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
            activeSection === 'faq' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          FAQ
        </button>
      </div>

      <div id="getting-started" className="space-y-8 pt-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <BookOpen className="mr-2 h-6 w-6 text-primary-600" />
          Getting Started with OneAI
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Platform Overview</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                OneAI is a comprehensive platform for discovering, managing, and integrating AI agents into your applications.
                The platform allows you to browse existing agents, register new ones, and track their performance.
              </p>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-primary-500 mr-2">
                    <Zap className="h-5 w-5" />
                  </div>
                  <p className="text-gray-700">Discover and evaluate AI agents from our marketplace</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-primary-500 mr-2">
                    <Zap className="h-5 w-5" />
                  </div>
                  <p className="text-gray-700">Register your own agents and share them with the community</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-primary-500 mr-2">
                    <Zap className="h-5 w-5" />
                  </div>
                  <p className="text-gray-700">Track usage, performance metrics, and integrate via REST APIs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Quick Start Guide</h3>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 space-y-3 text-gray-700">
                <li>
                  <span className="font-medium">Browse the Discovery Page:</span> Explore available agents by category, capability, or search keywords.
                </li>
                <li>
                  <span className="font-medium">Register an Agent:</span> Go to the Registration page to add your own agent to the platform with detailed specifications.
                </li>
                <li>
                  <span className="font-medium">Integration:</span> Use the API endpoints provided on each agent detail page to integrate with your applications.
                </li>
                <li>
                  <span className="font-medium">Monitor Performance:</span> Track usage metrics and performance on your Dashboard.
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Authentication & Authorization</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              OneAI uses a secure authentication system to protect your agents and data. Here's how to get started with authentication:
            </p>
            <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-2">Authentication Flow:</p>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                <li>Create an account on the OneAI platform</li>
                <li>Generate API keys from your account settings</li>
                <li>Use these keys for API requests with the Authorization header</li>
              </ol>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-2">API Key Example:</p>
              <pre className="bg-gray-800 text-gray-100 p-3 rounded-md text-sm overflow-x-auto">
                <code>
                  {`// Example API request with authentication
fetch('https://api.oneai.com/v1/agents', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})`}
                </code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      <div id="agent-models" className="space-y-8 pt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Database className="mr-2 h-6 w-6 text-primary-600" />
          Agent Models
        </h2>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Agent Structure</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Each agent in the OneAI platform follows a consistent structure with defined fields and capabilities.
            </p>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
              <p className="text-sm font-medium text-gray-900 mb-2">Agent Schema:</p>
              <pre className="bg-gray-800 text-gray-100 p-3 rounded-md text-sm overflow-x-auto">
                <code>
                  {`{
  "id": "string",          // Unique identifier
  "name": "string",        // Display name
  "description": "string", // Short description
  "detailedDescription": "string", // Comprehensive description
  "logo": "string",        // Logo identifier or URL
  "capabilities": ["string"], // Array of capabilities
  "inputFormat": "string", // Expected input format
  "outputFormat": "string", // Expected output format
  "version": "string",     // Version number
  "creator": "string",     // Creator identifier
  "createdAt": "string",   // Creation timestamp
  "updatedAt": "string",   // Last update timestamp
  "tags": ["string"],      // Category tags
  "metrics": {             // Performance metrics
    "performance": number,
    "reliability": number,
    "latency": number
  },
  "dependencies": ["string"], // Required dependencies
  "documentationUrl": "string", // URL to documentation
  "demoUrl": "string",     // URL to demo
  "apiEndpoint": "string", // API endpoint for integration
  "exampleRequest": "string", // Example API request
  "exampleResponse": "string"  // Example API response
}`}
                </code>
              </pre>
            </div>
            <p className="text-gray-700">
              Understanding this structure helps you navigate agent details and create new agents that fit seamlessly into the platform.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Agent Categories</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Agents are organized into categories based on their primary functions and use cases:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="h-6 w-6 text-primary-500 mr-2 flex-shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Text Processing</span>
                    <p className="text-sm text-gray-700">Agents specializing in text analysis, generation, and manipulation</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 text-primary-500 mr-2 flex-shrink-0">
                    <Layout className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Vision & Image</span>
                    <p className="text-sm text-gray-700">Agents for image recognition, processing, and generation</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 text-primary-500 mr-2 flex-shrink-0">
                    <Database className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Data Analysis</span>
                    <p className="text-sm text-gray-700">Agents for data processing, analytics, and insights</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 text-primary-500 mr-2 flex-shrink-0">
                    <Code className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Code & Development</span>
                    <p className="text-sm text-gray-700">Agents that assist with coding, debugging, and development</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Agent Capabilities</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Agents are defined by their capabilities, which specify what tasks they can perform:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <span className="font-medium text-gray-900 text-sm">Text Generation</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <span className="font-medium text-gray-900 text-sm">Sentiment Analysis</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <span className="font-medium text-gray-900 text-sm">Image Recognition</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <span className="font-medium text-gray-900 text-sm">Code Generation</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <span className="font-medium text-gray-900 text-sm">Data Visualization</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <span className="font-medium text-gray-900 text-sm">Translation</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <span className="font-medium text-gray-900 text-sm">Summarization</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <span className="font-medium text-gray-900 text-sm">Question Answering</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div id="api-reference" className="space-y-8 pt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Code className="mr-2 h-6 w-6 text-primary-600" />
          API Reference
        </h2>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">REST API Endpoints</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-6">
              The OneAI platform provides a comprehensive REST API for interacting with agents programmatically.
            </p>
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center mb-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium mr-2">GET</span>
                  <code className="text-gray-900 font-medium">/v1/agents</code>
                </div>
                <p className="text-gray-700 text-sm mb-2">List all available agents with optional filtering</p>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <p className="text-xs font-medium text-gray-900 mb-1">Parameters:</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li><code>category</code> - Filter by category</li>
                    <li><code>capability</code> - Filter by capability</li>
                    <li><code>search</code> - Search term for agent name/description</li>
                    <li><code>limit</code> - Maximum number of results (default: 20)</li>
                  </ul>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center mb-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium mr-2">GET</span>
                  <code className="text-gray-900 font-medium">/v1/agents/{'{agent_id}'}</code>
                </div>
                <p className="text-gray-700 text-sm mb-2">Get detailed information about a specific agent</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center mb-2">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-medium mr-2">POST</span>
                  <code className="text-gray-900 font-medium">/v1/agents</code>
                </div>
                <p className="text-gray-700 text-sm mb-2">Register a new agent</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center mb-2">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium mr-2">PUT</span>
                  <code className="text-gray-900 font-medium">/v1/agents/{'{agent_id}'}</code>
                </div>
                <p className="text-gray-700 text-sm mb-2">Update an existing agent</p>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-medium mr-2">POST</span>
                  <code className="text-gray-900 font-medium">/v1/agents/{'{agent_id}'}/invoke</code>
                </div>
                <p className="text-gray-700 text-sm mb-2">Invoke an agent with specific input data</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">API Usage Example</h3>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-2">Example: Invoking an Agent</p>
              <pre className="bg-gray-800 text-gray-100 p-3 rounded-md text-sm overflow-x-auto">
                <code>
                  {`// JavaScript example using fetch
const response = await fetch('https://api.oneai.com/v1/agents/text-analyzer/invoke', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: "This is a sample text to analyze.",
    options: {
      include_sentiment: true,
      include_entities: true
    }
  })
});

const result = await response.json();
console.log(result);
/*
{
  "sentiment": "positive",
  "score": 0.78,
  "entities": [
    { "text": "sample text", "type": "WORK_OF_ART" }
  ]
}
*/`}
                </code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      <div id="integration" className="space-y-8 pt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Server className="mr-2 h-6 w-6 text-primary-600" />
          Integration Guides
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <div className="p-2 bg-primary-50 text-primary-600 rounded-md mr-2">
                  <Code className="h-5 w-5" />
                </div>
                JavaScript
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Integrate OneAI agents with JavaScript and Node.js applications.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-primary-600 text-sm font-medium">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  <a href="#" className="hover:underline">JavaScript SDK Documentation</a>
                </div>
                <div className="flex items-center text-primary-600 text-sm font-medium">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  <a href="#" className="hover:underline">React Integration Guide</a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <div className="p-2 bg-primary-50 text-primary-600 rounded-md mr-2">
                  <Terminal className="h-5 w-5" />
                </div>
                Python
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Use OneAI agents in Python applications and data pipelines.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-primary-600 text-sm font-medium">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  <a href="#" className="hover:underline">Python SDK Documentation</a>
                </div>
                <div className="flex items-center text-primary-600 text-sm font-medium">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  <a href="#" className="hover:underline">Pandas Integration</a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <div className="p-2 bg-primary-50 text-primary-600 rounded-md mr-2">
                  <Server className="h-5 w-5" />
                </div>
                REST API
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Direct REST API integration for any programming language.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-primary-600 text-sm font-medium">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  <a href="#" className="hover:underline">OpenAPI Specification</a>
                </div>
                <div className="flex items-center text-primary-600 text-sm font-medium">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  <a href="#" className="hover:underline">Authentication Guide</a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Webhooks & Event Streaming</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Set up webhooks to receive real-time notifications about agent activities and updates.
            </p>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-2">Webhook Setup:</p>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                <li>Register your webhook URL in the platform settings</li>
                <li>Select events you want to subscribe to (e.g., agent.updated, agent.invoked)</li>
                <li>Implement an endpoint to receive and process webhook payloads</li>
                <li>Verify webhook signatures to ensure security</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>

      <div id="best-practices" className="space-y-8 pt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Settings className="mr-2 h-6 w-6 text-primary-600" />
          Best Practices
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Agent Creation</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="p-1 bg-primary-50 text-primary-600 rounded-md mr-2 flex-shrink-0">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Provide Clear Descriptions</p>
                    <p className="text-gray-600 text-sm">Write concise but comprehensive descriptions that explain what your agent does and its specific use cases.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-1 bg-primary-50 text-primary-600 rounded-md mr-2 flex-shrink-0">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Document Input/Output Formats</p>
                    <p className="text-gray-600 text-sm">Clearly document the expected input format and what users should expect as output.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-1 bg-primary-50 text-primary-600 rounded-md mr-2 flex-shrink-0">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Include Example Requests</p>
                    <p className="text-gray-600 text-sm">Provide working examples that demonstrate how to use your agent effectively.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-1 bg-primary-50 text-primary-600 rounded-md mr-2 flex-shrink-0">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Tag Appropriately</p>
                    <p className="text-gray-600 text-sm">Use relevant categories and capability tags to make your agent discoverable.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Integration Best Practices</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="p-1 bg-primary-50 text-primary-600 rounded-md mr-2 flex-shrink-0">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Implement Proper Authentication</p>
                    <p className="text-gray-600 text-sm">Always use authentication tokens and never expose them in client-side code.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-1 bg-primary-50 text-primary-600 rounded-md mr-2 flex-shrink-0">
                    <RefreshCw className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Handle Rate Limiting</p>
                    <p className="text-gray-600 text-sm">Implement retry mechanisms with exponential backoff for rate limit errors.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-1 bg-primary-50 text-primary-600 rounded-md mr-2 flex-shrink-0">
                    <GitBranch className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Version Control</p>
                    <p className="text-gray-600 text-sm">Specify agent versions in production to avoid unexpected changes.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-1 bg-primary-50 text-primary-600 rounded-md mr-2 flex-shrink-0">
                    <LinkIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Implement Proper Error Handling</p>
                    <p className="text-gray-600 text-sm">Handle edge cases and provide fallbacks for when agent calls fail.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Performance Optimization</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Follow these guidelines to optimize performance when using AI agents:
            </p>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="p-1 bg-primary-50 text-primary-600 rounded-md mr-2 flex-shrink-0">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Batch Processing</p>
                  <p className="text-gray-600">For large datasets, use batch processing instead of individual API calls to reduce overhead.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-1 bg-primary-50 text-primary-600 rounded-md mr-2 flex-shrink-0">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Implement Caching</p>
                  <p className="text-gray-600">Cache responses for frequently requested data to improve performance and reduce API usage.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-1 bg-primary-50 text-primary-600 rounded-md mr-2 flex-shrink-0">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Use Webhooks for Async Operations</p>
                  <p className="text-gray-600">For long-running tasks, implement webhook callbacks instead of synchronous API calls.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-1 bg-primary-50 text-primary-600 rounded-md mr-2 flex-shrink-0">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Monitor Usage and Performance</p>
                  <p className="text-gray-600">Regularly review agent metrics to identify and address performance bottlenecks.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div id="faq" className="space-y-8 pt-8 pb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <HelpCircle className="mr-2 h-6 w-6 text-primary-600" />
          Frequently Asked Questions
        </h2>

        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              <div className="p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-2">What is an AI agent in the context of OneAI?</h4>
                <p className="text-gray-700">
                  In OneAI, an AI agent is a specialized service with defined capabilities, input/output formats, and performance metrics.
                  Agents can perform tasks like text analysis, image recognition, data processing, and more, accessible through a standard API.
                </p>
              </div>
              <div className="p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-2">How do I create my own agent?</h4>
                <p className="text-gray-700">
                  You can create your own agent by going to the Registration page and providing the required information about your agent,
                  including its name, description, capabilities, input/output formats, and API endpoint details.
                </p>
              </div>
              <div className="p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-2">What are the limitations on API usage?</h4>
                <p className="text-gray-700">
                  Free tier accounts have a limit of 1,000 API calls per month. Paid plans offer higher limits based on your subscription level.
                  All API calls are subject to rate limiting to ensure platform stability.
                </p>
              </div>
              <div className="p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Can I integrate agents into my existing applications?</h4>
                <p className="text-gray-700">
                  Yes, all agents on the platform can be integrated into your applications using our REST APIs. We provide SDKs for JavaScript,
                  Python, and other popular languages to simplify integration.
                </p>
              </div>
              <div className="p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-2">How are agent performance metrics calculated?</h4>
                <p className="text-gray-700">
                  Performance metrics are calculated based on several factors including response time, success rate, and user feedback. 
                  The platform continuously monitors these metrics to provide up-to-date information on agent performance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Documentation; 