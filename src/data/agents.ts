import { Agent, AgentCategory } from '../types/agent';
import { Brain, Bot, BookCopy, BarChart4, FileCode, FileSearch } from 'lucide-react';

export const agentCategories: AgentCategory[] = [
  {
    id: 'nlp',
    name: 'Natural Language Processing',
    description: 'Agents that understand and generate human language',
    count: 24,
  },
  {
    id: 'computer-vision',
    name: 'Computer Vision',
    description: 'Agents that analyze and interpret visual data',
    count: 18,
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    description: 'Agents that process and analyze structured data',
    count: 32,
  },
  {
    id: 'code-generation',
    name: 'Code Generation',
    description: 'Agents that generate or analyze code',
    count: 15,
  },
  {
    id: 'document-processing',
    name: 'Document Processing',
    description: 'Agents that work with documents and PDFs',
    count: 21,
  },
  {
    id: 'recommendations',
    name: 'Recommendation Systems',
    description: 'Agents that provide personalized recommendations',
    count: 12,
  },
];

export const agentCapabilities = [
  'Text Generation',
  'Text Classification',
  'Named Entity Recognition',
  'Sentiment Analysis',
  'Image Recognition',
  'Object Detection',
  'Data Visualization',
  'Anomaly Detection',
  'Code Completion',
  'Document Parsing',
  'Document Classification',
  'Recommendation Generation',
];

export const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'TextAnalyzer Pro',
    description: 'Advanced text analysis agent with support for sentiment, entities, and classification',
    logo: 'brain',
    capabilities: ['Text Classification', 'Named Entity Recognition', 'Sentiment Analysis'],
    inputFormat: 'Plain text or structured JSON',
    outputFormat: 'JSON with analysis results',
    version: '2.3.1',
    creator: 'NLP Team',
    createdAt: '2024-05-01T10:30:00Z',
    updatedAt: '2024-08-12T14:15:00Z',
    tags: ['nlp', 'text-analysis', 'enterprise'],
    metrics: {
      performance: 95,
      reliability: 99,
      latency: 120,
    },
    dependencies: ['tensorflow', 'nltk'],
    usage: {
      count: 15243,
      lastUsed: '2024-09-15T08:45:00Z',
    },
  },
  {
    id: '2',
    name: 'Vision Assistant',
    description: 'Computer vision agent for image classification and object detection',
    logo: 'bot',
    capabilities: ['Image Recognition', 'Object Detection'],
    inputFormat: 'Image files (JPG, PNG, WebP)',
    outputFormat: 'JSON with bounding boxes and classifications',
    version: '1.5.0',
    creator: 'Vision Team',
    createdAt: '2024-03-15T09:45:00Z',
    updatedAt: '2024-07-22T11:30:00Z',
    tags: ['computer-vision', 'image-analysis'],
    metrics: {
      performance: 92,
      reliability: 97,
      latency: 250,
    },
    dependencies: ['pytorch', 'opencv'],
    usage: {
      count: 8732,
      lastUsed: '2024-09-14T16:20:00Z',
    },
  },
  {
    id: '3',
    name: 'DataInsight',
    description: 'Data analysis agent for discovering patterns and generating visualizations',
    logo: 'file-search',
    capabilities: ['Data Visualization', 'Anomaly Detection'],
    inputFormat: 'CSV, JSON, or Excel files',
    outputFormat: 'Interactive dashboards and JSON reports',
    version: '3.1.2',
    creator: 'Analytics Team',
    createdAt: '2024-02-10T14:20:00Z',
    updatedAt: '2024-08-05T10:15:00Z',
    tags: ['data-analysis', 'visualization', 'enterprise'],
    metrics: {
      performance: 97,
      reliability: 98,
      latency: 500,
    },
    dependencies: ['pandas', 'matplotlib', 'scikit-learn'],
    usage: {
      count: 12458,
      lastUsed: '2024-09-15T11:30:00Z',
    },
  },
  {
    id: '4',
    name: 'CodeGPT',
    description: 'AI code generation and completion agent',
    logo: 'file-code',
    capabilities: ['Code Completion'],
    inputFormat: 'Code or natural language prompts',
    outputFormat: 'Generated code with explanations',
    version: '2.0.0',
    creator: 'Dev Tools Team',
    createdAt: '2024-04-22T08:15:00Z',
    updatedAt: '2024-07-30T13:45:00Z',
    tags: ['code-generation', 'developer-tools'],
    metrics: {
      performance: 88,
      reliability: 95,
      latency: 350,
    },
    dependencies: ['transformers'],
    usage: {
      count: 20145,
      lastUsed: '2024-09-15T09:10:00Z',
    },
  },
  {
    id: '5',
    name: 'DocuScan',
    description: 'Document processing agent for parsing and extracting information',
    logo: 'book-copy',
    capabilities: ['Document Parsing', 'Document Classification'],
    inputFormat: 'PDF, DOCX, or scanned images',
    outputFormat: 'Structured JSON with extracted information',
    version: '1.8.3',
    creator: 'Document Processing Team',
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-06-28T15:30:00Z',
    tags: ['document-processing', 'ocr'],
    metrics: {
      performance: 91,
      reliability: 96,
      latency: 800,
    },
    dependencies: ['tesseract', 'pdfminer'],
    usage: {
      count: 9865,
      lastUsed: '2024-09-14T14:45:00Z',
    },
  },
  {
    id: '6',
    name: 'RecommendAI',
    description: 'AI-powered recommendation system for personalized suggestions',
    logo: 'bar-chart-4',
    capabilities: ['Recommendation Generation'],
    inputFormat: 'User data and preference history',
    outputFormat: 'Ranked list of recommendations with explanations',
    version: '2.4.1',
    creator: 'Personalization Team',
    createdAt: '2024-03-08T13:30:00Z',
    updatedAt: '2024-08-18T10:45:00Z',
    tags: ['recommendations', 'personalization'],
    metrics: {
      performance: 94,
      reliability: 98,
      latency: 200,
    },
    dependencies: ['tensorflow', 'scikit-learn'],
    usage: {
      count: 18754,
      lastUsed: '2024-09-15T10:15:00Z',
    },
  },
];

export const getAgentIcon = (logo: string) => {
  switch (logo) {
    case 'brain':
      return Brain;
    case 'bot':
      return Bot;
    case 'book-copy':
      return BookCopy;
    case 'bar-chart-4':
      return BarChart4;
    case 'file-code':
      return FileCode;
    case 'file-search':
      return FileSearch;
    default:
      return Brain;
  }
};