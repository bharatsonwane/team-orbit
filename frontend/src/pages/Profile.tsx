import React from 'react';
import { useParams } from 'react-router-dom';

const Profile: React.FC = () => {
  const { userId } = useParams();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-lg border p-6">
        <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
        <p className="text-muted-foreground">User ID: {userId}</p>
        <p className="text-muted-foreground mt-2">Profile page coming soon...</p>
      </div>
    </div>
  );
};

export default Profile;
