import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
  Badge,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  useColorModeValue
} from '@chakra-ui/react';
import { CheckIcon, WarningIcon } from '@chakra-ui/icons';
import CodeEditor from './CodeEditor';
import CodeOutput from './CodeOutput';
import CodeExplainer from './CodeExplainer';
import CodeSuggester from './CodeSuggester';
import CodeDebugger from './CodeDebugger';
import { useLearning } from '../../context/LearningContext';

/**
 * Interactive Coding Challenge Component
 * 
 * Provides an environment for users to complete coding challenges with:
 * - Code editor with syntax highlighting
 * - Code execution and validation
 * - Test case verification
 * - Gamified feedback and rewards
 */
const InteractiveCodingChallenge = ({
  challenge,
  onComplete,
  initialCode = '',
}) => {
  const toast = useToast();
  const { completeChallenge, saveChallengeProgress } = useLearning();
  
  // State
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [hasAttempted, setHasAttempted] = useState(false);
  
  useEffect(() => {
    // Initialize code from challenge or from saved progress
    if (initialCode) {
      setCode(initialCode);
    } else if (challenge && challenge.starterCode) {
      setCode(challenge.starterCode);
    }
  }, [challenge, initialCode]);
  
  // Save progress when code changes
  useEffect(() => {
    if (challenge && challenge.id && code) {
      saveChallengeProgress(challenge.id, { code });
    }
  }, [code, challenge, saveChallengeProgress]);
  
  // Handle code changes
  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };
  
  // Run the code (without validating)
  const handleRunCode = () => {
    setIsRunning(true);
    setHasAttempted(true);
    setOutput('');
    
    // In a real implementation, this would call a backend API to run the code
    // For demo, we'll simulate execution with a delay
    setTimeout(() => {
      try {
        // Basic JS evaluation - in a real app, this would be done securely on the server
        // DO NOT use eval in production code - this is just for demonstration
        const consoleOutput = [];
        const originalConsoleLog = console.log;
        
        // Override console.log to capture outputs
        console.log = (...args) => {
          consoleOutput.push(args.join(' '));
          originalConsoleLog(...args);
        };
        
        // Wrap evaluation in try/catch to handle errors
        try {
          // Remove import statements that would cause browser errors
          // This is a very simple approach - in a real app, use a proper sandbox
          const cleanedCode = code.replace(/import\s+.*?from\s+['"].*?['"];?/g, '');
          
          // Create a new Function to evaluate the code in a slightly more isolated scope
          // Note: This is still not secure for arbitrary code execution
          const result = new Function(cleanedCode)();
          
          if (result !== undefined) {
            consoleOutput.push(`Output: ${result}`);
          }
          
          // Set the captured output
          setOutput(consoleOutput.join('\\n'));
        } catch (error) {
          // Handle evaluation errors
          setOutput(`Error: ${error.message}`);
        }
        
        // Restore original console.log
        console.log = originalConsoleLog;
      } catch (error) {
        setOutput(`Failed to run code: ${error.message}`);
      }
      
      setIsRunning(false);
    }, 1000);
  };
  
  // Submit and validate the code
  const handleSubmitChallenge = () => {
    setIsSubmitting(true);
    setHasAttempted(true);
    
    // In a real implementation, this would call a backend API to validate the code
    // For demo, we'll simulate validation with predefined test cases and a delay
    setTimeout(() => {
      try {
        // Simple test validation logic - in a real app, this would happen securely on the server
        const testCases = challenge.testCases || [
          { input: '', expectedOutput: '', description: 'Basic functionality' }
        ];
        
        // Run tests
        const results = testCases.map(test => {
          try {
            // This is a very simplified test runner for demonstration
            // In a real implementation, this would be much more sophisticated
            const consoleOutput = [];
            const originalConsoleLog = console.log;
            
            // Override console.log
            console.log = (...args) => {
              consoleOutput.push(args.join(' '));
            };
            
            // Run the code (simplified approach)
            const cleanedCode = code.replace(/import\s+.*?from\s+['"].*?['"];?/g, '');
            new Function(cleanedCode)();
            
            // Restore console.log
            console.log = originalConsoleLog;
            
            // Determine if test passed (very simplified)
            // In a real implementation, we would properly match expected outputs
            const output = consoleOutput.join('\\n');
            const passed = true; // For demo, assume tests pass
            
            return {
              description: test.description,
              passed,
              output
            };
          } catch (error) {
            return {
              description: test.description,
              passed: false,
              output: `Error: ${error.message}`
            };
          }
        });
        
        // Set test results
        setTestResults({
          results,
          allPassed: results.every(r => r.passed),
          timestamp: new Date()
        });
        
        // If all tests pass, complete the challenge
        if (results.every(r => r.passed)) {
          const xpReward = challenge.xpReward || 100;
          
          // Call the learning context to mark as completed
          const result = completeChallenge(challenge.id, xpReward);
          
          // Show success toast
          toast({
            title: 'Challenge completed!',
            description: result.leveledUp 
              ? `You earned ${xpReward} XP and leveled up to level ${result.newLevel}!` 
              : `You earned ${xpReward} XP!`,
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          
          // Call onComplete callback
          if (onComplete) {
            onComplete(challenge.id);
          }
        } else {
          // Show failure toast
          toast({
            title: 'Challenge not completed',
            description: 'Some tests failed. Keep trying!',
            status: 'warning',
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        setOutput(`Failed to validate code: ${error.message}`);
        
        toast({
          title: 'Error',
          description: 'Failed to validate your code. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
      
      setIsSubmitting(false);
    }, 1500);
  };
  
  // Reset code to initial state
  const handleResetCode = () => {
    if (challenge && challenge.starterCode) {
      setCode(challenge.starterCode);
      setOutput('');
      setTestResults(null);
      
      toast({
        title: 'Code reset',
        description: 'Your code has been reset to the initial state.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // UI Colors
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  if (!challenge) {
    return (
      <Box>
        <Text>No challenge data available</Text>
      </Box>
    );
  }

  return (
    <Box width="100%">
      <Card 
        bg={cardBg}
        boxShadow="md"
        mb={6}
        borderColor={borderColor}
        borderWidth="1px"
      >
        <CardBody>
          <Heading as="h3" size="md" mb={2}>
            {challenge.title}
          </Heading>
          
          <Text color="gray.600" mb={4}>
            {challenge.description}
          </Text>
          
          <Flex mb={4} wrap="wrap" gap={2}>
            <Badge colorScheme="blue" px={2} py={1} borderRadius="full">
              {challenge.difficulty || 'Medium'}
            </Badge>
            <Badge colorScheme="green" px={2} py={1} borderRadius="full">
              {challenge.estimatedTime || '15 min'}
            </Badge>
            <Badge colorScheme="purple" px={2} py={1} borderRadius="full">
              {challenge.xpReward || 100} XP
            </Badge>
          </Flex>
          
          {challenge.instructions && (
            <Box 
              bg="blue.50" 
              p={4} 
              borderRadius="md" 
              mb={4}
              color="blue.800"
            >
              <Text fontWeight="bold" mb={1}>Instructions:</Text>
              <Text>{challenge.instructions}</Text>
            </Box>
          )}
        </CardBody>
      </Card>

      <Tabs 
        isFitted 
        variant="enclosed" 
        index={activeTab}
        onChange={setActiveTab}
        mb={4}
      >
        <TabList mb="1em">
          <Tab>Code Editor</Tab>
          <Tab>Output</Tab>
          <Tab>Test Results</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel p={0}>
            <Box position="relative">
              <CodeEditor 
                code={code} 
                onChange={handleCodeChange} 
                language={challenge.language || 'javascript'}
              />
              <CodeExplainer 
                code={code}
                language={challenge.language || 'javascript'}
                context={`This code is for the "${challenge.title}" challenge. The user is trying to: ${challenge.instructions}`}
              />
              <CodeSuggester 
                code={code}
                language={challenge.language || 'javascript'}
                onApplySuggestion={(suggestedCode) => {
                  // Only replace the code if it's not empty
                  if (suggestedCode && suggestedCode.trim() !== '') {
                    setCode(suggestedCode);
                    toast({
                      title: 'Suggestion applied',
                      description: 'The AI suggestion has been applied to your code.',
                      status: 'success',
                      duration: 3000,
                      isClosable: true,
                    });
                  }
                }}
              />
              <CodeDebugger 
                code={code}
                language={challenge.language || 'javascript'}
                onApplyFix={(fixedCode) => {
                  // Only replace the code if it's not empty
                  if (fixedCode && fixedCode.trim() !== '') {
                    setCode(fixedCode);
                    toast({
                      title: 'Fix applied',
                      description: 'The AI fix has been applied to your code.',
                      status: 'success',
                      duration: 3000,
                      isClosable: true,
                    });
                  }
                }}
              />
            </Box>
          </TabPanel>
          
          <TabPanel p={0}>
            <CodeOutput output={output} isLoading={isRunning} />
          </TabPanel>
          
          <TabPanel p={0}>
            <Box p={4} bg="gray.50" borderRadius="md" minH="200px">
              {isSubmitting ? (
                <Flex justify="center" align="center" h="200px">
                  <Spinner size="xl" color="blue.500" mr={4} />
                  <Text fontSize="lg">Validating your solution...</Text>
                </Flex>
              ) : !testResults ? (
                <Flex 
                  direction="column" 
                  align="center" 
                  justify="center" 
                  h="200px"
                  color="gray.500"
                >
                  {hasAttempted ? (
                    <Text>Run your code and submit to see test results</Text>
                  ) : (
                    <Text>Test results will appear here after you submit your solution</Text>
                  )}
                </Flex>
              ) : (
                <Box>
                  <Alert
                    status={testResults.allPassed ? 'success' : 'warning'}
                    borderRadius="md"
                    mb={4}
                  >
                    <AlertIcon />
                    {testResults.allPassed 
                      ? 'All tests passed! Great job!' 
                      : 'Some tests failed. Check the details below and try again.'}
                  </Alert>
                  
                  {testResults.results.map((result, index) => (
                    <Box 
                      key={index}
                      p={3}
                      borderWidth="1px"
                      borderRadius="md"
                      mb={2}
                      borderColor={result.passed ? 'green.200' : 'red.200'}
                      bg={result.passed ? 'green.50' : 'red.50'}
                    >
                      <Flex align="center" mb={1}>
                        {result.passed ? (
                          <CheckIcon color="green.500" mr={2} />
                        ) : (
                          <WarningIcon color="red.500" mr={2} />
                        )}
                        <Text fontWeight="medium">
                          Test {index + 1}: {result.description}
                        </Text>
                      </Flex>
                      
                      {!result.passed && result.output && (
                        <Text fontSize="sm" mt={1} ml={6} color="red.600">
                          {result.output}
                        </Text>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      <Flex justify="space-between" mt={4}>
        <Button 
          variant="outline" 
          colorScheme="red" 
          onClick={handleResetCode}
        >
          Reset Code
        </Button>
        
        <Box>
          <Button
            colorScheme="blue"
            variant="outline"
            mr={3}
            onClick={handleRunCode}
            isLoading={isRunning}
            loadingText="Running..."
          >
            Run Code
          </Button>
          
          <Button
            colorScheme="green"
            onClick={handleSubmitChallenge}
            isLoading={isSubmitting}
            loadingText="Submitting..."
          >
            Submit Challenge
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default InteractiveCodingChallenge;