import { supabase } from './supabase';
import { Agent, AgentCategory } from '../types/agent';
import { agentCategories as mockCategories } from '../data/agents';
import { generateAgentDescription } from './huggingfaceService';

// Extended Agent type that includes documentationUrl
interface AgentWithDocs extends Partial<Agent> {
  documentationUrl?: string;
  demoUrl?: string;
  apiEndpoint?: string;
  exampleRequest?: string;
  exampleResponse?: string;
}

// Function to fetch all agents from Supabase
export async function fetchAgents(): Promise<Agent[]> {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching agents:', error);
      return mockAgentsFromCategories();
    }

    // Transform Supabase data to Agent type
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      detailedDescription: item.detailed_description || '',
      logo: item.logo_url && item.logo_url.startsWith('http') 
        ? item.logo_url 
        : (item.logo_url || 'brain'), // Use actual URL if it's a URL, otherwise use icon name
      capabilities: item.capabilities || [],
      inputFormat: item.input_format || '',
      outputFormat: item.output_format || '',
      version: item.version,
      creator: item.creator_id || 'Unknown',
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      tags: item.categories || [],
      metrics: {
        performance: item.performance_score,
        reliability: item.reliability_score,
        latency: item.latency,
      },
      dependencies: item.dependencies || [],
      usage: {
        count: 0, // This would come from a separate usage tracking table
        lastUsed: new Date().toISOString(),
      },
      documentationUrl: item.documentation_url,
      demoUrl: item.demo_url,
      apiEndpoint: item.api_endpoint,
      exampleRequest: item.example_request,
      exampleResponse: item.example_response,
    }));
  } catch (err) {
    console.error('Error connecting to Supabase:', err);
    return mockAgentsFromCategories();
  }
}

// Mock function to generate agents based on categories when Supabase fails
function mockAgentsFromCategories(): Agent[] {
  // Create a few mock agents
  return mockCategories.map((category, index) => ({
    id: `mock-${index}`,
    name: `${category.name} Agent`,
    description: `A powerful agent for ${category.name.toLowerCase()} tasks`,
    logo: 'brain',
    capabilities: [agentCapabilities[index % agentCapabilities.length]],
    inputFormat: 'JSON or plain text',
    outputFormat: 'Structured JSON response',
    version: '1.0.0',
    creator: 'Mock User',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: [category.id],
    metrics: {
      performance: 90,
      reliability: 95,
      latency: 200,
    },
    dependencies: [],
    usage: {
      count: 0,
      lastUsed: new Date().toISOString(),
    },
    documentationUrl: undefined,
    demoUrl: undefined,
    apiEndpoint: undefined,
    exampleRequest: undefined,
    exampleResponse: undefined,
  }));
}

// Import mock capabilities
import { agentCapabilities } from '../data/agents';

// Function to fetch agent categories and counts
export async function fetchAgentCategories(): Promise<AgentCategory[]> {
  try {
    // First, fetch all agents to calculate category counts
    const agents = await fetchAgents();
    
    // Create a map to count occurrences of each category
    const categoryCounts = new Map<string, number>();
    
    // Count agents in each category
    agents.forEach(agent => {
      agent.tags.forEach(tag => {
        categoryCounts.set(tag, (categoryCounts.get(tag) || 0) + 1);
      });
    });
    
    // Map the mock categories with real counts
    return mockCategories.map(category => ({
      ...category,
      count: categoryCounts.get(category.id) || 0
    }));
  } catch (error) {
    console.error("Error fetching agent categories:", error);
    return mockCategories; // Fallback to mock data on error
  }
}

// Function to fetch a single agent by ID
export async function fetchAgentById(id: string): Promise<Agent | null> {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found error
        return null;
      }
      console.error('Error fetching agent:', error);
      throw error;
    }

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      detailedDescription: data.detailed_description || '',
      logo: data.logo_url && data.logo_url.startsWith('http')
        ? data.logo_url
        : (data.logo_url || 'brain'),
      capabilities: data.capabilities || [],
      inputFormat: data.input_format || '',
      outputFormat: data.output_format || '',
      version: data.version,
      creator: data.creator_id || 'Unknown',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      tags: data.categories || [],
      metrics: {
        performance: data.performance_score,
        reliability: data.reliability_score,
        latency: data.latency,
      },
      dependencies: data.dependencies || [],
      usage: {
        count: 0,
        lastUsed: new Date().toISOString(),
      },
      documentationUrl: data.documentation_url,
      demoUrl: data.demo_url,
      apiEndpoint: data.api_endpoint,
      exampleRequest: data.example_request,
      exampleResponse: data.example_response,
    };
  } catch (err) {
    console.error('Error connecting to Supabase:', err);
    return null;
  }
}

// Function to create a new agent
export async function createAgent(agentData: AgentWithDocs, logoFile?: File): Promise<Agent> {
  try {
    let logoUrl = null;

    // Upload logo if provided
    if (logoFile) {
      try {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

        console.log('Uploading file to Supabase Storage:', fileName);
        
        // Step 1: Check if the bucket exists
        try {
          // Check if the bucket exists
          const { data: buckets, error: listError } = await supabase.storage.listBuckets();
          
          if (listError) {
            console.error('Error listing buckets:', listError);
            throw listError;
          }
          
          const bucketExists = buckets.some(bucket => bucket.name === 'agent-logos');
          
          if (!bucketExists) {
            console.log('Creating agent-logos bucket...');
            const { error: createError } = await supabase.storage.createBucket('agent-logos', {
              public: true
            });
            
            if (createError) {
              console.error('Error creating bucket:', createError);
              throw createError;
            }
            
            // Set bucket to public
            const { error: updateError } = await supabase.storage.updateBucket('agent-logos', {
              public: true
            });
            
            if (updateError) {
              console.error('Error making bucket public:', updateError);
              throw updateError;
            }
          }
          
          // Step 2: Upload the file
          console.log('Uploading file to bucket...');
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('agent-logos')
            .upload(fileName, logoFile, {
              cacheControl: '3600',
              upsert: true,
              contentType: logoFile.type
            });
          
          if (uploadError) {
            console.error('Logo upload failed:', uploadError);
            throw uploadError;
          }
          
          // Step 3: Get the public URL
          console.log('Getting public URL...');
          const { data: urlData } = supabase.storage
            .from('agent-logos')
            .getPublicUrl(fileName);
          
          if (!urlData || !urlData.publicUrl) {
            throw new Error('Failed to get public URL');
          }
          
          console.log('Logo uploaded successfully, public URL:', urlData.publicUrl);
          logoUrl = urlData.publicUrl;
        } catch (storageError) {
          console.error('Storage operation error:', storageError);
          throw storageError;
        }
      } catch (logoError) {
        console.error('Logo handling error:', logoError);
        // Continue without logo
      }
    }

    console.log('Inserting agent with logo URL:', logoUrl);
    
    // Generate a detailed description using Hugging Face API
    let detailedDescription = agentData.detailedDescription;

    if (!detailedDescription) {
      try {
        console.log('Generating detailed description...');
        const tempAgent: Agent = {
          id: 'temp',
          name: agentData.name || '',
          description: agentData.description || '',
          logo: logoUrl || 'brain',
          capabilities: agentData.capabilities || [],
          inputFormat: agentData.inputFormat || '',
          outputFormat: agentData.outputFormat || '',
          version: agentData.version || '1.0.0',
          creator: 'Unknown',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: agentData.tags || [],
        };
        
        detailedDescription = await generateAgentDescription(tempAgent);
        console.log('Generated detailed description:', detailedDescription);
      } catch (err) {
        console.error('Error generating detailed description:', err);
        // Fallback to using the regular description if generation fails
        detailedDescription = agentData.description;
      }
    }

    // Insert agent data
    const { data, error } = await supabase
      .from('agents')
      .insert({
        name: agentData.name,
        description: agentData.description,
        detailed_description: detailedDescription,
        version: agentData.version,
        logo_url: logoUrl,
        input_format: agentData.inputFormat,
        output_format: agentData.outputFormat,
        capabilities: agentData.capabilities,
        categories: agentData.tags,
        dependencies: agentData.dependencies,
        performance_score: agentData.metrics?.performance,
        reliability_score: agentData.metrics?.reliability,
        latency: agentData.metrics?.latency,
        documentation_url: agentData.documentationUrl,
        demo_url: agentData.demoUrl,
        api_endpoint: agentData.apiEndpoint,
        example_request: agentData.exampleRequest,
        example_response: agentData.exampleResponse,
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting agent into Supabase:', error);
      throw new Error(`Failed to create agent: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from agent creation');
    }

    console.log('Agent created successfully with data:', data);
    
    // Return the newly created agent
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      detailedDescription: data.detailed_description || '',
      logo: data.logo_url && data.logo_url.startsWith('http')
        ? data.logo_url
        : (data.logo_url || 'brain'),
      capabilities: data.capabilities || [],
      inputFormat: data.input_format || '',
      outputFormat: data.output_format || '',
      version: data.version,
      creator: data.creator_id || 'Unknown',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      tags: data.categories || [],
      metrics: {
        performance: data.performance_score,
        reliability: data.reliability_score,
        latency: data.latency,
      },
      dependencies: data.dependencies || [],
      usage: {
        count: 0,
        lastUsed: new Date().toISOString(),
      },
      documentationUrl: data.documentation_url,
      demoUrl: data.demo_url,
      apiEndpoint: data.api_endpoint,
      exampleRequest: data.example_request,
      exampleResponse: data.example_response,
    };
  } catch (err) {
    console.error('Critical error in createAgent:', err);
    throw err;
  }
}

// Function to search agents
export async function searchAgents(query: string, filters: any = {}): Promise<Agent[]> {
  try {
    let queryBuilder = supabase
      .from('agents')
      .select('*');

    // Apply text search if provided
    if (query) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${query}%,description.ilike.%${query}%,detailed_description.ilike.%${query}%`
      );
    }

    // Apply category filters
    if (filters.categories && filters.categories.length > 0) {
      // This assumes categories are stored as an array in Supabase
      queryBuilder = queryBuilder.contains('categories', filters.categories);
    }

    // Apply capability filters
    if (filters.capabilities && filters.capabilities.length > 0) {
      // This assumes capabilities are stored as an array in Supabase
      queryBuilder = queryBuilder.contains('capabilities', filters.capabilities);
    }

    const { data, error } = await queryBuilder.order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching agents:', error);
      return mockAgentsFromCategories().filter(agent => {
        // Simple search filter for mock data
        if (query && !agent.name.toLowerCase().includes(query.toLowerCase()) && 
            !agent.description.toLowerCase().includes(query.toLowerCase())) {
          return false;
        }
        return true;
      });
    }

    // Transform to Agent type
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      detailedDescription: item.detailed_description || '',
      logo: item.logo_url && item.logo_url.startsWith('http') 
        ? item.logo_url 
        : (item.logo_url || 'brain'), // Use actual URL if it's a URL, otherwise use icon name
      capabilities: item.capabilities || [],
      inputFormat: item.input_format || '',
      outputFormat: item.output_format || '',
      version: item.version,
      creator: item.creator_id || 'Unknown',
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      tags: item.categories || [],
      metrics: {
        performance: item.performance_score,
        reliability: item.reliability_score,
        latency: item.latency,
      },
      dependencies: item.dependencies || [],
      usage: {
        count: 0,
        lastUsed: new Date().toISOString(),
      },
      documentationUrl: item.documentation_url,
      demoUrl: item.demo_url,
      apiEndpoint: item.api_endpoint,
      exampleRequest: item.example_request,
      exampleResponse: item.example_response,
    }));
  } catch (err) {
    console.error('Error connecting to Supabase:', err);
    return mockAgentsFromCategories();
  }
}

// Add a new function to generate detailed descriptions for existing agents
export async function generateAndUpdateDescriptions(): Promise<number> {
  try {
    // Fetch all agents without a detailed description
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .is('detailed_description', null);
      
    if (error) {
      console.error('Error fetching agents without descriptions:', error);
      return 0;
    }
    
    if (!data || data.length === 0) {
      console.log('No agents found without detailed descriptions');
      return 0;
    }
    
    console.log(`Found ${data.length} agents without detailed descriptions`);
    
    // Generate and update descriptions for each agent
    let updatedCount = 0;
    
    for (const item of data) {
      try {
        // Create an agent object to pass to the description generator
        const agent: Agent = {
          id: item.id,
          name: item.name,
          description: item.description,
          logo: item.logo_url || 'brain',
          capabilities: item.capabilities || [],
          inputFormat: item.input_format || '',
          outputFormat: item.output_format || '',
          version: item.version,
          creator: item.creator_id || 'Unknown',
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          tags: item.categories || [],
          metrics: {
            performance: item.performance_score,
            reliability: item.reliability_score,
            latency: item.latency,
          },
        };
        
        // Generate a detailed description
        const detailedDescription = await generateAgentDescription(agent);
        
        // Update the agent in the database
        const { error: updateError } = await supabase
          .from('agents')
          .update({ detailed_description: detailedDescription })
          .eq('id', agent.id);
          
        if (updateError) {
          console.error(`Error updating agent ${agent.id}:`, updateError);
          continue;
        }
        
        updatedCount++;
        console.log(`Updated agent ${agent.id} with detailed description`);
      } catch (agentError) {
        console.error(`Error processing agent ${item.id}:`, agentError);
      }
    }
    
    return updatedCount;
  } catch (err) {
    console.error('Error in generateAndUpdateDescriptions:', err);
    return 0;
  }
} 