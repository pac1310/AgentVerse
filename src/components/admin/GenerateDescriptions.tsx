import React, { useState } from 'react';
import { generateAndUpdateDescriptions } from '../../lib/agentService';
import Button from '../ui/Button';
import { Card, CardContent } from '../ui/Card';

const GenerateDescriptions: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{count: number, success: boolean, message: string} | null>(null);

  const handleGenerateDescriptions = async () => {
    try {
      setIsGenerating(true);
      setResult(null);
      
      const count = await generateAndUpdateDescriptions();
      
      setResult({
        count,
        success: true,
        message: count > 0 
          ? `Successfully generated detailed descriptions for ${count} agents.` 
          : 'No agents found without detailed descriptions.'
      });
    } catch (error) {
      console.error('Error generating descriptions:', error);
      setResult({
        count: 0,
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Generate Detailed Agent Descriptions</h2>
        <p className="text-gray-600 mb-6">
          This utility uses the Hugging Face Inference API to generate detailed descriptions for agents 
          that don't already have one. The generated descriptions will be stored in the database.
        </p>
        
        <div className="flex items-center justify-between">
          <Button 
            variant="primary"
            disabled={isGenerating}
            onClick={handleGenerateDescriptions}
          >
            {isGenerating ? 'Generating...' : 'Generate Descriptions'}
          </Button>
          
          {result && (
            <div className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'} ml-4`}>
              {result.message}
            </div>
          )}
        </div>
        
        {isGenerating && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <div className="flex items-center">
              <div className="animate-spin inline-block w-4 h-4 border-2 border-gray-300 border-t-primary-600 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Generating detailed descriptions... This may take a while.</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GenerateDescriptions; 