import React from 'react';
import { TrendingUp, Users, Hash } from 'lucide-react';

const Explore: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-lg border p-6">
        <h1 className="text-2xl font-bold mb-4">Explore</h1>
        <p className="text-muted-foreground mb-6">Discover trending topics and people</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border rounded-lg">
            <TrendingUp className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold mb-2">Trending Topics</h3>
            <p className="text-sm text-muted-foreground">Coming soon...</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <Users className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold mb-2">Popular People</h3>
            <p className="text-sm text-muted-foreground">Coming soon...</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <Hash className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold mb-2">Hashtags</h3>
            <p className="text-sm text-muted-foreground">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
