export interface Agent {
  id: string;
  name: string;
  description: string;
  detailedDescription?: string;
  logo: string;
  capabilities: string[];
  inputFormat: string;
  outputFormat: string;
  version: string;
  creator: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  metrics?: {
    performance?: number;
    reliability?: number;
    latency?: number;
  };
  dependencies?: string[];
  usage?: {
    count: number;
    lastUsed: string;
  };
  documentationUrl?: string;
  demoUrl?: string;
  apiEndpoint?: string;
  exampleRequest?: string;
  exampleResponse?: string;
}

export interface AgentCategory {
  id: string;
  name: string;
  description: string;
  count: number;
}

export type AgentFilters = {
  search?: string;
  categories?: string[];
  capabilities?: string[];
  inputFormat?: string[];
  outputFormat?: string[];
  minPerformance?: number;
};