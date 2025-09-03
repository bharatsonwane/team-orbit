import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from '../theme-toggle';
import Home from '../../pages/Home';
import Profile from '../../pages/Profile';
import Chat from '../../pages/Chat';
import Explore from '../../pages/Explore';
import Notifications from '../../pages/Notifications';
import { 
  Home as HomeIcon, 
  Search, 
  MessageCircle, 
  Bell, 
  User, 
  LogOut,
  Plus
} from 'lucide-react';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Home', href: '/app', icon: HomeIcon },
    { name: 'Explore', href: '/app/explore', icon: Search },
    { name: 'Chat', href: '/app/chat', icon: MessageCircle },
    { name: 'Notifications', href: '/app/notifications', icon: Bell },
    { name: 'Profile', href: `/app/profile/${user?.id}`, icon: User },
  ];

  // Authentication is now handled at the route level

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">L</span>
            </div>
            <h1 className="text-xl font-bold text-primary">Lokvani</h1>
          </div>
          
          <div className="flex-1 flex justify-center">
            <div className="flex space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.href)}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary text-primary-foreground shadow-lg' 
                        : 'hover:bg-accent hover:text-foreground hover:shadow-md'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="hidden md:block font-medium">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              <Plus className="h-5 w-5" />
              <span className="hidden md:block font-medium">Post</span>
            </button>
            
            <ThemeToggle />
            
            <div className="flex items-center space-x-3">
              <img
                src={user?.profilePicture || 'https://via.placeholder.com/32x32'}
                alt={`${user?.firstName} ${user?.lastName}`}
                className="h-10 w-10 rounded-full ring-2 ring-primary/20"
              />
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:block font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="profile/:userId" element={<Profile />} />
          <Route path="chat" element={<Chat />} />
          <Route path="explore" element={<Explore />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="admin" element={<div className="p-6"><h1 className="text-2xl font-bold">Admin Dashboard</h1><p>Admin-only content</p></div>} />
          <Route path="admin/users" element={<div className="p-6"><h1 className="text-2xl font-bold">User Management</h1><p>Manage users</p></div>} />
        </Routes>
      </main>
    </div>
  );
};

export default Layout;
