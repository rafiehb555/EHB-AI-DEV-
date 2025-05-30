import React, { useRef, useEffect } from 'react';
import {
  Box,
  useColorModeValue,
} from '@chakra-ui/react';

/**
 * CodeEditor Component
 * 
 * A simple code editor component with syntax highlighting.
 * In a real application, this would be implemented with a proper code editor
 * like Monaco, CodeMirror, or Ace Editor.
 */
const CodeEditor = ({
  code,
  onChange,
  language = 'javascript',
  height = '400px',
  fontSize = '14px',
  readOnly = false,
}) => {
  const editorRef = useRef(null);
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  
  useEffect(() => {
    // In a real implementation, this would initialize a code editor like Monaco
    // For this demo, we'll use a simple textarea with some styling
    if (editorRef.current) {
      editorRef.current.value = code;
    }
  }, [code]);
  
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };
  
  // Function to add line numbers and minimal syntax highlighting
  const formatWithLineNumbers = (code) => {
    if (!code) return '';
    
    const lines = code.split('\n');
    const maxLineNumWidth = String(lines.length).length;
    
    return lines.map((line, i) => (
      `<span style="color: #999; width: ${maxLineNumWidth + 2}ch; display: inline-block; text-align: right; padding-right: 0.5em; user-select: none;">${i + 1}</span>${highlightSyntax(line)}`
    )).join('\n');
  };
  
  // Very simple syntax highlighting for demonstration
  const highlightSyntax = (line) => {
    // This is a very simplified version of syntax highlighting
    // A real implementation would use a proper syntax highlighting library
    if (language === 'javascript') {
      return line
        .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await)\b/g, '<span style="color: #569cd6;">$1</span>')
        .replace(/\b(true|false|null|undefined|this)\b/g, '<span style="color: #569cd6;">$1</span>')
        .replace(/("[^"]*")|('[^']*')|(`[^`]*`)/g, '<span style="color: #ce9178;">$1</span>')
        .replace(/\/\/.*/g, '<span style="color: #6a9955;">$&</span>')
        .replace(/\b(\d+)\b/g, '<span style="color: #b5cea8;">$1</span>');
    }
    return line;
  };
  
  // Simple editor implementation using a textarea
  // In a real application, this would be replaced with a proper code editor
  return (
    <Box
      position="relative"
      borderRadius="md"
      borderWidth="1px"
      borderColor={borderColor}
      overflow="hidden"
      height={height}
    >
      <textarea
        ref={editorRef}
        value={code}
        onChange={handleChange}
        style={{
          width: '100%',
          height: '100%',
          padding: '16px',
          fontFamily: 'monospace',
          fontSize,
          color: textColor,
          backgroundColor: bgColor,
          border: 'none',
          outline: 'none',
          resize: 'none',
          lineHeight: 1.5,
          tabSize: 2,
        }}
        readOnly={readOnly}
        spellCheck="false"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        data-gramm="false"
      />
    </Box>
  );
};

export default CodeEditor;