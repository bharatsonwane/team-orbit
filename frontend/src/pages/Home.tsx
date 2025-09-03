import React, { useState } from 'react';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from 'lucide-react';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    handle: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  isLiked: boolean;
  isBookmarked: boolean;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        handle: '@sarahj'
      },
      content: 'Just finished building my first React app! The journey from HTML/CSS to React has been incredible. What should I build next? 🚀 #React #WebDev #Coding',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
      likes: 42,
      comments: 8,
      shares: 3,
      timestamp: '2h ago',
      isLiked: false,
      isBookmarked: false
    },
    {
      id: '2',
      author: {
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        handle: '@mikechen'
      },
      content: 'Coffee and code - the perfect combination for a productive Saturday morning! ☕️💻 Working on some new features for our app.',
      likes: 28,
      comments: 5,
      shares: 1,
      timestamp: '4h ago',
      isLiked: true,
      isBookmarked: false
    },
    {
      id: '3',
      author: {
        name: 'Emma Davis',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        handle: '@emmadavis'
      },
      content: 'Just deployed my portfolio website! Check it out and let me know what you think. Always open to feedback and suggestions! 🌟',
      likes: 67,
      comments: 12,
      shares: 7,
      timestamp: '6h ago',
      isLiked: false,
      isBookmarked: true
    }
  ]);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Post */}
      <div className="bg-card rounded-xl border shadow-lg p-6">
        <div className="flex space-x-4">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            alt="Your avatar"
            className="h-12 w-12 rounded-full ring-2 ring-primary/20"
          />
          <div className="flex-1">
            <textarea
              placeholder="What's on your mind?"
              className="w-full p-4 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background transition-all duration-200 hover:border-primary/50"
              rows={3}
            />
            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-3">
                <button className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200">
                  📷
                </button>
                <button className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200">
                  🎥
                </button>
                <button className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200">
                  📍
                </button>
              </div>
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-card rounded-xl border shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            {/* Post Header */}
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="h-12 w-12 rounded-full ring-2 ring-primary/20"
                />
                <div>
                  <div className="font-semibold text-lg">{post.author.name}</div>
                  <div className="text-sm text-muted-foreground">{post.author.handle} • {post.timestamp}</div>
                </div>
              </div>
              <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            {/* Post Content */}
            <div className="px-6 pb-6">
              <p className="text-foreground mb-4 text-lg leading-relaxed">{post.content}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt="Post image"
                  className="w-full rounded-xl mb-4 shadow-md"
                />
              )}
            </div>

            {/* Post Actions */}
            <div className="px-6 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-8">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 hover:bg-accent ${
                      post.isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Heart className={`h-6 w-6 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span className="font-medium">{post.likes}</span>
                  </button>
                  
                  <button className="flex items-center space-x-3 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200">
                    <MessageCircle className="h-6 w-6" />
                    <span className="font-medium">{post.comments}</span>
                  </button>
                  
                  <button className="flex items-center space-x-3 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200">
                    <Share className="h-6 w-6" />
                    <span className="font-medium">{post.shares}</span>
                  </button>
                </div>
                
                <button
                  onClick={() => handleBookmark(post.id)}
                  className={`p-3 rounded-lg transition-all duration-200 hover:bg-accent ${
                    post.isBookmarked ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Bookmark className={`h-6 w-6 ${post.isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
