import React from 'react';
import { Heart, MessageCircle, UserPlus, Share } from 'lucide-react';

const Notifications: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card rounded-lg border p-6">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        <p className="text-muted-foreground mb-6">Stay updated with what's happening</p>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Heart className="h-6 w-6 text-red-500" />
              <div className="flex-1">
                <p className="text-sm"><span className="font-semibold">Sarah Johnson</span> liked your post</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-6 w-6 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm"><span className="font-semibold">Mike Chen</span> commented on your post</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <UserPlus className="h-6 w-6 text-green-500" />
              <div className="flex-1">
                <p className="text-sm"><span className="font-semibold">Emma Davis</span> started following you</p>
                <p className="text-xs text-muted-foreground">3 hours ago</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Share className="h-6 w-6 text-purple-500" />
              <div className="flex-1">
                <p className="text-sm"><span className="font-semibold">Alex Smith</span> shared your post</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
