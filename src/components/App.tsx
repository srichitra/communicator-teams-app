// Simple App.tsx without SignalR testing
import React, { useEffect, useState } from 'react';

interface StoredUser {
  id: number;
  name: string;
  role: string;
  timestamp: number;
}

const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<StoredUser | null>(null);
  const [showUserSelection, setShowUserSelection] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [serverUrl, setServerUrl] = useState<string>('https://1159c43cc98b.ngrok-free.app');
  const [isEditingUrl, setIsEditingUrl] = useState(false);

  // Available users for selection
  const availableUsers = [
    { id: 3052, name: "Janardhanan, Sri", role: "Radiologist" },
    { id: 2010, name: "HUSSEMAN, KENNETE", role: "Technologist" },
    { id: 2011, name: "Oliveira, Stephenson", role: "Tech Lead" },
    { id: 2032, name: "Joshi, Pradi'p", role: "Resident" },
    { id: 3050, name: "Huels, Brandyn", role: "Radiologist" },
    { id: 2031, name: "Treutel, Katlynn", role: "Tech Manager" },
    { id: 2030, name: "Rohan, Avis", role: "Resident" },
    { id: 2029, name: "Gaylord, Caleigh", role: "Tech Manager" },
    { id: 2028, name: "Auer, Breanne", role: "Radiology Clerk" },
    { id: 2026, name: "Macejkovic, Anika", role: "ED Physician" }
  ];

  useEffect(() => {
    initializeApp();
    loadStoredServerUrl();
  }, []);

  const loadStoredServerUrl = () => {
    try {
      const stored = localStorage.getItem('teams_server_url');
      if (stored) {
        setServerUrl(stored);
        console.log('Loaded stored server URL:', stored);
      }
    } catch (error) {
      console.warn('Failed to load stored server URL:', error);
    }
  };

  const saveServerUrl = (url: string) => {
    try {
      localStorage.setItem('teams_server_url', url);
      console.log('Saved server URL:', url);
    } catch (error) {
      console.warn('Failed to save server URL:', error);
    }
  };

  const initializeApp = async () => {
    console.log('Starting app initialization...');
    setIsLoading(true);
    
    // Check for stored user
    const storedUser = getStoredUser();
    if (storedUser && isValidUser(storedUser)) {
      setSelectedUser(storedUser);
      setShowUserSelection(false);
      console.log('Using stored user:', storedUser);
    } else {
      setShowUserSelection(true);
      console.log('No stored user, showing selection');
    }
    
    setIsLoading(false);
  };

  const getStoredUser = (): StoredUser | null => {
    try {
      const stored = localStorage.getItem('teams_selected_user');
      if (stored) {
        const userData = JSON.parse(stored);
        const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        if (Date.now() - userData.timestamp < maxAge) {
          return userData;
        } else {
          localStorage.removeItem('teams_selected_user');
        }
      }
    } catch (error) {
      console.warn('Failed to retrieve stored user:', error);
    }
    return null;
  };

  const storeUser = (user: StoredUser) => {
    try {
      const userData = {
        ...user,
        timestamp: Date.now()
      };
      localStorage.setItem('teams_selected_user', JSON.stringify(userData));
    } catch (error) {
      console.warn('Failed to store user selection:', error);
    }
  };

  const isValidUser = (userData: StoredUser): boolean => {
    return userData && userData.id && userData.name && 
           availableUsers.some(u => u.id === userData.id);
  };

  const handleUserSelection = (userId: number, remember: boolean) => {
    const user = availableUsers.find(u => u.id === userId);
    if (!user) return;

    const userData: StoredUser = {
      id: user.id,
      name: user.name,
      role: user.role,
      timestamp: Date.now()
    };

    setSelectedUser(userData);
    setShowUserSelection(false);

    if (remember) {
      storeUser(userData);
    }

    console.log('User selected:', userData);
  };

  const handleChangeUser = () => {
    setShowUserSelection(true);
    localStorage.removeItem('teams_selected_user');
  };

  const handleServerUrlSubmit = () => {
    let cleanUrl = serverUrl.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    cleanUrl = cleanUrl.replace(/\/+$/, ''); // Remove trailing slashes
    
    setServerUrl(cleanUrl);
    saveServerUrl(cleanUrl);
    setIsEditingUrl(false);
    console.log('Server URL updated to:', cleanUrl);
  };

  const getChatUrl = () => {
    let cleanUrl = serverUrl.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    cleanUrl = cleanUrl.replace(/\/+$/, ''); // Remove trailing slashes
    
    // Build URL matching your existing pattern
    const config = {
      userId: selectedUser?.id || 2010,
      displayName: selectedUser?.name || 'Test User'
    };
    
    return `${cleanUrl}/Teams?userId=${config.userId}&displayName=${encodeURIComponent(config.displayName)}&apiUrl=${encodeURIComponent(cleanUrl)}`;
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        background: '#f5f5f5'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #7c3aed', 
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
        <h3 style={{ color: '#7c3aed', marginBottom: '10px' }}>Loading Communicator...</h3>
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
      </div>
    );
  }

  if (showUserSelection) {
    return (
      <UserSelectionComponent 
        users={availableUsers}
        onUserSelect={handleUserSelection}
      />
    );
  }

  // Main interface when user is selected
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f0f9ff', borderRadius: '8px' }}>
        <h3>💬 Teams Chat Integration</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Server URL:
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {isEditingUrl ? (
              <>
                <input
                  type="text"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  placeholder="https://your-server.ngrok-free.app"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '2px solid #7c3aed',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleServerUrlSubmit()}
                />
                <button 
                  onClick={handleServerUrlSubmit}
                  style={{
                    padding: '8px 16px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Save
                </button>
                <button 
                  onClick={() => setIsEditingUrl(false)}
                  style={{
                    padding: '8px 16px',
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <code style={{
                  flex: 1,
                  padding: '8px 12px',
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}>
                  {serverUrl}
                </code>
                <button 
                  onClick={() => setIsEditingUrl(true)}
                  style={{
                    padding: '8px 16px',
                    background: '#7c3aed',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '14px' }}>
          <span><strong>User:</strong> {selectedUser?.name} ({selectedUser?.role})</span>
          <button 
            onClick={handleChangeUser}
            style={{
              padding: '6px 12px',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Change User
          </button>
        </div>
      </div>

      {/* Chat Interface */}
      <div style={{ 
        border: '2px solid #e5e7eb', 
        borderRadius: '8px',
        overflow: 'hidden',
        height: '700px'
      }}>
        <div style={{
          background: '#f9fafb',
          padding: '8px 16px',
          borderBottom: '1px solid #e5e7eb',
          fontSize: '12px',
          color: '#6b7280'
        }}>
          <strong>Chat URL:</strong> {getChatUrl()}
        </div>
        <iframe
          src={getChatUrl()}
          style={{ width: '100%', height: 'calc(100% - 40px)', border: 'none' }}
          title="Chat Interface"
          onLoad={() => console.log('Chat iframe loaded:', getChatUrl())}
        />
      </div>
    </div>
  );
};

// Simplified User Selection Component
interface UserSelectionProps {
  users: Array<{ id: number; name: string; role: string }>;
  onUserSelect: (userId: number, remember: boolean) => void;
}

const UserSelectionComponent: React.FC<UserSelectionProps> = ({ users, onUserSelect }) => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [rememberChoice, setRememberChoice] = useState(true);

  const selectedUser = users.find(u => u.id === selectedUserId);

  const handleConfirm = () => {
    if (selectedUserId) {
      onUserSelect(selectedUserId, rememberChoice);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }}>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }}>
        <h2 style={{ color: '#7c3aed', marginBottom: '20px' }}>Select Your Profile</h2>

        <select
          value={selectedUserId || ''}
          onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            border: '2px solid #ddd',
            borderRadius: '6px',
            fontSize: '16px'
          }}
        >
          <option value="">-- Select Your Profile --</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.role})
            </option>
          ))}
        </select>

        {selectedUser && (
          <div style={{
            background: '#f8f9fa',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '15px',
            textAlign: 'left'
          }}>
            <strong>{selectedUser.name}</strong><br />
            <span style={{ color: '#666' }}>{selectedUser.role}</span>
          </div>
        )}

        <label style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          <input
            type="checkbox"
            checked={rememberChoice}
            onChange={(e) => setRememberChoice(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          Remember my choice
        </label>

        <button
          onClick={handleConfirm}
          disabled={!selectedUserId}
          style={{
            padding: '12px 24px',
            background: selectedUserId ? '#7c3aed' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: selectedUserId ? 'pointer' : 'not-allowed',
            fontSize: '14px'
          }}
        >
          Start Chatting
        </button>
      </div>
    </div>
  );
};

export default App;