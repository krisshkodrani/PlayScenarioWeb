
import React from 'react';
import PageHeader from '@/components/navigation/PageHeader';

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Profile Settings"
          subtitle="Manage your account preferences and information"
          showBackButton={true}
        />
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
            <h2 className="text-xl font-semibold text-white mb-4">Profile Management</h2>
            <p className="text-slate-400 mb-6">
              User profile management features will be implemented here.
            </p>
            <div className="space-y-4 text-sm text-slate-300">
              <p>• Account information editing</p>
              <p>• Password management</p>
              <p>• Notification preferences</p>
              <p>• Avatar upload</p>
              <p>• Privacy settings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
