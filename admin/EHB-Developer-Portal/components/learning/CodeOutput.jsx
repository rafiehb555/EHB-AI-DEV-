import React from 'react';
import {
  Box,
  Text,
  Flex,
  Spinner,
  useColorModeValue
} from '@chakra-ui/react';

/**
 * CodeOutput Component
 * 
 * Displays the output of code execution with proper formatting.
 */
const CodeOutput = ({
  output,
  isLoading = false,
  error = null,
  height = '400px'
}) => {
  const bgColor = useColorModeValue('black', 'gray.900');
  const textColor = useColorModeValue('green.400', 'green.300');
  const errorColor = useColorModeValue('red.400', 'red.300');
  
  return (
    <Box
      position="relative"
      borderRadius="md"
      overflow="hidden"
      height={height}
      bg={bgColor}
    >
      {isLoading ? (
        <Flex
          justify="center"
          align="center"
          height="100%"
          width="100%"
          color="white"
        >
          <Spinner size="md" color={textColor} mr={3} />
          <Text>Running code...</Text>
        </Flex>
      ) : (
        <Box
          p={4}
          height="100%"
          width="100%"
          color={error ? errorColor : textColor}
          fontFamily="monospace"
          fontSize="14px"
          overflowY="auto"
          sx={{
            '&::-webkit-scrollbar': {
              width: '8px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px'
            }
          }}
        >
          {error ? (
            <Text color={errorColor} fontWeight="bold" mb={2}>
              Error:
            </Text>
          ) : null}
          
          {output ? (
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              {output}
            </pre>
          ) : error ? (
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              {error}
            </pre>
          ) : (
            <Text color="gray.500" fontStyle="italic">
              Run your code to see output here
            </Text>
          )}
        </Box>
      )}
      
      {/* Simulated terminal prompt */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        py={2}
        px={4}
        bg="rgba(0, 0, 0, 0.8)"
        borderTop="1px solid"
        borderColor="gray.700"
        display={isLoading ? 'none' : 'flex'}
        alignItems="center"
      >
        <Text color="gray.400" fontSize="sm" fontFamily="monospace">
          {error ? 'x' : '>'} EHB-Playground
        </Text>
      </Box>
    </Box>
  );
};

export default CodeOutput;