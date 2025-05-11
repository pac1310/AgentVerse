import { supabase } from './supabase';
import { Agent, AgentCategory } from '../types/agent';
import { agentCategories as mockCategories } from '../data/agents';
import { generateAgentDescription } from './huggingfaceService';
import { trackAgentActivity, trackSystemAgentActivity } from './activityService';

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
    console.log(`[fetchAgentById] Fetching agent with ID: ${id}`);
    
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('[fetchAgentById] Error fetching agent:', error);
      // Simplified error handling for now, RLS specific logic removed for brevity if not strictly needed by caller
      return null;
    }

    if (!data) {
      console.log(`[fetchAgentById] No agent found with ID: ${id}`);
      return null;
    }

    console.log(`[fetchAgentById] Agent found:`, data.name);
    
    return {
      id: data.id,
      name: data.name || '',
      description: data.description || '',
      detailedDescription: data.detailed_description || '',
      logo: data.logo_url && data.logo_url.startsWith('http')
        ? data.logo_url
        : (data.logo_url || 'brain'),
      capabilities: data.capabilities || [],
      inputFormat: data.input_format || '',
      outputFormat: data.output_format || '',
      version: data.version || '1.0.0',
      creator: data.creator_id || 'Unknown',
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString(),
      tags: data.categories || [],
      metrics: {
        performance: data.performance_score === null ? undefined : data.performance_score,
        reliability: data.reliability_score === null ? undefined : data.reliability_score,
        latency: data.latency === null ? undefined : data.latency,
      },
      dependencies: data.dependencies || [],
      documentationUrl: data.documentation_url === null ? undefined : data.documentation_url,
      demoUrl: data.demo_url === null ? undefined : data.demo_url,
      apiEndpoint: data.api_endpoint === null ? undefined : data.api_endpoint,
      exampleRequest: data.example_request === null ? undefined : data.example_request,
      exampleResponse: data.example_response === null ? undefined : data.example_response,
      usage: {
        count: 0, // This would come from a separate usage tracking table
        lastUsed: new Date().toISOString(),
      },
    };
  } catch (err) {
    console.error('[fetchAgentById] Critical error connecting to Supabase:', err);
    return null;
  }
}

// Function to create a new agent
export async function createAgent(agentData: AgentWithDocs, logoFile?: File): Promise<Agent> {
  try {
    let logoUrl: string | null = null;

    if (logoFile) {
      try {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('agent-logos')
          .upload(fileName, logoFile, { cacheControl: '3600', upsert: true, contentType: logoFile.type });
        
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage.from('agent-logos').getPublicUrl(fileName);
        logoUrl = publicUrlData.publicUrl;
      } catch (logoError) {
        console.error('[createAgent] Logo handling error:', logoError);
      }
    }

    let detailedDescription = agentData.detailedDescription;
    if (!detailedDescription && agentData.name && agentData.description) {
      try {
        const tempAgent: Agent = {
          id: 'temp', name: agentData.name, description: agentData.description, logo: logoUrl || agentData.logo || 'brain',
          capabilities: agentData.capabilities || [], inputFormat: agentData.inputFormat || '', outputFormat: agentData.outputFormat || '',
          version: agentData.version || '1.0.0', creator: 'Unknown', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
          tags: agentData.tags || [],
        };
        detailedDescription = await generateAgentDescription(tempAgent);
      } catch (err) {
        console.error('[createAgent] Error generating detailed description:', err);
        detailedDescription = agentData.description; // Fallback
      }
    }

    const dbPayload = {
      name: agentData.name,
      description: agentData.description,
      detailed_description: detailedDescription === undefined ? null : detailedDescription,
      version: agentData.version,
      logo_url: logoUrl === undefined ? (agentData.logo === undefined ? null : agentData.logo) : logoUrl,
      input_format: agentData.inputFormat === undefined ? null : agentData.inputFormat,
      output_format: agentData.outputFormat === undefined ? null : agentData.outputFormat,
      capabilities: agentData.capabilities || [],
      categories: agentData.tags || [],
      dependencies: agentData.dependencies || [],
      performance_score: agentData.metrics?.performance === undefined ? null : agentData.metrics.performance,
      reliability_score: agentData.metrics?.reliability === undefined ? null : agentData.metrics.reliability,
      latency: agentData.metrics?.latency === undefined ? null : agentData.metrics.latency,
      documentation_url: agentData.documentationUrl === undefined ? null : agentData.documentationUrl,
      demo_url: agentData.demoUrl === undefined ? null : agentData.demoUrl,
      api_endpoint: agentData.apiEndpoint === undefined ? null : agentData.apiEndpoint,
      example_request: agentData.exampleRequest === undefined ? null : agentData.exampleRequest,
      example_response: agentData.exampleResponse === undefined ? null : agentData.exampleResponse,
      // creator_id should be set if available from auth session
    };

    const { data, error } = await supabase.from('agents').insert(dbPayload).select().single();

    if (error) throw new Error(`[createAgent] Failed to create agent: ${error.message}`);
    if (!data) throw new Error('[createAgent] No data returned from agent creation');

    // Log activity regardless of user authentication status
    try {
      // First try with user auth context if available
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        console.log('[createAgent] Logging registration with user context:', userData.user.email);
        trackAgentActivity.registered(userData.user.id, userData.user.email || 'Unknown User', data.id, data.name);
      } else {
        // If no user auth context, use system tracking
        console.log('[createAgent] No user context available, using system activity logging');
        trackSystemAgentActivity.registered(data.id, data.name);
      }
    } catch (err) {
      console.error('[createAgent] Error during activity logging with user context:', err);
      // Fallback to system tracking if user context fails
      try {
        console.log('[createAgent] Falling back to system activity logging');
        trackSystemAgentActivity.registered(data.id, data.name);
      } catch (fallbackErr) {
        console.error('[createAgent] Even system activity logging failed:', fallbackErr);
        // Just log the error but continue - activity logging shouldn't break agent creation
      }
    }
    
    // Transform and return. Re-use fetchAgentById for consistent transformation.
    const newAgent = await fetchAgentById(data.id);
    if (!newAgent) throw new Error('[createAgent] Could not fetch newly created agent.');
    return newAgent;

  } catch (err) {
    console.error('[createAgent] Critical error:', err);
    throw err;
  }
}

// Function to search agents
export async function searchAgents(query: string, filters: any = {}): Promise<Agent[]> {
  try {
    let queryBuilder = supabase
      .from('agents')
      .select('*');

    if (query) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${query}%,description.ilike.%${query}%,detailed_description.ilike.%${query}%`
      );
    }
    if (filters.categories && filters.categories.length > 0) {
      queryBuilder = queryBuilder.contains('categories', filters.categories);
    }
    if (filters.capabilities && filters.capabilities.length > 0) {
      queryBuilder = queryBuilder.contains('capabilities', filters.capabilities);
    }

    const { data, error } = await queryBuilder.order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching agents:', error);
      return mockAgentsFromCategories().filter(agent => {
        if (query && !agent.name.toLowerCase().includes(query.toLowerCase()) && 
            !agent.description.toLowerCase().includes(query.toLowerCase())) {
          return false;
        }
        return true;
      });
    }
    return (data || []).map(item => ({
      id: item.id, name: item.name, description: item.description, detailedDescription: item.detailed_description || '',
      logo: item.logo_url && item.logo_url.startsWith('http') ? item.logo_url : (item.logo_url || 'brain'),
      capabilities: item.capabilities || [], inputFormat: item.input_format || '', outputFormat: item.output_format || '',
      version: item.version, creator: item.creator_id || 'Unknown', createdAt: item.created_at, updatedAt: item.updated_at,
      tags: item.categories || [],
      metrics: { performance: item.performance_score, reliability: item.reliability_score, latency: item.latency },
      dependencies: item.dependencies || [],
      usage: { count: 0, lastUsed: new Date().toISOString() },
      documentationUrl: item.documentation_url, demoUrl: item.demo_url, apiEndpoint: item.api_endpoint,
      exampleRequest: item.example_request, exampleResponse: item.example_response,
    }));
  } catch (err) {
    console.error('Error connecting to Supabase during search:', err);
    return mockAgentsFromCategories();
  }
}

export async function generateAndUpdateDescriptions(): Promise<number> {
  try {
    const { data, error } = await supabase.from('agents').select('*').is('detailed_description', null);
    if (error) {
      console.error('Error fetching agents for description generation:', error);
      return 0;
    }
    if (!data || data.length === 0) return 0;

    let updatedCount = 0;
    for (const item of data) {
      try {
        const agent: Agent = {
          id: item.id, name: item.name, description: item.description, logo: item.logo_url || 'brain',
          capabilities: item.capabilities || [], inputFormat: item.input_format || '', outputFormat: item.output_format || '',
          version: item.version, creator: item.creator_id || 'Unknown', createdAt: item.created_at, updatedAt: item.updated_at,
          tags: item.categories || [], metrics: { performance: item.performance_score, reliability: item.reliability_score, latency: item.latency },
        };
        const detailedDescription = await generateAgentDescription(agent);
        const { error: updateError } = await supabase.from('agents').update({ detailed_description: detailedDescription }).eq('id', agent.id);
        if (updateError) console.error(`Error updating agent ${agent.id} with description:`, updateError);
        else updatedCount++;
      } catch (agentError) {
        console.error(`Error processing agent ${item.id} for description:`, agentError);
      }
    }
    return updatedCount;
  } catch (err) {
    console.error('Error in generateAndUpdateDescriptions:', err);
    return 0;
  }
}

// --- Rewritten updateAgent function ---
export async function updateAgent(id: string, agentData: AgentWithDocs, logoFile?: File): Promise<Agent> {
  try {
    console.log(`[updateAgent v2] Attempting to update agent ID: ${id}`);
    console.log('[updateAgent v2] Incoming agentData:', JSON.stringify(agentData, null, 2));
    if (logoFile) console.log('[updateAgent v2] Incoming logoFile name:', logoFile.name);

    // 1. Determine the effective logo value for the database 'logo_url' field
    let effectiveDbLogoUrl: string | null | undefined = undefined;
    let logoUpdateAttempted = false;

    if (logoFile) {
      logoUpdateAttempted = true;
      console.log(`[updateAgent v2] New logo file provided: ${logoFile.name}. Uploading...`);
      try {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('agent-logos')
          .upload(fileName, logoFile, { cacheControl: '3600', upsert: true, contentType: logoFile.type });
        
        if (uploadError) {
          console.error('[updateAgent v2] Logo upload failed:', uploadError);
          // Decide on error strategy: throw, or log and continue allowing other fields to update?
          // For now, log and set effectiveDbLogoUrl to keep existing or clear if intended.
          effectiveDbLogoUrl = agentData.hasOwnProperty('logo') ? (agentData.logo === undefined ? null : agentData.logo) : undefined;
        } else {
          const { data: publicUrlData } = supabase.storage.from('agent-logos').getPublicUrl(fileName);
          effectiveDbLogoUrl = publicUrlData.publicUrl; // This is an HTTP URL
          console.log(`[updateAgent v2] New logo uploaded. Public URL: ${effectiveDbLogoUrl}`);
        }
      } catch (uploadErr) {
        console.error('[updateAgent v2] Exception during logo upload processing:', uploadErr);
        effectiveDbLogoUrl = agentData.hasOwnProperty('logo') ? (agentData.logo === undefined ? null : agentData.logo) : undefined;
      }
    } else if (agentData.hasOwnProperty('logo')) {
      logoUpdateAttempted = true;
      // No new file, but 'logo' field is present in agentData.
      // agentData.logo could be an existing URL, an icon name, null (to clear), or undefined (should become null).
      effectiveDbLogoUrl = agentData.logo === undefined ? null : agentData.logo;
      console.log(`[updateAgent v2] Logo field present in agentData, no new file. Effective DB logo_url: ${effectiveDbLogoUrl}`);
    }

    // 2. Construct the payload for Supabase, only including fields present in agentData.
    const payload: { [key: string]: any } = {};
    let hasChanges = false;

    // Helper to add to payload if property exists in agentData
    // Converts undefined to null for nullable fields in DB.
    const addToPayload = (frontendKey: keyof AgentWithDocs, dbKey: string, isArray = false) => {
      if (agentData.hasOwnProperty(frontendKey)) {
        hasChanges = true;
        // @ts-ignore
        let value = agentData[frontendKey];
        if (value === undefined) {
          payload[dbKey] = null;
        } else if (isArray && value === null) {
          payload[dbKey] = []; // Default empty arrays for DB if explicit null is passed for array type
        } else {
          payload[dbKey] = value;
        }
      }
    };
    
    addToPayload('name', 'name');
    addToPayload('description', 'description');
    addToPayload('detailedDescription', 'detailed_description');
    addToPayload('inputFormat', 'input_format');
    addToPayload('outputFormat', 'output_format');
    addToPayload('version', 'version');
    addToPayload('documentationUrl', 'documentation_url');
    addToPayload('demoUrl', 'demo_url');
    addToPayload('apiEndpoint', 'api_endpoint');
    addToPayload('exampleRequest', 'example_request');
    addToPayload('exampleResponse', 'example_response');

    addToPayload('capabilities', 'capabilities', true);
    addToPayload('tags', 'categories', true); // 'tags' maps to 'categories'
    addToPayload('dependencies', 'dependencies', true);

    if (agentData.hasOwnProperty('metrics')) {
      hasChanges = true;
      if (agentData.metrics === null || agentData.metrics === undefined) {
        payload.performance_score = null;
        payload.reliability_score = null;
        payload.latency = null;
      } else {
        payload.performance_score = agentData.metrics.performance === undefined ? null : agentData.metrics.performance;
        payload.reliability_score = agentData.metrics.reliability === undefined ? null : agentData.metrics.reliability;
        payload.latency = agentData.metrics.latency === undefined ? null : agentData.metrics.latency;
      }
    }
    
    if (logoUpdateAttempted) {
        payload.logo_url = effectiveDbLogoUrl; // Already handles undefined -> null if necessary
        hasChanges = true;
    }
    
    if (!hasChanges) {
      console.log('[updateAgent v2] No data changes detected in agentData. Fetching current agent.');
      const currentAgentUnchanged = await fetchAgentById(id);
      if (!currentAgentUnchanged) {
        throw new Error(`[updateAgent v2] Agent with ID ${id} not found, cannot return after no-op update.`);
      }
      return currentAgentUnchanged;
    }
    
    payload.updated_at = new Date().toISOString();
    console.log('[updateAgent v2] Final payload for Supabase:', JSON.stringify(payload, null, 2));

    // 3. Perform Supabase update
    const { error: updateError } = await supabase.from('agents').update(payload).eq('id', id);

    if (updateError) {
      console.error('[updateAgent v2] Supabase update error:', updateError);
      throw updateError;
    }
    console.log('[updateAgent v2] Agent successfully updated in Supabase.');

    // 4. Fetch and return the updated agent using existing reliable fetcher
    const updatedAgent = await fetchAgentById(id);
    if (!updatedAgent) {
      console.error('[updateAgent v2] Failed to fetch agent after update, or agent no longer exists (this should not happen if update succeeded).');
      throw new Error('Failed to retrieve agent after update. The agent might have been deleted concurrently.');
    }

    // Log activity regardless of user authentication status
    try {
      // First try with user auth context if available
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        console.log('[updateAgent v2] Logging activity with user context:', userData.user.email);
        trackAgentActivity.updated(userData.user.id, userData.user.email || 'Unknown User', updatedAgent.id, updatedAgent.name);
      } else {
        // If no user auth context, use system tracking
        console.log('[updateAgent v2] No user context available, using system activity logging');
        trackSystemAgentActivity.updated(updatedAgent.id, updatedAgent.name);
      }
    } catch (err) {
      console.error('[updateAgent v2] Error during activity logging with user context:', err);
      // Fallback to system tracking if user context fails
      try {
        console.log('[updateAgent v2] Falling back to system activity logging');
        trackSystemAgentActivity.updated(updatedAgent.id, updatedAgent.name);
      } catch (fallbackErr) {
        console.error('[updateAgent v2] Even system activity logging failed:', fallbackErr);
        // Just log the error but continue - activity logging shouldn't break agent updates
      }
    }

    console.log('[updateAgent v2] Successfully fetched and returning updated agent:', updatedAgent.name);
    return updatedAgent;

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[updateAgent v2] Critical error during update for agent ID ${id}: ${message}`);
    // It's important to throw an error that the UI can catch and display
    if (error instanceof Error && error.message.includes('not found')) {
        throw new Error(`Agent with ID ${id} not found. It may have been deleted.`);
    }
    throw new Error(`Failed to update agent: ${message}`);
  }
}

// Function to check if the current user is the creator of an agent
export async function isAgentCreator(agentId: string): Promise<boolean> {
  // Always return true to allow any user to edit any agent
  // This is a temporary workaround until proper permissions are set up
  return true;
} 