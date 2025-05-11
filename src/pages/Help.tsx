import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { HelpCircle, Mail, MessageSquare, Github, ExternalLink, FileText, Users, Book, ArrowRight, Check, AlertTriangle, X, Upload, Send } from 'lucide-react';
import Button from '../components/ui/Button';

// Issue categories for the dropdown
const ISSUE_CATEGORIES = [
  'Agent functionality',
  'Platform UI/UX',
  'API integration',
  'Authentication issues',
  'Performance problems',
  'Feature requests',
  'Other'
];

const Help: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('contact');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    title: '',
    category: ISSUE_CATEGORIES[0],
    description: '',
    steps: '',
    expected: '',
    actual: '',
    browser: '',
    email: ''
  });

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  };

  const openForm = () => {
    setIsFormOpen(true);
    setIsSuccess(false);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setIsSuccess(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset form data
      setFormData({
        title: '',
        category: ISSUE_CATEGORIES[0],
        description: '',
        steps: '',
        expected: '',
        actual: '',
        browser: '',
        email: ''
      });
      
      // Close form after showing success message for 2 seconds
      setTimeout(() => {
        setIsFormOpen(false);
        setIsSuccess(false);
      }, 2000);
    }, 1000);
  };

  return (
    <div className="animate-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-600 mt-2">
          Get help with the OneAI Agent Discovery Platform
        </p>
      </div>

      {/* Table of contents navigation */}
      <div className="flex gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        <button
          onClick={() => handleSectionClick('contact')}
          className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
            activeSection === 'contact' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Contact Us
        </button>
        <button
          onClick={() => handleSectionClick('faq')}
          className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
            activeSection === 'faq' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Common Questions
        </button>
        <button
          onClick={() => handleSectionClick('community')}
          className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
            activeSection === 'community' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Community
        </button>
        <button
          onClick={() => handleSectionClick('issue')}
          className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
            activeSection === 'issue' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Report an Issue
        </button>
      </div>

      <div id="contact" className="space-y-8 pt-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Mail className="mr-2 h-6 w-6 text-primary-600" />
          Contact Support
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Technical Support</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                For technical issues, integration questions, or troubleshooting help, please contact our technical support team.
              </p>
              <div className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-200">
                <Mail className="h-5 w-5 text-primary-600 mr-3" />
                <a href="mailto:support@oneai.com" className="text-primary-600 hover:underline">
                  support@oneai.com
                </a>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Response time: Within 24 hours on business days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Account & Billing</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                For questions about your account, subscription plans, or billing inquiries, please contact our customer service team.
              </p>
              <div className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-200">
                <Mail className="h-5 w-5 text-primary-600 mr-3" />
                <a href="mailto:billing@oneai.com" className="text-primary-600 hover:underline">
                  billing@oneai.com
                </a>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Response time: Within 48 hours on business days
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Schedule a Consultation</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Need personalized help with integrating agents or setting up your project? Schedule a consultation with our team of AI specialists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 p-4 border border-gray-200 rounded-md">
                <h4 className="font-medium text-gray-900 mb-2">Technical Consultation</h4>
                <p className="text-sm text-gray-700 mb-4">Get help with API integration, agent customization, and technical implementation.</p>
                <Button variant="outline" className="w-full">
                  Schedule Call
                </Button>
              </div>
              <div className="flex-1 p-4 border border-gray-200 rounded-md">
                <h4 className="font-medium text-gray-900 mb-2">Strategy Consultation</h4>
                <p className="text-sm text-gray-700 mb-4">Learn how to best leverage AI agents for your specific business use case.</p>
                <Button variant="outline" className="w-full">
                  Schedule Call
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div id="faq" className="space-y-8 pt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <HelpCircle className="mr-2 h-6 w-6 text-primary-600" />
          Common Questions
        </h2>

        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              <div className="p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-2">How do I integrate an agent into my application?</h4>
                <p className="text-gray-700">
                  Each agent has an API endpoint that you can call from your application. On the agent detail page, you'll find 
                  integration examples, API documentation, and code snippets for various programming languages. You can also 
                  check the Documentation page for comprehensive integration guides.
                </p>
              </div>
              <div className="p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-2">What are the rate limits for agent API calls?</h4>
                <p className="text-gray-700">
                  Free tier accounts have a limit of 1,000 API calls per month across all agents. Paid plans offer higher limits 
                  based on your subscription level. Individual agents may have additional rate limits to ensure platform stability. 
                  You can view your current usage on the Dashboard.
                </p>
              </div>
              <div className="p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-2">How do I register my own agent?</h4>
                <p className="text-gray-700">
                  To register your own agent, go to the Registration page and provide information about your agent, including its 
                  name, description, capabilities, and API endpoint details. Your agent will be reviewed by our team before being 
                  published to the platform.
                </p>
              </div>
              <div className="p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Can I update an agent after registration?</h4>
                <p className="text-gray-700">
                  Yes, you can update your agent's information at any time by going to the agent's detail page and clicking the 
                  "Edit Agent" button. You can update all fields including the description, capabilities, and endpoint information.
                </p>
              </div>
              <div className="p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-2">What's the difference between capabilities and categories?</h4>
                <p className="text-gray-700">
                  Categories are broad classifications that help organize agents by their general purpose (e.g., Text Processing, 
                  Vision & Image). Capabilities are specific functions that an agent can perform (e.g., Sentiment Analysis, 
                  Translation). An agent can belong to one category but have multiple capabilities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div id="community" className="space-y-8 pt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Users className="mr-2 h-6 w-6 text-primary-600" />
          Community Resources
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <div className="p-2 bg-primary-50 text-primary-600 rounded-md mr-2">
                  <MessageSquare className="h-5 w-5" />
                </div>
                Discussion Forum
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Connect with other OneAI users, share your experiences, and get help from the community.
              </p>
              <a 
                href="https://community.oneai.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-primary-600 hover:underline"
              >
                <span>Visit the Forum</span>
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <div className="p-2 bg-primary-50 text-primary-600 rounded-md mr-2">
                  <Github className="h-5 w-5" />
                </div>
                GitHub Repository
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Explore our open-source SDKs, contribute to the project, and report technical issues.
              </p>
              <a 
                href="https://github.com/oneai" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-primary-600 hover:underline"
              >
                <span>Visit GitHub</span>
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <div className="p-2 bg-primary-50 text-primary-600 rounded-md mr-2">
                  <Book className="h-5 w-5" />
                </div>
                Knowledge Base
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Find tutorials, guides, and in-depth articles about using the OneAI platform.
              </p>
              <a 
                href="/docs" 
                className="flex items-center text-primary-600 hover:underline"
              >
                <span>Browse Documentation</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      <div id="issue" className="space-y-8 pt-8 pb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <AlertTriangle className="mr-2 h-6 w-6 text-primary-600" />
          Report an Issue
        </h2>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Issue Reporting</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-6">
              If you've encountered a technical issue, bug, or have a feature request, please let us know so we can address it.
            </p>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-md p-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    What to Include
                  </h4>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li>• Detailed description of the issue</li>
                    <li>• Steps to reproduce the problem</li>
                    <li>• Expected vs. actual behavior</li>
                    <li>• Screenshots (if applicable)</li>
                    <li>• Error messages (if any)</li>
                    <li>• Browser/device information</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-md p-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <FileText className="h-5 w-5 text-primary-600 mr-2" />
                    Issue Categories
                  </h4>
                  <ul className="text-gray-700 text-sm space-y-2">
                    {ISSUE_CATEGORIES.map((category, index) => (
                      <li key={index}>• {category}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="primary" className="w-full md:w-auto" onClick={openForm}>
                  Submit an Issue Report
                </Button>
                <p className="text-sm text-gray-600 mt-3">
                  For urgent issues affecting your production environment, please email <a href="mailto:urgent@oneai.com" className="text-primary-600 hover:underline">urgent@oneai.com</a>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issue Report Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary-600" />
                Issue Report Form
              </h3>
              <button 
                onClick={closeForm}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isSuccess ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <Check className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-medium text-gray-900 mb-2">Thank You for Your Report</h4>
                <p className="text-gray-600">
                  Your issue has been submitted successfully. Our team will review it shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Title*
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Brief description of the issue"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Category*
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  >
                    {ISSUE_CATEGORIES.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Detailed Description*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Please provide a comprehensive description of the issue"
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="steps" className="block text-sm font-medium text-gray-700 mb-1">
                    Steps to Reproduce
                  </label>
                  <textarea
                    id="steps"
                    name="steps"
                    rows={3}
                    value={formData.steps}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="1. Go to...&#10;2. Click on...&#10;3. Observe..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expected" className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Behavior
                    </label>
                    <textarea
                      id="expected"
                      name="expected"
                      rows={2}
                      value={formData.expected}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="What should have happened?"
                    ></textarea>
                  </div>

                  <div>
                    <label htmlFor="actual" className="block text-sm font-medium text-gray-700 mb-1">
                      Actual Behavior
                    </label>
                    <textarea
                      id="actual"
                      name="actual"
                      rows={2}
                      value={formData.actual}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="What actually happened?"
                    ></textarea>
                  </div>
                </div>

                <div>
                  <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
                    Attachments (Screenshots, Files)
                  </label>
                  <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      Drag and drop files here, or <span className="text-primary-600">browse</span>
                    </p>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="browser" className="block text-sm font-medium text-gray-700 mb-1">
                      Browser/Device Information
                    </label>
                    <input
                      id="browser"
                      name="browser"
                      type="text"
                      value={formData.browser}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Chrome 96, MacOS 12"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Email*
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="For follow-up communications"
                    />
                  </div>
                </div>

                <div className="flex gap-4 justify-end border-t border-gray-200 pt-4">
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={closeForm}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Report
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Help; 