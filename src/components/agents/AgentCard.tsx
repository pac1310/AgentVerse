import React, { useState, useRef, useEffect } from 'react';
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
  const [isHovering, setIsHovering] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  
  useEffect(() => {
    if (isHovering && descriptionRef.current) {
      const rect = descriptionRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top - 10, // Position above the element with some spacing
        left: rect.left + rect.width / 2
      });
    }
  }, [isHovering]);
  
  return (
    <>
      <Link to={`/agents/${agent.id}`} style={{ display: 'block', minHeight: '360px' }}>
        <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary-200 flex flex-col">
          <CardContent className="p-6 flex flex-col flex-grow">
            {/* Agent Icon and Name */}
            <div className="flex items-center mb-3">
              <div className={`p-3 rounded-lg bg-primary-50 text-primary-600 mr-4`}>
                {isImageUrl ? (
                  <img src={agent.logo} alt={agent.name} className="h-8 w-8 object-contain" />
                ) : (
                  <AgentIcon className="h-8 w-8" />
                )}
              </div>
              <h3 className="font-semibold text-xl text-gray-900">{agent.name}</h3>
            </div>
            
            {/* Description with truncation and hover effect */}
            <div className="mt-2 mb-4 relative">
              <p 
                ref={descriptionRef}
                className="text-gray-600 overflow-hidden"
                style={{ 
                  display: '-webkit-box', 
                  WebkitLineClamp: 3, 
                  WebkitBoxOrient: 'vertical',
                  lineHeight: '1.5rem',
                  height: '4.5rem'
                }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {agent.description}
              </p>
            </div>
            
            {/* Capabilities section */}
            <div className="mt-2">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">CAPABILITIES</h4>
              <div className="flex flex-wrap gap-2">
                {agent.capabilities.map((capability) => (
                  <span 
                    key={capability} 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {capability}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
          
          {/* Stats footer */}
          <CardFooter className="px-6 py-3 bg-gray-50">
            <div className="grid grid-cols-3 w-full">
              <div className="flex items-center text-gray-600 justify-start">
                <Tag className="h-4 w-4 mr-1" />
                <span>{agent.tags && agent.tags.length > 0 ? agent.tags[0] : 'Uncategorized'}</span>
              </div>
              
              <div className="flex items-center text-gray-600 justify-center">
                <Zap className="h-4 w-4 mr-1" />
                <span>{agent.metrics?.performance || 0}% effective</span>
              </div>
              
              <div className="flex items-center text-gray-600 justify-end">
                <Clock className="h-4 w-4 mr-1" />
                <span>Used {new Intl.NumberFormat().format(agent.usage?.count || 0)} times</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </Link>
      
      {/* Tooltip rendered at the document level outside the card */}
      {isHovering && agent.description.length > 180 && (
        <div 
          className="fixed z-50 bg-white p-4 rounded-md shadow-lg border border-gray-200 w-64 text-sm"
          style={{ 
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: 'translateX(-50%) translateY(-100%)',
          }}
        >
          {agent.description}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-4 h-4 bg-white border-r border-b border-gray-200"></div>
        </div>
      )}
    </>
  );
};