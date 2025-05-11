import { Agent } from '../types/agent';

// Define the interface for recently viewed items
export interface RecentlyViewedItem {
  id: string;
  name: string;
  timestamp: number;
}

// Constant for the storage key
const RECENTLY_VIEWED_KEY = 'oneai_recently_viewed';
const MAX_ITEMS = 5;

/**
 * Add an agent to recently viewed list
 */
export const addToRecentlyViewed = (agent: Agent): void => {
  if (!agent || !agent.id) return;
  
  try {
    // Get existing items
    const existingItems = getRecentlyViewed();
    
    // Create new item
    const newItem: RecentlyViewedItem = {
      id: agent.id,
      name: agent.name,
      timestamp: Date.now()
    };
    
    // Remove item if it already exists (to avoid duplicates)
    const filteredItems = existingItems.filter(item => item.id !== agent.id);
    
    // Add new item at the beginning
    const updatedItems = [newItem, ...filteredItems].slice(0, MAX_ITEMS);
    
    // Save back to localStorage
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updatedItems));
  } catch (error) {
    console.error('Error adding to recently viewed:', error);
  }
};

/**
 * Get the list of recently viewed agents
 */
export const getRecentlyViewed = (): RecentlyViewedItem[] => {
  try {
    const storedItems = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (!storedItems) return [];
    
    const items = JSON.parse(storedItems) as RecentlyViewedItem[];
    return items;
  } catch (error) {
    console.error('Error getting recently viewed:', error);
    return [];
  }
};

/**
 * Clear the recently viewed list
 */
export const clearRecentlyViewed = (): void => {
  localStorage.removeItem(RECENTLY_VIEWED_KEY);
}; 