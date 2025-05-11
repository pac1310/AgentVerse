import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  User, Bell, Moon, Sun, Key, Shield, Save, CheckCircle, 
  ChevronRight, Trash2, Mail, Upload, Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

// Define types for our settings
interface UserSettings {
  displayName: string;
  email: string;
  profilePicture: string | null;
  theme: 'light' | 'dark' | 'system';
  emailNotifications: {
    agentUpdates: boolean;
    weeklyDigest: boolean;
    platformNews: boolean;
  };
  privacy: {
    shareUsageData: boolean;
    publicProfile: boolean;
  };
  apiKeys: ApiKey[];
  sidebarAutoCollapse?: boolean;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string | null;
}

// Storage key
const SETTINGS_STORAGE_KEY = 'oneai_user_settings';

const Settings: React.FC = () => {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [newKeyName, setNewKeyName] = useState<string>('');
  const [isGeneratingKey, setIsGeneratingKey] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [sidebarAutoCollapse, setSidebarAutoCollapse] = useState<boolean>(false);
  
  // Initialize settings from localStorage or defaults
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
    } catch (error) {
      console.error("Failed to parse settings from localStorage:", error);
    }
    
    // Default settings if none found in localStorage
    return {
      displayName: session?.user?.name || '',
      email: session?.user?.email || '',
      profilePicture: null,
      theme: 'light',
      emailNotifications: {
        agentUpdates: true,
        weeklyDigest: true,
        platformNews: false
      },
      privacy: {
        shareUsageData: true,
        publicProfile: false
      },
      apiKeys: [],
      sidebarAutoCollapse: false
    };
  });
  
  useEffect(() => {
    // Apply theme settings immediately when component mounts
    applyThemeSettings(settings.theme);
    setSidebarAutoCollapse(settings.sidebarAutoCollapse || false);
  }, []);
  
  // Apply theme settings when changed
  const applyThemeSettings = (theme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('theme-light', 'theme-dark');
    
    // Apply the selected theme
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
      
      // Also set data-theme for component libraries that use it
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(`theme-${theme}`);
      root.setAttribute('data-theme', theme);
    }
    
    // Set data attribute for tailwind dark mode
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };
  
  // Save settings to localStorage
  const saveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Prepare updated settings with the current sidebar collapse setting
      const updatedSettings = {
        ...settings,
        sidebarAutoCollapse
      };
      
      // Apply theme settings immediately
      applyThemeSettings(updatedSettings.theme);
      
      // Save to localStorage
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
      
      // Update state
      setSettings(updatedSettings);
      
      // Show success message
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Hide success message after 2 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to save settings:", error);
      setIsSaving(false);
      alert("Failed to save settings. Please try again.");
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  
  const handleNotificationChange = (setting: keyof typeof settings.emailNotifications) => {
    setSettings(prev => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        [setting]: !prev.emailNotifications[setting]
      }
    }));
  };
  
  const handlePrivacyChange = (setting: keyof typeof settings.privacy) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [setting]: !prev.privacy[setting]
      }
    }));
  };
  
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    // Apply theme immediately
    applyThemeSettings(theme);
    
    // Update settings state
    setSettings(prev => ({ ...prev, theme }));
  };
  
  const handleSidebarCollapseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSidebarAutoCollapse(e.target.checked);
  };

  const generateApiKey = () => {
    if (!newKeyName.trim()) return;
    
    setIsGeneratingKey(true);
    
    // Generate a random key
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `sk-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString(),
      lastUsed: null
    };
    
    // Add the key to the settings
    const updatedSettings = {
      ...settings,
      apiKeys: [...settings.apiKeys, newKey]
    };
    
    // Update state
    setSettings(updatedSettings);
    setNewKeyName('');
    setIsGeneratingKey(false);
    
    // Save to localStorage
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
  };
  
  const deleteApiKey = (id: string) => {
    if (window.confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      // Filter out the key to delete
      const updatedSettings = {
        ...settings,
        apiKeys: settings.apiKeys.filter(key => key.id !== id)
      };
      
      // Update state
      setSettings(updatedSettings);
      
      // Save to localStorage
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
    }
  };
  
  const handleImageUpload = () => {
    // Simulate uploading a profile image
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          
          // Update settings with the new profile picture
          const updatedSettings = {
            ...settings,
            profilePicture: imageUrl
          };
          
          // Update state
          setSettings(updatedSettings);
          
          // Save to localStorage
          localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };
  
  const handleDataExport = () => {
    try {
      // Create a JSON blob of the user's settings
      const dataStr = JSON.stringify(settings, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const dataUrl = URL.createObjectURL(dataBlob);
      
      // Create a download link and click it
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = 'oneai-user-settings.json';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      alert('Your data has been exported successfully.');
    } catch (error) {
      console.error("Failed to export data:", error);
      alert("Failed to export data. Please try again.");
    }
  };
  
  const handleAccountDeletion = () => {
    if (window.confirm('Are you absolutely sure you want to delete your account? This action CANNOT be undone and will permanently delete all your data.')) {
      if (window.confirm('This is your last chance. All your data will be permanently deleted. Proceed?')) {
        // Clear all user data from localStorage
        localStorage.removeItem(SETTINGS_STORAGE_KEY);
        localStorage.removeItem('dummyAuth');
        localStorage.removeItem('oneai_recently_viewed');
        
        // Redirect to login page
        window.location.href = '/login';
      }
    }
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
              <p className="text-sm text-gray-600">
                Update your personal details and manage your account
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                      Display Name
                    </label>
                    <input
                      id="displayName"
                      name="displayName"
                      type="text"
                      value={settings.displayName}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={settings.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Change Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/3 flex flex-col items-center justify-start">
                  <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {settings.profilePicture ? (
                      <img 
                        src={settings.profilePicture} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  <button
                    type="button"
                    className="mt-4 text-sm text-primary-600 hover:text-primary-500 flex items-center"
                    onClick={handleImageUpload}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    <span>Upload image</span>
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                variant="primary"
                onClick={saveSettings}
                isLoading={isSaving}
                icon={saveSuccess ? <CheckCircle className="h-4 w-4" /> : undefined}
              >
                {saveSuccess ? 'Saved!' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        );
      
      case 'display':
        return (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Display Settings</h3>
              <p className="text-sm text-gray-600">
                Customize how the platform looks and behaves
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-4">Theme</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    className={`border rounded-lg p-4 flex flex-col items-center ${
                      settings.theme === 'light' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                    }`}
                    onClick={() => handleThemeChange('light')}
                  >
                    <Sun className={`h-8 w-8 ${settings.theme === 'light' ? 'text-primary-600' : 'text-gray-400'}`} />
                    <span className="mt-2 text-sm font-medium">Light Mode</span>
                  </button>
                  
                  <button
                    className={`border rounded-lg p-4 flex flex-col items-center ${
                      settings.theme === 'dark' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                    }`}
                    onClick={() => handleThemeChange('dark')}
                  >
                    <Moon className={`h-8 w-8 ${settings.theme === 'dark' ? 'text-primary-600' : 'text-gray-400'}`} />
                    <span className="mt-2 text-sm font-medium">Dark Mode</span>
                  </button>
                  
                  <button
                    className={`border rounded-lg p-4 flex flex-col items-center ${
                      settings.theme === 'system' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                    }`}
                    onClick={() => handleThemeChange('system')}
                  >
                    <div className="h-8 w-8 flex">
                      <Sun className={`h-8 w-4 ${settings.theme === 'system' ? 'text-primary-600' : 'text-gray-400'}`} />
                      <Moon className={`h-8 w-4 ${settings.theme === 'system' ? 'text-primary-600' : 'text-gray-400'}`} />
                    </div>
                    <span className="mt-2 text-sm font-medium">System Default</span>
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-base font-medium text-gray-900 mb-4">Sidebar</h4>
                <div className="flex items-center">
                  <input
                    id="auto-collapse"
                    type="checkbox"
                    checked={sidebarAutoCollapse}
                    onChange={handleSidebarCollapseChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="auto-collapse" className="ml-2 block text-sm text-gray-700">
                    Auto-collapse sidebar on small screens
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                variant="primary"
                onClick={saveSettings}
                isLoading={isSaving}
                icon={saveSuccess ? <CheckCircle className="h-4 w-4" /> : undefined}
              >
                {saveSuccess ? 'Saved!' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        );
      
      case 'notifications':
        return (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-600">
                Manage how you receive updates and alerts
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-4">Email Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Agent Updates</p>
                      <p className="text-xs text-gray-500">Get notified when agents you've used are updated</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.emailNotifications.agentUpdates}
                        onChange={() => handleNotificationChange('agentUpdates')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Weekly Digest</p>
                      <p className="text-xs text-gray-500">Receive a summary of platform activity each week</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.emailNotifications.weeklyDigest}
                        onChange={() => handleNotificationChange('weeklyDigest')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Platform News</p>
                      <p className="text-xs text-gray-500">Get updates about new features and announcements</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.emailNotifications.platformNews}
                        onChange={() => handleNotificationChange('platformNews')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                variant="primary"
                onClick={saveSettings}
                isLoading={isSaving}
                icon={saveSuccess ? <CheckCircle className="h-4 w-4" /> : undefined}
              >
                {saveSuccess ? 'Saved!' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        );
      
      case 'api':
        return (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">API Keys</h3>
              <p className="text-sm text-gray-600">
                Manage your API keys for programmatic access to the platform
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="mb-6">
                <h4 className="text-base font-medium text-gray-900 mb-4">Your API Keys</h4>
                
                {settings.apiKeys.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-gray-300 rounded-md">
                    <Key className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No API keys</h3>
                    <p className="mt-1 text-sm text-gray-500">Create your first API key to get started</p>
                  </div>
                ) : (
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Key
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Used
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {settings.apiKeys.map((key) => (
                          <tr key={key.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {key.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <code className="bg-gray-100 px-2 py-1 rounded">
                                {`${key.key.substring(0, 5)}...${key.key.substring(key.key.length - 5)}`}
                              </code>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(key.created).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => deleteApiKey(key.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-base font-medium text-gray-900 mb-4">Generate New API Key</h4>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="API Key Name"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                  <Button
                    variant="primary"
                    onClick={generateApiKey}
                    isLoading={isGeneratingKey}
                    disabled={!newKeyName.trim()}
                  >
                    Generate Key
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      case 'privacy':
        return (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
              <p className="text-sm text-gray-600">
                Manage your data privacy and sharing preferences
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Usage Data Sharing</p>
                    <p className="text-xs text-gray-500">
                      Allow anonymized usage data to be collected to improve the platform
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.privacy.shareUsageData}
                      onChange={() => handlePrivacyChange('shareUsageData')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Public Profile</p>
                    <p className="text-xs text-gray-500">
                      Make your profile visible to other users on the platform
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.privacy.publicProfile}
                      onChange={() => handlePrivacyChange('publicProfile')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-base font-medium text-gray-900 mb-4">Data Export & Deletion</h4>
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    onClick={handleDataExport}
                  >
                    Export My Data
                  </Button>
                  <div>
                    <Button 
                      variant="outline" 
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={handleAccountDeletion}
                    >
                      Delete My Account
                    </Button>
                    <p className="mt-2 text-xs text-gray-500">
                      This will permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                variant="primary"
                onClick={saveSettings}
                isLoading={isSaving}
                icon={saveSuccess ? <CheckCircle className="h-4 w-4" /> : undefined}
              >
                {saveSuccess ? 'Saved!' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="animate-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {[
                  { id: 'profile', name: 'Profile', icon: User },
                  { id: 'display', name: 'Display', icon: Sun },
                  { id: 'notifications', name: 'Notifications', icon: Bell },
                  { id: 'api', name: 'API Keys', icon: Key },
                  { id: 'privacy', name: 'Privacy', icon: Shield },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium ${
                        isActive 
                          ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className={`h-5 w-5 ${isActive ? 'text-primary-600' : 'text-gray-400'} mr-3`} />
                        <span>{item.name}</span>
                      </div>
                      <ChevronRight className={`h-4 w-4 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-3/4">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings; 