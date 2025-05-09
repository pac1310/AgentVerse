import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ArrowLeft, Plus, Upload, X, RefreshCw } from 'lucide-react';
import { agentCapabilities, agentCategories } from '../data/agents';
import { createAgent } from '../lib/agentService';
import { generateAgentDescription } from '../lib/huggingfaceService';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];

const agentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  version: z.string().min(1, 'Version is required'),
  description: z.string().min(1, 'Description is required'),
  detailedDescription: z.string().min(1, 'Agent Search Enhancement Text is required'),
  inputFormat: z.string().min(1, 'Input format is required'),
  outputFormat: z.string().min(1, 'Output format is required'),
  capabilities: z.array(z.string()).min(1, 'Select at least one capability'),
  categories: z.array(z.string()).min(1, 'Select at least one category'),
  dependencies: z.array(z.string()).optional(),
  performanceScore: z.number().min(0).max(100).optional(),
  reliabilityScore: z.number().min(0).max(100).optional(),
  latency: z.number().min(0).optional(),
  documentationUrl: z.string().url().optional().or(z.literal('')),
  demoUrl: z.string().url().optional().or(z.literal('')),
  apiEndpoint: z.string().optional().or(z.literal('')),
  exampleRequest: z.string().optional().or(z.literal('')),
  exampleResponse: z.string().optional().or(z.literal('')),
});

type AgentFormData = z.infer<typeof agentSchema>;

const AgentRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [dependencyFields, setDependencyFields] = useState<number[]>([0]);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema),
  });

  // Watch key fields for auto-generating the detailed description
  const watchedName = watch('name');
  const watchedDescription = watch('description');
  const watchedCapabilities = watch('capabilities');
  const watchedCategories = watch('categories');
  const watchedInputFormat = watch('inputFormat');
  const watchedOutputFormat = watch('outputFormat');

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLogoError(null);

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setLogoError('File must be an image (JPG, PNG, or SVG)');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setLogoError('File size must be less than 2MB');
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setLogoError(null);
  };
  
  // Auto-generate detailed description when basic fields are filled
  const generateDetailedDescription = async () => {
    if (!watchedName || !watchedDescription || !watchedInputFormat || !watchedOutputFormat ||
        !watchedCapabilities?.length || !watchedCategories?.length) {
      return;
    }

    setIsGeneratingDescription(true);
    try {
      const tempAgent: any = {
        id: 'temp',
        name: watchedName,
        description: watchedDescription,
        logo: 'brain',
        capabilities: watchedCapabilities || [],
        inputFormat: watchedInputFormat,
        outputFormat: watchedOutputFormat,
        version: watch('version') || '1.0.0',
        creator: 'New User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: watchedCategories || [],
      };
      
      const detailedDescription = await generateAgentDescription(tempAgent);
      setValue('detailedDescription', detailedDescription);
    } catch (error) {
      console.error('Error generating detailed description:', error);
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleManualGenerate = async () => {
    await generateDetailedDescription();
  };

  const onSubmit = async (data: AgentFormData) => {
    setSubmitError(null);
    
    try {
      // Transform form data to agent format
      const agentData = {
        name: data.name,
        description: data.description,
        detailedDescription: data.detailedDescription,
        version: data.version,
        inputFormat: data.inputFormat,
        outputFormat: data.outputFormat,
        capabilities: data.capabilities,
        tags: data.categories,
        dependencies: data.dependencies,
        metrics: {
          performance: data.performanceScore,
          reliability: data.reliabilityScore,
          latency: data.latency,
        },
        documentationUrl: data.documentationUrl,
        demoUrl: data.demoUrl,
        apiEndpoint: data.apiEndpoint,
        exampleRequest: data.exampleRequest,
        exampleResponse: data.exampleResponse,
      };

      // Use the agent service to create the agent
      await createAgent(agentData, logoFile || undefined);
      
      // Navigate to discover page
      navigate('/discover');
    } catch (error) {
      console.error('Error registering agent:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to register agent. Please try again.');
    }
  };

  const addDependency = () => {
    setDependencyFields([...dependencyFields, dependencyFields.length]);
  };

  const removeDependency = (index: number) => {
    setDependencyFields(dependencyFields.filter((_, i) => i !== index));
  };

  return (
    <div className="animate-in space-y-8 max-w-4xl mx-auto">
      <div>
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900">Register a New Agent</h1>
        <p className="text-gray-600 mt-2">
          Share your AI agent with the community and help others solve their challenges
        </p>
      </div>
      
      {submitError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {submitError}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            <p className="text-gray-500 text-sm mt-1">
              Provide essential details about your agent
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Agent Name"
                  placeholder="Enter agent name"
                  error={errors.name?.message}
                  {...register('name')}
                />
                
                <Input
                  label="Version"
                  placeholder="e.g., 1.0.0"
                  error={errors.version?.message}
                  {...register('version')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  placeholder="Describe what your agent does and its key features"
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-error-500">{errors.description.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agent Logo
                </label>
                <div className="flex items-center justify-center w-full">
                  {logoPreview ? (
                    <div className="relative w-full h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="logo-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">SVG, PNG, or JPG (max. 2MB)</p>
                      </div>
                      <input
                        id="logo-upload"
                        type="file"
                        className="hidden"
                        accept={ACCEPTED_IMAGE_TYPES.join(',')}
                        onChange={handleLogoChange}
                      />
                    </label>
                  )}
                </div>
                {logoError && (
                  <p className="mt-1 text-sm text-error-500">{logoError}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories
                  </label>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {agentCategories.map((category) => (
                      <div key={category.id} className="flex items-center">
                        <input
                          type="checkbox"
                          value={category.id}
                          {...register('categories')}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.categories && (
                    <p className="mt-1 text-sm text-error-500">{errors.categories.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capabilities
                  </label>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {agentCapabilities.map((capability) => (
                      <div key={capability} className="flex items-center">
                        <input
                          type="checkbox"
                          value={capability}
                          {...register('capabilities')}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                          {capability}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.capabilities && (
                    <p className="mt-1 text-sm text-error-500">{errors.capabilities.message}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Input Format
                  </label>
                  <textarea
                    {...register('inputFormat')}
                    rows={3}
                    placeholder="Describe the required input format (e.g., JSON structure, text, etc.)"
                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {errors.inputFormat && (
                    <p className="mt-1 text-sm text-error-500">{errors.inputFormat.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Output Format
                  </label>
                  <textarea
                    {...register('outputFormat')}
                    rows={3}
                    placeholder="Describe the expected output format (e.g., JSON structure, text, etc.)"
                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {errors.outputFormat && (
                    <p className="mt-1 text-sm text-error-500">{errors.outputFormat.message}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardHeader className="border-t border-gray-200 mt-8">
            <h2 className="text-xl font-semibold text-gray-900">Integration</h2>
            <p className="text-gray-500 text-sm mt-1">
              Provide information on how to integrate with your agent
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              <div>
                <Input
                  label="API Endpoint"
                  placeholder="e.g., https://api.example.com/agents/{id}/invoke"
                  helperText="The endpoint to call your agent"
                  {...register('apiEndpoint')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Example Request
                </label>
                <textarea
                  {...register('exampleRequest')}
                  rows={5}
                  placeholder={`{\n  "input": "Your input data here",\n  "options": {\n    "temperature": 0.7\n  }\n}`}
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-mono placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Provide an example JSON request for your agent
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Example Response
                </label>
                <textarea
                  {...register('exampleResponse')}
                  rows={5}
                  placeholder={`{\n  "result": {\n    // Agent-specific output structure\n  },\n  "usage": {\n    "total_tokens": 125,\n    "processing_time_ms": 230\n  }\n}`}
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-mono placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Provide an example JSON response from your agent
                </p>
              </div>
            </div>
          </CardContent>
          
          <CardHeader className="border-t border-gray-200 mt-8">
            <h2 className="text-xl font-semibold text-gray-900">Advanced Configuration</h2>
            <p className="text-gray-500 text-sm mt-1">
              Additional details to help users understand and use your agent effectively
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dependencies
                </label>
                <div className="space-y-2">
                  {dependencyFields.map((fieldIndex, index) => (
                    <div key={fieldIndex} className="flex items-center space-x-2">
                      <Input
                        placeholder="e.g., tensorflow"
                        {...register(`dependencies.${index}` as any)}
                      />
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeDependency(index)}
                          icon={<X className="h-4 w-4" />}
                        />
                      )}
                      {index === dependencyFields.length - 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addDependency}
                          icon={<Plus className="h-4 w-4" />}
                        >
                          Add
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Performance Score (%)"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g., 95"
                  helperText="Model performance benchmark"
                  {...register('performanceScore', { valueAsNumber: true })}
                />
                
                <Input
                  label="Reliability Score (%)"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g., 99"
                  helperText="System uptime and reliability"
                  {...register('reliabilityScore', { valueAsNumber: true })}
                />
                
                <Input
                  label="Average Latency (ms)"
                  type="number"
                  min="0"
                  placeholder="e.g., 250"
                  helperText="Average response time"
                  {...register('latency', { valueAsNumber: true })}
                />
              </div>
              
              <div>
                <Input
                  label="Documentation URL"
                  placeholder="https://..."
                  type="url"
                  error={errors.documentationUrl?.message}
                  {...register('documentationUrl')}
                />
              </div>
              
              <div>
                <Input
                  label="Demo Application URL"
                  placeholder="https://..."
                  type="url"
                  helperText="Link to a live demo of your agent"
                  error={errors.demoUrl?.message}
                  {...register('demoUrl')}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Agent Search Enhancement Text
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleManualGenerate}
                    icon={<RefreshCw className={`h-4 w-4 ${isGeneratingDescription ? 'animate-spin' : ''}`} />}
                    disabled={isGeneratingDescription || !watchedName || !watchedDescription}
                  >
                    {isGeneratingDescription ? 'Generating...' : 'Generate'}
                  </Button>
                </div>
                <textarea
                  {...register('detailedDescription')}
                  rows={6}
                  placeholder="This field automatically generates optimized keywords and phrases that help others discover your agent in search results. These tags highlight your agent's key capabilities, specialties, and use cases without requiring manual keyword research."
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {errors.detailedDescription && (
                  <p className="mt-1 text-sm text-error-500">{errors.detailedDescription.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  This AI-generated text significantly improves the discoverability of your agent when users search for related capabilities.
                </p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="border-t border-gray-200 flex justify-between">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <div className="space-x-2">
              <Button 
                type="submit"
                isLoading={isSubmitting}
              >
                Register Agent
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AgentRegistration;