import { useState } from 'react';
import { generateCode, explainCode, debugCode } from '../services/LangChainService';
import DashboardLayout from '../components/layout/DashboardLayout';

export default function AICodeAssistant() {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Generate code state
  const [requirements, setRequirements] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [generatedCode, setGeneratedCode] = useState('');
  
  // Explain code state
  const [codeToExplain, setCodeToExplain] = useState('');
  const [explainLanguage, setExplainLanguage] = useState('javascript');
  const [explanation, setExplanation] = useState('');
  
  // Debug code state
  const [codeToDebug, setCodeToDebug] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [debugLanguage, setDebugLanguage] = useState('javascript');
  const [debugResult, setDebugResult] = useState(null);
  
  // Shared styles
  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '24px',
    overflow: 'hidden'
  };

  const cardHeaderStyle = {
    padding: '16px 20px',
    borderBottom: '1px solid #edf2f7',
    backgroundColor: '#f8f9fa'
  };

  const cardBodyStyle = {
    padding: '20px'
  };

  const headingStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '16px'
  };

  const headingMdStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold'
  };

  const buttonStyle = {
    backgroundColor: '#0064db',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500'
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#a0aec0',
    cursor: 'not-allowed'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500'
  };

  const textareaStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    height: '200px',
    marginBottom: '16px',
    fontFamily: 'monospace'
  };

  const selectStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginBottom: '16px'
  };

  const codeBlockStyle = {
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #edf2f7',
    backgroundColor: '#f8f9fa',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    overflowX: 'auto',
    height: '300px',
    marginTop: '16px'
  };

  const errorStyle = {
    backgroundColor: '#FFF5F5',
    color: '#E53E3E',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '16px'
  };

  const tabListStyle = {
    display: 'flex',
    borderBottom: '1px solid #E2E8F0',
    marginBottom: '24px'
  };

  const tabStyle = {
    padding: '12px 16px',
    cursor: 'pointer',
    borderBottom: '2px solid transparent'
  };

  const activeTabStyle = {
    ...tabStyle,
    borderBottom: '2px solid #0064db',
    color: '#0064db'
  };
  
  const handleGenerateCode = async () => {
    if (!requirements.trim()) {
      alert('Please enter code requirements');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await generateCode(requirements, language);
      if (result.code) {
        setGeneratedCode(result.code);
      } else {
        throw new Error('Failed to generate code');
      }
    } catch (err) {
      setError(err.message);
      alert('Code generation failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExplainCode = async () => {
    if (!codeToExplain.trim()) {
      alert('Please enter code to explain');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await explainCode(codeToExplain, explainLanguage);
      if (result.explanation) {
        setExplanation(result.explanation);
      } else {
        throw new Error('Failed to get explanation');
      }
    } catch (err) {
      setError(err.message);
      alert('Code explanation failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDebugCode = async () => {
    if (!codeToDebug.trim()) {
      alert('Please enter code to debug');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await debugCode(codeToDebug, errorMessage, debugLanguage);
      setDebugResult(result);
    } catch (err) {
      setError(err.message);
      alert('Code debugging failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <DashboardLayout activeItem="ai-code-assistant">
      <div style={{ padding: '20px' }}>
        <h1 style={headingStyle}>AI Code Assistant</h1>
        <p style={{ marginBottom: '16px' }}>
          This page demonstrates our LangChain AI integration for code generation, explanation, and debugging.
        </p>
        
        {/* Tab navigation */}
        <div style={tabListStyle}>
          <div 
            style={activeTab === 0 ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab(0)}
          >
            Generate Code
          </div>
          <div 
            style={activeTab === 1 ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab(1)}
          >
            Explain Code
          </div>
          <div 
            style={activeTab === 2 ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab(2)}
          >
            Debug Code
          </div>
        </div>
        
        {/* Generate Code Panel */}
        {activeTab === 0 && (
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h2 style={headingMdStyle}>Generate Code</h2>
            </div>
            <div style={cardBodyStyle}>
              <div>
                <label style={labelStyle}>Requirements</label>
                <textarea
                  style={textareaStyle}
                  placeholder="Describe what the code should do..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                />
              </div>
              
              <div>
                <label style={labelStyle}>Language</label>
                <select style={selectStyle} value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="typescript">TypeScript</option>
                  <option value="go">Go</option>
                  <option value="ruby">Ruby</option>
                  <option value="php">PHP</option>
                  <option value="csharp">C#</option>
                </select>
              </div>
              
              <button
                style={isLoading ? disabledButtonStyle : buttonStyle}
                onClick={handleGenerateCode}
                disabled={isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate Code'}
              </button>
              
              {isLoading && activeTab === 0 && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div>Loading...</div>
                </div>
              )}
              
              {error && activeTab === 0 && (
                <div style={errorStyle}>{error}</div>
              )}
              
              {generatedCode && (
                <div>
                  <label style={labelStyle}>Generated Code</label>
                  <pre style={codeBlockStyle}>{generatedCode}</pre>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Explain Code Panel */}
        {activeTab === 1 && (
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h2 style={headingMdStyle}>Explain Code</h2>
            </div>
            <div style={cardBodyStyle}>
              <div>
                <label style={labelStyle}>Code to Explain</label>
                <textarea
                  style={textareaStyle}
                  placeholder="Paste the code you want to understand..."
                  value={codeToExplain}
                  onChange={(e) => setCodeToExplain(e.target.value)}
                />
              </div>
              
              <div>
                <label style={labelStyle}>Language</label>
                <select style={selectStyle} value={explainLanguage} onChange={(e) => setExplainLanguage(e.target.value)}>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="typescript">TypeScript</option>
                  <option value="go">Go</option>
                  <option value="ruby">Ruby</option>
                  <option value="php">PHP</option>
                  <option value="csharp">C#</option>
                </select>
              </div>
              
              <button
                style={isLoading ? disabledButtonStyle : buttonStyle}
                onClick={handleExplainCode}
                disabled={isLoading}
              >
                {isLoading ? 'Explaining...' : 'Explain Code'}
              </button>
              
              {isLoading && activeTab === 1 && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div>Loading...</div>
                </div>
              )}
              
              {error && activeTab === 1 && (
                <div style={errorStyle}>{error}</div>
              )}
              
              {explanation && (
                <div>
                  <label style={labelStyle}>Explanation</label>
                  <div style={{ ...codeBlockStyle, backgroundColor: '#EBF8FF', fontFamily: 'inherit' }}>
                    {explanation.split('\n').map((line, i) => (
                      <p key={i} style={{ marginBottom: '8px' }}>{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Debug Code Panel */}
        {activeTab === 2 && (
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h2 style={headingMdStyle}>Debug Code</h2>
            </div>
            <div style={cardBodyStyle}>
              <div>
                <label style={labelStyle}>Code to Debug</label>
                <textarea
                  style={textareaStyle}
                  placeholder="Paste the code with issues..."
                  value={codeToDebug}
                  onChange={(e) => setCodeToDebug(e.target.value)}
                />
              </div>
              
              <div>
                <label style={labelStyle}>Error Message (Optional)</label>
                <textarea
                  style={{ ...textareaStyle, height: '100px' }}
                  placeholder="Paste error messages if available..."
                  value={errorMessage}
                  onChange={(e) => setErrorMessage(e.target.value)}
                />
              </div>
              
              <div>
                <label style={labelStyle}>Language</label>
                <select style={selectStyle} value={debugLanguage} onChange={(e) => setDebugLanguage(e.target.value)}>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="typescript">TypeScript</option>
                  <option value="go">Go</option>
                  <option value="ruby">Ruby</option>
                  <option value="php">PHP</option>
                  <option value="csharp">C#</option>
                </select>
              </div>
              
              <button
                style={isLoading ? disabledButtonStyle : buttonStyle}
                onClick={handleDebugCode}
                disabled={isLoading}
              >
                {isLoading ? 'Debugging...' : 'Debug Code'}
              </button>
              
              {isLoading && activeTab === 2 && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div>Loading...</div>
                </div>
              )}
              
              {error && activeTab === 2 && (
                <div style={errorStyle}>{error}</div>
              )}
              
              {debugResult && (
                <>
                  {debugResult.explanation && (
                    <div>
                      <label style={labelStyle}>Analysis</label>
                      <div style={{ ...codeBlockStyle, backgroundColor: '#FFFAF0', fontFamily: 'inherit' }}>
                        {debugResult.explanation.split('\n').map((line, i) => (
                          <p key={i} style={{ marginBottom: '8px' }}>{line}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {debugResult.fixes && debugResult.fixes.length > 0 && (
                    <div>
                      <label style={labelStyle}>Suggested Fix</label>
                      <pre style={{ ...codeBlockStyle, backgroundColor: '#F0FFF4' }}>
                        {debugResult.fixes[0]?.code || "No fix available"}
                      </pre>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}