import React from 'react';
import GenerateDescriptions from '../components/admin/GenerateDescriptions';

const AdminTools: React.FC = () => {
  return (
    <div className="animate-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Tools</h1>
        <p className="text-gray-600 mt-2">
          Administrative utilities for the OneAI platform
        </p>
      </div>
      
      {/* Generate Descriptions Tool */}
      <div>
        <GenerateDescriptions />
      </div>
      
      {/* More admin tools can be added here in the future */}
    </div>
  );
};

export default AdminTools; 