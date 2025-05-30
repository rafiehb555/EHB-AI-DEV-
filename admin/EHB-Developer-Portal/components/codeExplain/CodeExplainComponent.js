import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Markdown with SSR disabled to avoid hydration issues
const ReactMarkdown = dynamic(() => import('react-markdown'), {
  ssr: false,
});

const CodeExplainComponent = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [model, setModel] = useState('');
  const [availableModels, setAvailableModels] = useState([]);
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });

  // Show toast notification
  const showToast = (message, type = 'error') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: '' }), 5000);
  };

  // Fetch status on component mount
  useEffect(() => {
    fetchStatus();
  }, []);

  // Fetch the status of the code explanation service
  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/code/status');
      const data = await response.json();
      
      if (data.success) {
        // Set the default model based on the active provider
        setModel(data.activeProvider || '');
        
        // Extract available models
        const models = [];
        Object.keys(data.providers || {}).forEach(key => {
          if (data.providers[key].available) {
            models.push({
              id: key,
              name: data.providers[key].name
            });
          }
        });
        
        setAvailableModels(models);
        
        if (models.length === 0) {
          setError('No AI models available. Contact the administrator to configure API keys.');
        } else {
          setError(null);
        }
      } else {
        setError(`Failed to connect to code explanation service: ${data.message}`);
      }
    } catch (err) {
      console.error('Error fetching code explanation status:', err);
      setError('Failed to connect to code explanation service');
    }
  };

  // Handle explanation request
  const handleExplain = async () => {
    // Validate input
    if (!code.trim()) {
      showToast('Please enter some code to explain');
      return;
    }

    // Clear previous results
    setExplanation('');
    setError(null);
    setLoading(true);

    try {
      // Call the API
      const response = await fetch('/api/code/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          model,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setExplanation(data.explanation);
      } else {
        setError(`Failed to generate explanation: ${data.message}`);
        showToast(`Failed to generate explanation: ${data.message}`);
      }
    } catch (err) {
      console.error('Error calling code explanation API:', err);
      setError('An error occurred while generating the explanation');
      showToast('An error occurred while generating the explanation');
    } finally {
      setLoading(false);
    }
  };

  const buttonStyle = {
    padding: '10px 16px',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: loading ? 'wait' : 'pointer',
    border: 'none',
    outlineWidth: 0,
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: !code.trim() || availableModels.length === 0 ? '#ccc' : '#0064db',
    color: 'white',
    cursor: !code.trim() || availableModels.length === 0 ? 'not-allowed' : loading ? 'wait' : 'pointer',
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'white',
    color: '#333',
    border: '1px solid #ccc',
    cursor: !code.trim() || loading ? 'not-allowed' : 'pointer',
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 0' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        AI Code Explanation
      </h1>
      
      <p style={{ marginBottom: '1rem' }}>
        Paste your code below and get an AI-powered explanation of what it does and how it works.
      </p>
      
      {/* Toast notification */}
      {toast.visible && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: toast.type === 'error' ? '#f44336' : '#4caf50',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '4px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
        }}>
          <span style={{ marginRight: '8px' }}>
            {toast.type === 'error' ? '⚠️' : '✓'}
          </span>
          {toast.message}
        </div>
      )}
      
      <div style={{ 
        display: 'flex', 
        marginBottom: '1rem', 
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          style={{ 
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '200px',
            backgroundColor: 'white'
          }}
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="csharp">C#</option>
          <option value="cpp">C++</option>
          <option value="go">Go</option>
          <option value="rust">Rust</option>
          <option value="php">PHP</option>
          <option value="ruby">Ruby</option>
          <option value="swift">Swift</option>
          <option value="kotlin">Kotlin</option>
          <option value="solidity">Solidity</option>
          <option value="sql">SQL</option>
        </select>
        
        {availableModels.length > 0 && (
          <select 
            value={model} 
            onChange={(e) => setModel(e.target.value)}
            style={{ 
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '250px',
              backgroundColor: 'white'
            }}
          >
            <option value="">Auto-select best model</option>
            {availableModels.map(m => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        )}
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here..."
          style={{ 
            width: '100%', 
            height: '300px', 
            padding: '12px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontFamily: 'monospace',
            resize: 'vertical'
          }}
        />
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '1.5rem' 
      }}>
        <button
          onClick={handleExplain}
          disabled={!code.trim() || availableModels.length === 0 || loading}
          style={primaryButtonStyle}
        >
          {loading ? 'Analyzing...' : 'Explain Code'}
        </button>
        
        <button
          onClick={() => setCode('')}
          disabled={!code.trim() || loading}
          style={secondaryButtonStyle}
        >
          Clear
        </button>
      </div>
      
      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fff3f3',
          color: '#d32f2f',
          borderRadius: '4px',
          marginBottom: '1rem',
          border: '1px solid #ffcdd2'
        }}>
          <p style={{ fontWeight: 'bold' }}>Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {loading && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          margin: '2.5rem 0' 
        }}>
          <div style={{
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #0064db',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            animation: 'spin 1s linear infinite',
            marginRight: '10px'
          }} />
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <p>Analyzing code with AI...</p>
        </div>
      )}
      
      {explanation && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1.5rem',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          <h2 style={{ 
            fontSize: '1.25rem', 
            marginBottom: '1rem',
            fontWeight: 'bold' 
          }}>
            Code Explanation
          </h2>
          
          <div className="markdown-content" style={{ lineHeight: 1.6 }}>
            <ReactMarkdown>{explanation}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeExplainComponent;