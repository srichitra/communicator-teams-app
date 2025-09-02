import React, { useState, useEffect } from 'react';
import { Settings, ArrowRight, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const Tab = () => {
  const [config, setConfig] = useState({
    baseUrl: 'https://d0faed72b9cb.ngrok-free.app',
    userId: '',
    displayName: ''
  });
  const [isConfigured, setIsConfigured] = useState(false);
  const [showConfig, setShowConfig] = useState(true);
  const [connectionError, setConnectionError] = useState('');

  // Demo users list (same as in Index.cshtml)
  const demoUsers = [
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

  // Fix for Teams rendering
  const containerStyle = {
    width: '100%',
    height: '100vh',
    backgroundColor: '#1a1a1a',
    color: 'white',
    overflow: 'hidden'
  };

  const configContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '20px'
  };

  const formStyle = {
    backgroundColor: '#2d2d2d',
    padding: '30px',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #444',
    borderRadius: '4px',
    color: 'white',
    fontSize: '14px'
  };

  const selectStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #444',
    borderRadius: '4px',
    color: 'white',
    fontSize: '14px'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#7c3aed',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  };

  const handleUserSelection = (userId) => {
    const selectedUser = demoUsers.find(user => user.id.toString() === userId);
    if (selectedUser) {
      setConfig({
        ...config,
        userId: userId,
        displayName: selectedUser.name
      });
      setConnectionError('');
    }
  };

  const handleConnect = () => {
    if (!config.baseUrl || !config.userId || !config.displayName) {
      setConnectionError('Please fill in all fields');
      return;
    }
    localStorage.setItem('communicatorPOCConfig', JSON.stringify(config));
    setIsConfigured(true);
    setShowConfig(false);
  };

  const getChatUrl = () => {
    const cleanUrl = config.baseUrl.replace(/\/$/, '');
    return `${cleanUrl}/Teams?userId=${config.userId}&displayName=${encodeURIComponent(config.displayName)}&apiUrl=${encodeURIComponent(cleanUrl)}`;
  };

  if (showConfig) {
    return (
      <div style={containerStyle}>
        <div style={configContainerStyle}>
          <div style={formStyle}>
            <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Communicator POC</h2>
            
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
              Server URL
            </label>
            <input
              type="url"
              value={config.baseUrl}
              onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
              placeholder="https://your-server.ngrok-free.app"
              style={inputStyle}
            />
            
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
              Select User
            </label>
            <select
              value={config.userId}
              onChange={(e) => handleUserSelection(e.target.value)}
              style={selectStyle}
            >
              <option value="">Choose a user...</option>
              {demoUsers.map(user => (
                <option key={user.id} value={user.id.toString()}>
                  {user.id} - {user.name} ({user.role})
                </option>
              ))}
            </select>
            
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
              Display Name (Auto-populated)
            </label>
            <input
              type="text"
              value={config.displayName}
              onChange={(e) => setConfig({ ...config, displayName: e.target.value })}
              placeholder="Name will auto-populate"
              style={inputStyle}
              readOnly
            />
            
            {connectionError && (
              <div style={{ color: '#ef4444', marginBottom: '10px', fontSize: '14px' }}>
                {connectionError}
              </div>
            )}
            
            <button onClick={handleConnect} style={buttonStyle}>
              Connect to Communicator
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        backgroundColor: '#2d2d2d', 
        padding: '10px 20px', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #444'
      }}>
        <span style={{ color: 'white', fontSize: '14px' }}>
          Connected to {config.baseUrl} as {config.displayName} (ID: {config.userId})
        </span>
        <button 
          onClick={() => setShowConfig(true)}
          style={{ 
            padding: '5px 10px', 
            backgroundColor: '#444', 
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
      
      <iframe
        src={getChatUrl()}
        style={{ 
          width: '100%', 
          flex: 1, 
          border: 'none' 
        }}
        title="Communicator Chat"
      />
    </div>
  );
};

export default Tab;