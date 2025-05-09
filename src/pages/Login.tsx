import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { session } = useAuth();

  // If already authenticated, redirect to dashboard
  if (session) {
    navigate('/');
    return null;
  }

  const handleLogin = async () => {
    setLoading(true);
    
    try {
      // Store a dummy session in localStorage
      const dummyAuth = {
        user: {
          id: 'dummy-user-id',
          email: email || 'user@example.com',
          name: 'Test User'
        },
        token: 'dummy-token-' + Math.random().toString(36).substring(2)
      };
      
      localStorage.setItem('dummyAuth', JSON.stringify(dummyAuth));
      
      // Force a refresh to ensure the auth context picks up the change
      window.location.href = '/';
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center max-w-md w-full p-8">
        <div className="mb-12">
          <img 
            src="/images/3d-ai-robot-character-chat-bot-wink-mascot-icon_107791-30020.png" 
            alt="AI Robot" 
            className="h-40 w-40 object-contain"
          />
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Start Your Journey</h1>
          <h2 className="text-4xl font-bold">with <span className="text-blue-600">AI Agents</span></h2>
        </div>
        
        <div className="w-full mb-4">
          <input
            type="email"
            placeholder="Enter your email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors flex justify-center items-center disabled:opacity-70"
        >
          {loading ? 'Logging in...' : 'Login with WDC AD'}
        </button>
        
        <p className="mt-4 text-sm text-gray-500">
          (Dummy login - click to proceed)
        </p>
      </div>
    </div>
  );
};

export default Login; 