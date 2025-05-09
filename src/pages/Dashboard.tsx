import React, { useState, useEffect } from 'react';
import { AgentCard } from '../components/agents/AgentCard';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { BarChart3, Brain, Search, TrendingUp, Users } from 'lucide-react';
import { fetchAgents } from '../lib/agentService';
import { fetchRecentActivities, Activity } from '../lib/activityService';
import { Agent } from '../types/agent';

const Dashboard: React.FC = () => {
  const [featuredAgents, setFeaturedAgents] = useState<Agent[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activitiesLoading, setActivitiesLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const loadAgents = async () => {
      try {
        setLoading(true);
        const agents = await fetchAgents();
        // Get only 3 registered agents
        setFeaturedAgents(agents.slice(0, 3));
      } catch (err) {
        console.error('Error loading agents:', err);
      } finally {
        setLoading(false);
      }
    };
    
    const loadActivities = async () => {
      try {
        setActivitiesLoading(true);
        const recentActivities = await fetchRecentActivities(5);
        setActivities(recentActivities);
      } catch (err) {
        console.error('Error loading activities:', err);
      } finally {
        setActivitiesLoading(false);
      }
    };
    
    loadAgents();
    loadActivities();
  }, []);
  
  return (
    <div className="animate-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome to OneAI</h1>
        <p className="text-gray-600 mt-2">
          Your AI agent discovery and management platform
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Agents"
          value="128"
          change="+12"
          icon={<Brain className="h-6 w-6" />}
          color="primary"
        />
        <StatsCard 
          title="Active Users"
          value="2,589"
          change="+152"
          icon={<Users className="h-6 w-6" />}
          color="secondary"
        />
        <StatsCard 
          title="API Calls (24h)"
          value="156K"
          change="+8.2%"
          icon={<BarChart3 className="h-6 w-6" />}
          color="accent"
        />
        <StatsCard 
          title="Agent Searches"
          value="4,752"
          change="+24%"
          icon={<Search className="h-6 w-6" />}
          color="success"
        />
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Featured Agents</h2>
          <a href="/discover" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            View all agents
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading agents...</p>
            </div>
          ) : featuredAgents.length > 0 ? (
            featuredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-600">No registered agents found.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading activities...</p>
              </div>
            ) : activities.length > 0 ? (
              <ul className="space-y-4">
                {activities.map((activity) => (
                  <ActivityItem 
                    key={activity.id}
                    action={activity.action} 
                    subject={activity.subjectName} 
                    timestamp={activity.formattedTimestamp || ''}
                    actor={activity.userName}
                  />
                ))}
              </ul>
            ) : (
              <p className="text-center py-4 text-gray-600">No recent activities found.</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Trending Agents</h2>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {featuredAgents.slice(0, 4).map((agent, index) => (
                <TrendingAgentItem 
                  key={agent.id}
                  name={agent.name}
                  growth={`+${20 - index * 4}%`}
                  category={agent.tags[0] || 'General'}
                />
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'accent' | 'success';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon, color }) => {
  const colorMap = {
    primary: 'bg-primary-50 text-primary-600',
    secondary: 'bg-secondary-50 text-secondary-600',
    accent: 'bg-accent-50 text-accent-600',
    success: 'bg-success-50 text-success-600',
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${colorMap[color]}`}>
            {icon}
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
              <p className="ml-2 text-sm font-medium text-success-500 flex items-center">
                {change}
                <TrendingUp className="h-3 w-3 ml-1" />
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface ActivityItemProps {
  action: string;
  subject: string;
  timestamp: string;
  actor: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ action, subject, timestamp, actor }) => {
  return (
    <li className="flex items-center space-x-2 text-sm">
      <span className="font-medium text-gray-900">{actor}</span>
      <span className="text-gray-600">{action}</span>
      <span className="font-medium text-primary-600">{subject}</span>
      <span className="text-gray-400">{timestamp}</span>
    </li>
  );
};

interface TrendingAgentItemProps {
  name: string;
  growth: string;
  category: string;
}

const TrendingAgentItem: React.FC<TrendingAgentItemProps> = ({ name, growth, category }) => {
  return (
    <li className="flex items-center justify-between">
      <div>
        <h3 className="font-medium text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500 capitalize">{category.replace('-', ' ')}</p>
      </div>
      <div className="flex items-center text-success-500 font-medium">
        {growth}
        <TrendingUp className="h-4 w-4 ml-1" />
      </div>
    </li>
  );
};

export default Dashboard;