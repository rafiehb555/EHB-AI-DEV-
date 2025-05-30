import { useState } from 'react';
import { searchWeb } from '../services/LangChainService';
import DashboardLayout from '../components/layout/DashboardLayout';

export default function AISearch() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      alert('Please enter a search query');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const searchResults = await searchWeb(query);
      
      if (searchResults.error) {
        throw new Error(searchResults.error);
      }
      
      setResults(searchResults);
    } catch (err) {
      setError(err.message);
      alert('Search failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Card component style
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

  const inputStyle = {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginRight: '12px',
    flex: 1
  };

  const errorStyle = {
    backgroundColor: '#FFF5F5',
    color: '#E53E3E',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '16px'
  };

  const resultItemStyle = {
    borderRadius: '4px',
    border: '1px solid #edf2f7',
    padding: '12px',
    marginBottom: '12px'
  };

  return (
    <DashboardLayout activeItem="ai-search">
      <div style={{ padding: '20px' }}>
        <h1 style={headingStyle}>AI-Powered Web Search</h1>
        <p style={{ marginBottom: '16px' }}>
          This page demonstrates our LangChain + SerpAPI integration to provide AI-enhanced web search capabilities.
        </p>
        
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h2 style={headingMdStyle}>Search the Web</h2>
          </div>
          <div style={cardBodyStyle}>
            <div style={{ display: 'flex' }}>
              <input 
                style={inputStyle}
                placeholder="Enter your search query..." 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                onKeyDown={handleKeyDown}
              />
              <button 
                style={buttonStyle}
                onClick={handleSearch} 
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>
        
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div>Loading results...</div>
          </div>
        )}
        
        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}
        
        {results && !isLoading && (
          <>
            {results.answer_box && (
              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <h2 style={headingMdStyle}>Featured Answer</h2>
                </div>
                <div style={cardBodyStyle}>
                  <div>{results.answer_box.answer || results.answer_box.snippet}</div>
                  {results.answer_box.source && (
                    <div style={{ marginTop: '8px', fontSize: '0.875rem', color: '#718096' }}>
                      Source: {results.answer_box.source}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <h2 style={headingMdStyle}>Search Results</h2>
              </div>
              <div style={cardBodyStyle}>
                {results.organic_results && results.organic_results.length > 0 ? (
                  <div>
                    {results.organic_results.map((result, index) => (
                      <div key={index} style={resultItemStyle}>
                        <a 
                          href={result.link} 
                          style={{ color: '#0064db', fontWeight: 'bold', textDecoration: 'none' }}
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {result.title}
                        </a>
                        <div style={{ marginTop: '4px' }}>{result.snippet}</div>
                        <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                          {result.displayed_link || result.link}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>No results found</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}