// App.tsx - Enhanced with badge support and user persistence
import React, { useEffect, useState, useRef } from 'react';
import { app, authentication } from '@microsoft/teams-js';

interface TeamsContext {
  user?: {
    id: string;
    displayName: string;
    userPrincipalName: string;
  };
  team?: {
    displayName: string;
    groupId: string;
  };
  channel?: {
    displayName: string;
    id: string;
  };
}

interface StoredUser {
  id: number;
  name: string;
  role: string;
  timestamp: number;
}

interface UnreadCounts {
  individual: number;
  group: number;
  total: number;
}

const App: React.FC = () => {
  const [isTeamsInitialized, setIsTeamsInitialized] = useState(false);
  const [teamsContext, setTeamsContext] = useState<TeamsContext | null>(null);
  const [showUserSelection, setShowUserSelection] = useState(false);
  const [selectedUser, setSelectedUser] = useState<StoredUser | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<UnreadCounts>({ individual: 0, group: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
    { id: 2026, name: "Macejkovic, Anika", role: "ED Physician" },
    { id: 2024, name: "Treutel, Bennie", role: "Radiology Nurse" },
    { id: 2023, name: "Lehner, Annamarie", role: "Manager" },
    { id: 2022, name: "Fay, Nadia", role: "Radiology Tech" },
    { id: 2009, name: "Kothapalli, Pravallika", role: "Radiology Tech" }
  ];

  useEffect(() => {
    initializeTeams();
  }, []);

  const initializeTeams = async () => {
    try {
      // Initialize Teams SDK
      await app.initialize();
      setIsTeamsInitialized(true);
      
      // Get Teams context
      const context = await app.getContext();
      setTeamsContext(context);
      
      console.log('Teams context:', context);

      // Check for stored user
      const storedUser = getStoredUser();
      if (storedUser && isValidUser(storedUser)) {
        setSelectedUser(storedUser);
        setShowUserSelection(false);
        // Initialize notifications for this user
        await initializeNotifications();
      } else {
        setShowUserSelection(true);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize Teams:', error);
      setIsLoading(false);
      // Still show user selection if Teams fails
      setShowUserSelection(true);
    }
  };

  const initializeNotifications = async () => {
    if (!isTeamsInitialized || !selectedUser) return;

    try {
      // Set up notification handlers
      setupNotificationSystem();
      
      // Request notification permissions
      await app.notificationPermission.requestPermission();
      
      console.log('Notifications initialized for user:', selectedUser.name);
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  };

  const setupNotificationSystem = () => {
    // Listen for messages from iframe (your chat app)
    window.addEventListener('message', (event) => {
      if (event.origin !== 'https://1159c43cc98b.ngrok-free.app') return;
      
      if (event.data.type === 'UNREAD_COUNT_UPDATE') {
        const { individual, group, total } = event.data.counts;
        setUnreadCounts({ individual, group, total });
        updateTeamsBadge(total);
      }
      
      if (event.data.type === 'NEW_MESSAGE') {
        const { from, message, isGroup } = event.data;
        showTeamsNotification(from, message, isGroup);
      }
    });
  };

  const updateTeamsBadge = async (count: number) => {
    if (!isTeamsInitialized) return;

    try {
      // Update document title for visibility
      if (count > 0) {
        document.title = `(${count}) Communicator POC`;
        
        // Try to update Teams badge using activity feed
        if (app.notificationPermission) {
          await app.notificationPermission.requestPermission();
        }
        
        // Update favicon with red dot
        updateFavicon(count > 0);
        
      } else {
        document.title = 'Communicator POC';
        updateFavicon(false);
      }
    } catch (error) {
      console.error('Failed to update Teams badge:', error);
    }
  };

  const updateFavicon = (hasNotifications: boolean) => {
    const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (!favicon) return;

    if (hasNotifications) {
      // Create canvas with red notification dot
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Draw base icon (purple background)
        ctx.fillStyle = '#7c3aed';
        ctx.fillRect(0, 0, 32, 32);
        
        // Draw white "C" for Communicator
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('C', 16, 22);
        
        // Draw red notification dot
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.arc(24, 8, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        favicon.href = canvas.toDataURL('image/png');
      }
    } else {
      // Reset to original favicon
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.fillStyle = '#7c3aed';
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('C', 16, 22);
        
        favicon.href = canvas.toDataURL('image/png');
      }
    }
  };

  const showTeamsNotification = async (from: string, message: string, isGroup: boolean) => {
    if (!isTeamsInitialized) return;

    try {
      // Show browser notification if Teams notification fails
      if (Notification.permission === 'granted') {
        new Notification(`${isGroup ? 'Group' : 'Direct'} Message from ${from}`, {
          body: message,
          icon: '/color.png',
          badge: '/outline.png'
        });
      }
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  };

  const getStoredUser = (): StoredUser | null => {
    try {
      const stored = localStorage.getItem('teams_selected_user');
      if (stored) {
        const userData = JSON.parse(stored);
        // Check if data is not too old (30 days)
        const maxAge = 30 * 24 * 60 * 60 * 1000;
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

    // Initialize notifications after user selection
    initializeNotifications();
  };

  const handleChangeUser = () => {
    setShowUserSelection(true);
    // Optionally clear stored user
    localStorage.removeItem('teams_selected_user');
  };

  // Send user data to iframe when it loads
  const handleIframeLoad = () => {
    if (iframeRef.current && selectedUser) {
      const message = {
        type: 'USER_SELECTED',
        user: selectedUser,
        teamsContext: teamsContext
      };
      
      iframeRef.current.contentWindow?.postMessage(message, 'https://1159c43cc98b.ngrok-free.app');
    }
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
        <p style={{ color: '#666' }}>Initializing Teams integration</p>
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
        teamsContext={teamsContext}
      />
    );
  }

  const chatUrl = selectedUser 
    ? `https://1159c43cc98b.ngrok-free.app/Teams/Index?userId=${selectedUser.id}&displayName=${encodeURIComponent(selectedUser.name)}&role=${encodeURIComponent(selectedUser.role)}`
    : 'https://1159c43cc98b.ngrok-free.app';

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      {/* Current User Info Bar */}
      {selectedUser && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(124, 58, 237, 0.1)',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#7c3aed',
          zIndex: 1000,
          border: '1px solid rgba(124, 58, 237, 0.2)'
        }}>
          <span>{selectedUser.name} ({selectedUser.role})</span>
          {unreadCounts.total > 0 && (
            <span style={{
              background: '#ff4444',
              color: 'white',
              borderRadius: '50%',
              padding: '2px 6px',
              fontSize: '10px',
              marginLeft: '8px'
            }}>
              {unreadCounts.total}
            </span>
          )}
          <button 
            onClick={handleChangeUser}
            style={{
              background: 'none',
              border: '1px solid #7c3aed',
              color: '#7c3aed',
              padding: '4px 8px',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '11px',
              marginLeft: '8px'
            }}
          >
            Change
          </button>
        </div>
      )}

      {/* Chat Interface */}
      <iframe
        ref={iframeRef}
        src={chatUrl}
        style={{
          width: '100%',
          height: '100%',
          border: 'none'
        }}
        onLoad={handleIframeLoad}
        title="Communicator Chat Interface"
      />
    </div>
  );
};

// User Selection Component
interface UserSelectionProps {
  users: Array<{ id: number; name: string; role: string }>;
  onUserSelect: (userId: number, remember: boolean) => void;
  teamsContext: TeamsContext | null;
}

const UserSelectionComponent: React.FC<UserSelectionProps> = ({ users, onUserSelect, teamsContext }) => {
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
        <h2 style={{ color: '#7c3aed', marginBottom: '10px' }}>Select Your Profile</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Choose your user profile to start using Communicator in Teams
        </p>

        {teamsContext?.user && (
          <div style={{
            background: '#f0f9ff',
            border: '1px solid #0ea5e9',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            <strong>Teams User:</strong> {teamsContext.user.displayName}
          </div>
        )}

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
          Remember my choice for future sessions
        </label>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
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
    </div>
  );
};

export default App;