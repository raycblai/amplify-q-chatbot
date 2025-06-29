import React, { useState, useEffect } from 'react';
import { API_CONFIG, getApiUrl } from './config';
import './App.css';

// Try to import Amplify outputs (will exist after deployment)
let amplifyOutputs = null;
try {
  amplifyOutputs = require('./amplify_outputs.json');
} catch (e) {
  console.log('No amplify_outputs.json found - using local development mode');
}

function App() {
  const [displayText, setDisplayText] = useState('');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState('checking');
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    // Set API URL based on environment
    const url = getApiUrl(amplifyOutputs);
    setApiUrl(url);
    
    // Check server status
    checkServerStatus(url);
  }, []);

  const checkServerStatus = async (url) => {
    try {
      const healthUrl = API_CONFIG.useLocalProxy ? `${url}/health` : `${url}/bedrock-chat`;
      const method = API_CONFIG.useLocalProxy ? 'GET' : 'OPTIONS';
      
      const response = await fetch(healthUrl, { method });
      if (response.ok || response.status === 200) {
        setServerStatus('connected');
        console.log('✅ API server is accessible');
      } else {
        setServerStatus('error');
      }
    } catch (err) {
      setServerStatus('error');
      console.log('❌ API server not accessible:', err.message);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    if (serverStatus !== 'connected') {
      setError('API server is not accessible. Please check the connection.');
      return;
    }

    setIsLoading(true);
    setError('');
    setDisplayText('🤔 Claude is thinking...');

    try {
      const endpoint = `${apiUrl}/bedrock-chat`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputText
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Display the AI response
      setDisplayText(data.response);
      setInputText(''); // Clear the input field after sending

    } catch (err) {
      console.error('Error calling Bedrock:', err);
      setError(`Failed to get AI response: ${err.message}`);
      setDisplayText('❌ Sorry, I encountered an error. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  const getServerStatusDisplay = () => {
    const mode = API_CONFIG.useLocalProxy ? 'Local' : 'Production';
    
    switch (serverStatus) {
      case 'checking':
        return { text: `Checking ${mode} server...`, color: '#ffa500' };
      case 'connected':
        return { text: `Connected to ${mode} API`, color: '#4caf50' };
      case 'error':
        return { text: `${mode} API not accessible`, color: '#f44336' };
      default:
        return { text: 'Unknown status', color: '#666' };
    }
  };

  const statusDisplay = getServerStatusDisplay();

  return (
    <div className="App">
      {/* Upper Section - Display Area */}
      <div className="display-section">
        <h2>AI Response Area</h2>
        <div className="model-info">
          <span className="model-badge">Claude 3.5 Haiku via Amazon Bedrock</span>
          <span className="region-badge">Region: us-west-2</span>
          <span 
            className="status-badge" 
            style={{ backgroundColor: statusDisplay.color }}
          >
            {statusDisplay.text}
          </span>
        </div>
        <div className="display-content">
          {displayText ? (
            <div className="displayed-text">
              {displayText.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          ) : (
            <p className="placeholder-text">Ask Claude anything and the response will appear here...</p>
          )}
        </div>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>

      {/* Lower Section - Input Area */}
      <div className="input-section">
        <h2>Ask Claude</h2>
        <div className="input-container">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question here..."
            className="text-input"
            disabled={isLoading || serverStatus !== 'connected'}
          />
          <button 
            onClick={handleSend}
            className="send-button"
            disabled={!inputText.trim() || isLoading || serverStatus !== 'connected'}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Thinking...
              </>
            ) : (
              'Send'
            )}
          </button>
        </div>
        <div className="input-hint">
          <p>💡 Try asking: "Explain quantum computing" or "Write a haiku about coding"</p>
          <div className="environment-info">
            <p>🌍 Environment: {process.env.NODE_ENV || 'development'}</p>
            <p>🔗 API: {apiUrl || 'Not configured'}</p>
          </div>
          {serverStatus === 'error' && API_CONFIG.useLocalProxy && (
            <p className="server-error">
              ⚠️ Start the proxy server first: <code>npm run server</code>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
