import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { Agent } from '../../types/agent';
import { getAgentIcon } from '../../data/agents';
import { Clock, Tag, Zap } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const AgentIcon = getAgentIcon(agent.logo);
  const isImageUrl = agent.logo && typeof agent.logo === 'string' && agent.logo.startsWith('http');
  
  return (
    <Link to={`/agents/${agent.id}`}>
      <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-full bg-primary-50 text-primary-600`}>
              {isImageUrl ? (
                <img src={agent.logo} alt={agent.name} className="h-6 w-6 object-contain" />
              ) : (
                <AgentIcon className="h-6 w-6" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{agent.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{agent.description}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Capabilities</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {agent.capabilities.slice(0, 3).map((capability) => (
                <span 
                  key={capability} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {capability}
                </span>
              ))}
              {agent.capabilities.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  +{agent.capabilities.length - 3} more
                </span>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="px-6 py-4 bg-gray-50 flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <Tag className="h-4 w-4 mr-1" />
            <span className="capitalize">{agent.tags[0].replace('-', ' ')}</span>
          </div>
          
          {agent.metrics && (
            <div className="flex items-center text-gray-600">
              <Zap className="h-4 w-4 mr-1" />
              <span>{agent.metrics.performance}% effective</span>
            </div>
          )}
          
          {agent.usage && (
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>Used {new Intl.NumberFormat().format(agent.usage.count)} times</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};