import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import AgentDiscovery from './pages/AgentDiscovery';
import AgentDetail from './pages/AgentDetail';
import AgentRegistration from './pages/AgentRegistration';
import AdminTools from './pages/AdminTools';
import Login from './pages/Login';
import { useAuth } from './lib/AuthContext';

function App() {
  const { session, loading } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={session ? <Navigate to="/" /> : <Login />} />
        
        {/* Protected routes */}
        <Route 
          path="/" 
          element={session ? <Layout /> : <Navigate to="/login" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="discover" element={<AgentDiscovery />} />
          <Route path="agents/:id" element={<AgentDetail />} />
          <Route path="register" element={<AgentRegistration />} />
          <Route path="admin" element={<AdminTools />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;