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
 * Logs a new activity to the activities table without requiring user information
 * This version can be used for system events or when user context is not available
 */
export async function logSystemActivity(
  action: string, 
  subjectId: string, 
  subjectName: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('activities')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000', // Use a placeholder UUID 
        user_name: 'System',
        action,
        subject_id: subjectId,
        subject_name: subjectName
      });

    if (error) {
      console.error('[logSystemActivity] Error logging activity:', error);
    } else {
      console.log(`[logSystemActivity] Logged '${action}' activity for ${subjectName}`);
    }
  } catch (err) {
    console.error('[logSystemActivity] Error connecting to Supabase:', err);
  }
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
      console.error('[logActivity] Error logging activity:', error);
      // If user-specific logging fails, try system logging as fallback
      await logSystemActivity(action, subjectId, subjectName);
    } else {
      console.log(`[logActivity] Logged '${action}' by ${userName} for ${subjectName}`);
    }
  } catch (err) {
    console.error('[logActivity] Error connecting to Supabase:', err);
    // Try system logging as fallback
    await logSystemActivity(action, subjectId, subjectName);
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
      console.error('[fetchRecentActivities] Error fetching activities:', error);
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
    console.error('[fetchRecentActivities] Error connecting to Supabase:', err);
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

/**
 * System version of trackAgentActivity that doesn't require user context
 * Use this when you want to log activities without a specific user
 */
export const trackSystemAgentActivity = {
  registered: (agentId: string, agentName: string) => 
    logSystemActivity('registered', agentId, agentName),
    
  updated: (agentId: string, agentName: string) => 
    logSystemActivity('updated', agentId, agentName),
    
  used: (agentId: string, agentName: string) => 
    logSystemActivity('used', agentId, agentName),
    
  commented: (agentId: string, agentName: string) => 
    logSystemActivity('commented on', agentId, agentName)
}; 