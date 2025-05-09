import { Agent } from '../types/agent';

// Using a more sophisticated model that's better at generating detailed descriptions
const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1';
// Using environment variable (this would be defined in .env.local file)
const HF_API_KEY = import.meta.env.VITE_HUGGING_FACE_API_KEY || 'hf_mock_api_key_for_development';

/**
 * Generates a detailed description for an agent using Hugging Face's inference API
 */
export async function generateAgentDescription(agent: Agent): Promise<string> {
  try {
    // Create a prompt based on the agent's properties
    const capabilities = agent.capabilities.join(', ');
    const tags = agent.tags.join(', ');
    
    const prompt = `<s>[INST] You are a technical writer specializing in AI systems. 
Write a detailed, professional description for an AI agent with the following properties:

Name: ${agent.name}
Short Description: ${agent.description}
Capabilities: ${capabilities}
Categories: ${tags}
Input Format: ${agent.inputFormat}
Output Format: ${agent.outputFormat}

The description should be 3-4 paragraphs, explaining what the agent does, its key capabilities, how it works, and potential use cases. 
It should be informative, accurate, and professional.
Your response should ONLY contain the detailed description text, with no additional formatting or metadata. [/INST]</s>`;

    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.95,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      console.error('HF API Response status:', response.status);
      const errorText = await response.text();
      console.error('HF API Error:', errorText);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    
    // Extract the generated text from the response
    let generatedText = '';
    if (Array.isArray(result)) {
      generatedText = result[0]?.generated_text || '';
    } else if (typeof result === 'object') {
      generatedText = result.generated_text || '';
    } else if (typeof result === 'string') {
      generatedText = result;
    }
      
    // Clean up and format the text
    generatedText = generatedText
      .replace(/^(\s*<s>|\s*\[\/INST\]\s*)/g, '') // Remove any model artifacts
      .replace(/(<\/s>|\[INST\]).*$/g, '') // Remove anything after end token
      .trim();
    
    return generatedText || fallbackDescription(agent);
  } catch (error) {
    console.error('Error generating description via Hugging Face API:', error);
    return fallbackDescription(agent);
  }
}

/**
 * Generates a fallback description if the API call fails
 */
function fallbackDescription(agent: Agent): string {
  return `${agent.name} is an AI agent that ${agent.description.toLowerCase()}. It specializes in ${agent.tags.join(', ')} tasks and offers capabilities including ${agent.capabilities.join(', ')}. 

This agent accepts input in ${agent.inputFormat} format and provides output in ${agent.outputFormat} format. It can be integrated into various workflows to automate and enhance processes related to ${agent.tags[0] || 'AI'} tasks.

${agent.name} is designed to be efficient, reliable, and easy to use, making it an excellent choice for organizations looking to leverage AI for their ${agent.tags.join(' and ')} needs.`;
} 