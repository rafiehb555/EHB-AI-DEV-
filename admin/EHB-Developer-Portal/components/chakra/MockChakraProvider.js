import React from 'react';

// Simple wrapper that just returns children without using Chakra
// This fixes the "_config is undefined" error by avoiding Chakra entirely
const MockChakraProvider = ({ children }) => {
  return (
    <div className="mock-chakra-provider">
      {children}
    </div>
  );
};

export default MockChakraProvider;