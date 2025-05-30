import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  Spinner,
  Alert,
  AlertIcon,
  Tooltip,
  useDisclosure,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { WarningIcon, RepeatIcon, CheckCircleIcon, NotAllowedIcon, InfoIcon } from '@chakra-ui/icons';
import { debugCode } from '../../services/AIService';

/**
 * CodeDebugger Component
 * 
 * Provides AI-powered debugging assistance for code.
 * Identifies issues and provides suggestions for fixing them.
 */
const CodeDebugger = ({
  code,
  language = 'javascript',
  onApplyFix = () => {},
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errorMessage, setErrorMessage] = useState('');
  const [debugResults, setDebugResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const buttonBg = useColorModeValue('red.50', 'red.900');
  const buttonColor = useColorModeValue('red.600', 'red.200');
  
  /**
   * Debug the code using the AI service
   */
  const debugUserCode = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!code || code.trim() === '') {
        setError('No code provided for debugging.');
        setIsLoading(false);
        return;
      }
      
      // Get debugging results from the AI service
      const results = await debugCode(code, errorMessage, language);
      setDebugResults(results);
    } catch (err) {
      console.error('Error debugging code:', err);
      setError(err.message || 'Failed to debug code');
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Apply a fix to the editor
   */
  const applyFix = (fixCode) => {
    // Extract code from the fix suggestion
    const codeRegex = /```(?:\w+)?\n([\s\S]*?)\n```/;
    const match = fixCode.match(codeRegex);
    
    if (match && match[1]) {
      onApplyFix(match[1].trim());
    } else {
      onApplyFix(fixCode);
    }
    
    onClose();
  };
  
  return (
    <>
      <Box
        position="absolute"
        top="90px"
        right="10px"
        zIndex="10"
      >
        <Tooltip 
          label="Debug your code with AI"
          placement="left"
        >
          <Button
            size="sm"
            leftIcon={<RepeatIcon />}
            onClick={onOpen}
            bg={buttonBg}
            color={buttonColor}
            _hover={{ bg: useColorModeValue('red.100', 'red.800') }}
            boxShadow="sm"
          >
            Debug Code
          </Button>
        </Tooltip>
      </Box>
      
      {/* Debugging Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent bg={bgColor}>
          <ModalHeader borderBottomWidth="1px" borderColor={borderColor}>
            <Flex align="center">
              <RepeatIcon mr={2} color="red.500" />
              AI Code Debugger
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody py={4}>
            {error && (
              <Alert status="error" mb={4} borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}
            
            <Box mb={4}>
              <Text mb={2} fontWeight="medium">
                Enter any error message you're seeing (optional):
              </Text>
              <Textarea
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
                placeholder="Paste any error messages here..."
                rows={3}
                resize="vertical"
                mb={3}
              />
              
              <Button 
                colorScheme="red" 
                onClick={debugUserCode}
                isLoading={isLoading}
                loadingText="Debugging"
              >
                Debug My Code
              </Button>
            </Box>
            
            {isLoading ? (
              <Flex justify="center" align="center" py={8}>
                <Spinner size="lg" color="red.500" mr={4} />
                <Text>Analyzing your code for issues...</Text>
              </Flex>
            ) : debugResults ? (
              <>
                <Alert 
                  status="info" 
                  mb={6}
                  borderRadius="md"
                >
                  <AlertIcon />
                  AI has analyzed your code and found the following issues:
                </Alert>
                
                <Box mb={6}>
                  <Text fontWeight="bold" mb={2}>Issues Found:</Text>
                  <List spacing={3}>
                    {debugResults.issues && debugResults.issues.map((issue, index) => (
                      <ListItem key={index} display="flex">
                        <ListIcon as={WarningIcon} color="red.500" mt={1} />
                        <Text>{issue}</Text>
                      </ListItem>
                    ))}
                  </List>
                </Box>
                
                {debugResults.fixes && (
                  <Box mb={6}>
                    <Text fontWeight="bold" mb={2}>Suggested Fixes:</Text>
                    <Accordion allowToggle>
                      {debugResults.fixes.map((fix, index) => (
                        <AccordionItem key={index} border="1px" borderColor={borderColor} mb={2} borderRadius="md" overflow="hidden">
                          <AccordionButton _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                            <Box flex="1" textAlign="left" fontWeight="medium">
                              Fix #{index + 1}
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel pb={4} borderTopWidth="1px" borderColor={borderColor}>
                            <Box 
                              whiteSpace="pre-wrap" 
                              mb={3}
                            >
                              {fix}
                            </Box>
                            
                            <Button 
                              size="sm" 
                              colorScheme="green" 
                              leftIcon={<CheckCircleIcon />}
                              onClick={() => applyFix(fix)}
                            >
                              Apply This Fix
                            </Button>
                          </AccordionPanel>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </Box>
                )}
                
                {debugResults.explanations && (
                  <Box>
                    <Text fontWeight="bold" mb={2}>Explanations:</Text>
                    <List spacing={3}>
                      {debugResults.explanations.map((explanation, index) => (
                        <ListItem key={index} display="flex">
                          <ListIcon as={InfoIcon} color="blue.500" mt={1} />
                          <Text>{explanation}</Text>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </>
            ) : null}
          </ModalBody>
          
          <ModalFooter borderTopWidth="1px" borderColor={borderColor}>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CodeDebugger;