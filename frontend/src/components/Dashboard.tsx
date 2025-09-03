import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';
import { User } from '../types/user';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome to Lokvani, {user?.name}!</h1>
        <button onClick={handleLogout} className="btn-secondary">
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        <section className="user-profile">
          <h2>Your Profile</h2>
          <div className="profile-info">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Member since:</strong> {new Date(user?.createdAt || '').toLocaleDateString()}</p>
          </div>
        </section>

        <section className="users-list">
          <h2>All Users</h2>
          {error && <div className="error-message">{error}</div>}
          
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <div className="users-grid">
              {users.map((user) => (
                <div key={user.id} className="user-card">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <small>Joined: {new Date(user.createdAt).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
