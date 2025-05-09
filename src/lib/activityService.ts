import { supabase } from './supabase';
import { format, formatDistanceToNow } from 'date-fns';

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  subjectId: string;
  subjectName: string;
  createdAt: string;
  formattedTimestamp?: string;
}

/**
 * Logs a new activity to the activities table
 */
export async function logActivity(
  userId: string, 
  userName: string, 
  action: string, 
  subjectId: string, 
  subjectName: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('activities')
      .insert({
        user_id: userId,
        user_name: userName,
        action,
        subject_id: subjectId,
        subject_name: subjectName
      });

    if (error) {
      console.error('Error logging activity:', error);
    }
  } catch (err) {
    console.error('Error connecting to Supabase:', err);
  }
}

/**
 * Fetches recent activities from the database
 */
export async function fetchRecentActivities(limit: number = 10): Promise<Activity[]> {
  try {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching activities:', error);
      return [];
    }

    // Transform data to match our Activity interface and add formatted timestamp
    return (data || []).map(item => ({
      id: item.id,
      userId: item.user_id,
      userName: item.user_name,
      action: item.action,
      subjectId: item.subject_id,
      subjectName: item.subject_name,
      createdAt: item.created_at,
      formattedTimestamp: formatTimestamp(new Date(item.created_at))
    }));
  } catch (err) {
    console.error('Error connecting to Supabase:', err);
    return [];
  }
}

/**
 * Format a date into a human-readable relative time (e.g., "2 hours ago")
 */
export function formatTimestamp(date: Date): string {
  try {
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (err) {
    console.error('Error formatting date:', err);
    return format(date, 'MMM d, yyyy');
  }
}

/**
 * Utility for tracking common agent-related activities
 */
export const trackAgentActivity = {
  registered: (userId: string, userName: string, agentId: string, agentName: string) => 
    logActivity(userId, userName, 'registered', agentId, agentName),
    
  updated: (userId: string, userName: string, agentId: string, agentName: string) => 
    logActivity(userId, userName, 'updated', agentId, agentName),
    
  used: (userId: string, userName: string, agentId: string, agentName: string) => 
    logActivity(userId, userName, 'used', agentId, agentName),
    
  commented: (userId: string, userName: string, agentId: string, agentName: string) => 
    logActivity(userId, userName, 'commented on', agentId, agentName)
}; 