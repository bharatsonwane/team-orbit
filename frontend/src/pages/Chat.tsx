import React, { useState } from 'react';
import { Send, MoreVertical, Phone, Video, Search, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  sender: {
    name: string;
    avatar: string;
  };
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

const Chat: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string>('1');
  const [message, setMessage] = useState('');
  const [chats] = useState<Chat[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      lastMessage: 'That sounds great! Let\'s meet tomorrow.',
      timestamp: '2m ago',
      unreadCount: 2,
      isOnline: true
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      lastMessage: 'Thanks for the help with the project!',
      timestamp: '1h ago',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '3',
      name: 'Emma Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      lastMessage: 'Can you review my latest code?',
      timestamp: '3h ago',
      unreadCount: 1,
      isOnline: true
    }
  ]);

  const [messages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hey! How\'s the project going?',
      timestamp: '10:30 AM',
      isOwn: false,
      sender: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      }
    },
    {
      id: '2',
      content: 'It\'s going really well! I\'ve made a lot of progress on the frontend.',
      timestamp: '10:32 AM',
      isOwn: true,
      sender: {
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      }
    },
    {
      id: '3',
      content: 'That sounds great! Let\'s meet tomorrow to discuss the next steps.',
      timestamp: '10:35 AM',
      isOwn: false,
      sender: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      }
    },
    {
      id: '4',
      content: 'Perfect! I\'ll prepare a demo for you.',
      timestamp: '10:37 AM',
      isOwn: true,
      sender: {
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      }
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Send message logic
      setMessage('');
    }
  };

  const currentChat = chats.find(chat => chat.id === selectedChat);

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-card rounded-lg border overflow-hidden">
      {/* Chat List */}
      <div className="w-80 border-r bg-muted/30">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto h-full">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`p-4 cursor-pointer transition-colors ${
                selectedChat === chat.id ? 'bg-accent' : 'hover:bg-accent/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="h-12 w-12 rounded-full"
                  />
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold truncate">{chat.name}</h3>
                    <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                </div>
                {chat.unreadCount > 0 && (
                  <div className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {chat.unreadCount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={currentChat.avatar}
                    alt={currentChat.name}
                    className="h-10 w-10 rounded-full"
                  />
                  {currentChat.isOnline && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{currentChat.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentChat.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Video className="h-5 w-5" />
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${msg.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {!msg.isOwn && (
                      <img
                        src={msg.sender.avatar}
                        alt={msg.sender.name}
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        msg.isOwn
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${
                        msg.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Select a chat</h3>
              <p>Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
