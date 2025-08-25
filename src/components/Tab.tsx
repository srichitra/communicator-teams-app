import React, { useState, useEffect } from 'react';
import { Settings, ArrowRight, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const Tab = () => {
  const [config, setConfig] = useState({
    baseUrl: 'https://6e69cba8ce61.ngrok-free.app',
    userId: '2010',
    displayName: 'HUSSEMAN, KENNETE'
  });
  const [isConfigured, setIsConfigured] = useState(false);
  const [showConfig, setShowConfig] = useState(true);
  const [connectionError, setConnectionError] = useState('');

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
    return `${cleanUrl}/Teams?userId=${config.userId}&displayName=${encodeURIComponent(config.displayName)}`;
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
              User ID
            </label>
            <input
              type="text"
              value={config.userId}
              onChange={(e) => setConfig({ ...config, userId: e.target.value })}
              placeholder="2009"
              style={inputStyle}
            />
            
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
              Display Name
            </label>
            <input
              type="text"
              value={config.displayName}
              onChange={(e) => setConfig({ ...config, displayName: e.target.value })}
              placeholder="Your Name"
              style={inputStyle}
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
          Connected to {config.baseUrl} as {config.displayName}
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
          Change Server
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