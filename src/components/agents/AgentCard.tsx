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
      <Link to={`/agents/${agent.id}`} style={{ display: 'block' }}>
        <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary-200 flex flex-col">
          <CardContent className="p-4 flex flex-col flex-grow">
            {/* Agent Icon and Name */}
            <div className="flex items-center mb-2">
              <div className={`p-2 rounded-lg bg-primary-50 text-primary-600 mr-3`}>
                {isImageUrl ? (
                  <img src={agent.logo} alt={agent.name} className="h-6 w-6 object-contain" />
                ) : (
                  <AgentIcon className="h-6 w-6" />
                )}
              </div>
              <h3 className="font-semibold text-lg text-gray-900">{agent.name}</h3>
            </div>
            
            {/* Description with truncation and hover effect */}
            <div className="mt-1 mb-2 relative">
              <p 
                ref={descriptionRef}
                className="text-gray-600 text-sm overflow-hidden"
                style={{ 
                  display: '-webkit-box', 
                  WebkitLineClamp: 2, 
                  WebkitBoxOrient: 'vertical',
                  lineHeight: '1.4rem',
                  height: '2.8rem'
                }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {agent.description}
              </p>
            </div>
            
            {/* Capabilities section */}
            <div className="mt-1">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">CAPABILITIES</h4>
              <div className="flex flex-wrap gap-1">
                {agent.capabilities.slice(0, 3).map((capability) => (
                  <span 
                    key={capability} 
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {capability}
                  </span>
                ))}
                {agent.capabilities.length > 3 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    +{agent.capabilities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </CardContent>
          
          {/* Stats footer */}
          <CardFooter className="px-4 py-2 bg-gray-50">
            <div className="grid grid-cols-3 w-full">
              <div className="flex items-center text-gray-600 justify-start text-xs">
                <Tag className="h-3 w-3 mr-1" />
                <span>{agent.tags && agent.tags.length > 0 ? agent.tags[0] : 'Uncategorized'}</span>
              </div>
              
              <div className="flex items-center text-gray-600 justify-center text-xs">
                <Zap className="h-3 w-3 mr-1" />
                <span>{agent.metrics?.performance || 0}% effective</span>
              </div>
              
              <div className="flex items-center text-gray-600 justify-end text-xs">
                <Clock className="h-3 w-3 mr-1" />
                <span>Used {new Intl.NumberFormat().format(agent.usage?.count || 0)} times</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </Link>
      
      {/* Tooltip rendered at the document level outside the card */}
      {isHovering && agent.description.length > 80 && (
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