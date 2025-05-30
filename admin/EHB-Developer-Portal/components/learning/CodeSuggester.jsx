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
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { EditIcon, CheckIcon } from '@chakra-ui/icons';
import { getCodeSuggestions } from '../../services/AIService';

/**
 * CodeSuggester Component
 * 
 * Provides AI-generated code suggestions and improvements
 * based on the current code and the user's goals.
 */
const CodeSuggester = ({
  code,
  language = 'javascript',
  onApplySuggestion = () => {},
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const buttonBg = useColorModeValue('green.50', 'green.900');
  const buttonColor = useColorModeValue('green.600', 'green.200');
  
  /**
   * Get code suggestions from the AI service
   */
  const getSuggestions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!code || code.trim() === '') {
        setError('No code provided for suggestions.');
        setIsLoading(false);
        return;
      }
      
      if (!prompt || prompt.trim() === '') {
        setError('Please describe what you want to achieve with your code.');
        setIsLoading(false);
        return;
      }
      
      // Get suggestions from the AI service
      const result = await getCodeSuggestions(code, prompt, language);
      setSuggestions(result);
    } catch (err) {
      console.error('Error getting code suggestions:', err);
      setError(err.message || 'Failed to generate code suggestions');
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Extract code blocks from the AI suggestions
   */
  const extractCodeBlocks = (text) => {
    if (!text) return [];
    
    // Extract code blocks enclosed in triple backticks
    const regex = /```(?:[\w-]+)?\n([\s\S]*?)```/g;
    const matches = [];
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[1].trim());
    }
    
    return matches;
  };
  
  /**
   * Apply a suggested code block to the editor
   */
  const applySuggestion = (codeBlock) => {
    onApplySuggestion(codeBlock);
    onClose();
  };
  
  return (
    <>
      <Box
        position="absolute"
        top="50px"
        right="10px"
        zIndex="10"
      >
        <Tooltip 
          label="Get AI code suggestions"
          placement="left"
        >
          <Button
            size="sm"
            leftIcon={<EditIcon />}
            onClick={onOpen}
            bg={buttonBg}
            color={buttonColor}
            _hover={{ bg: useColorModeValue('green.100', 'green.800') }}
            boxShadow="sm"
          >
            Get Suggestions
          </Button>
        </Tooltip>
      </Box>
      
      {/* Suggestions Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent bg={bgColor}>
          <ModalHeader borderBottomWidth="1px" borderColor={borderColor}>
            <Flex align="center">
              <EditIcon mr={2} color="green.500" />
              AI Code Suggestions
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
                Describe what you're trying to achieve:
              </Text>
              <InputGroup size="md">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Fix the authentication middleware, Add input validation, Optimize the database query"
                  rows={3}
                  resize="vertical"
                />
                <InputRightElement width="4.5rem" top="8px" right="8px">
                  <Button 
                    h="1.75rem" 
                    size="sm" 
                    onClick={getSuggestions}
                    isLoading={isLoading}
                    colorScheme="green"
                  >
                    Get Help
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Box>
            
            {isLoading ? (
              <Flex justify="center" align="center" py={8}>
                <Spinner size="lg" color="green.500" mr={4} />
                <Text>Generating suggestions...</Text>
              </Flex>
            ) : suggestions ? (
              <>
                <Text mb={4} fontWeight="medium" fontSize="lg">
                  Suggestions:
                </Text>
                
                <Box
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  p={4}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor={borderColor}
                  mb={4}
                  whiteSpace="pre-wrap"
                >
                  {suggestions}
                </Box>
                
                {extractCodeBlocks(suggestions).length > 0 && (
                  <Box mt={6}>
                    <Text fontWeight="medium" mb={2}>
                      Apply suggested code:
                    </Text>
                    
                    {extractCodeBlocks(suggestions).map((codeBlock, index) => (
                      <Box
                        key={index}
                        position="relative"
                        bg="gray.800"
                        color="gray.100"
                        p={3}
                        borderRadius="md"
                        fontSize="sm"
                        fontFamily="monospace"
                        whiteSpace="pre-wrap"
                        overflowX="auto"
                        mb={4}
                      >
                        {codeBlock}
                        
                        <Button
                          position="absolute"
                          top="10px"
                          right="10px"
                          size="xs"
                          colorScheme="green"
                          leftIcon={<CheckIcon />}
                          onClick={() => applySuggestion(codeBlock)}
                        >
                          Apply
                        </Button>
                      </Box>
                    ))}
                  </Box>
                )}
              </>
            ) : null}
          </ModalBody>
          
          <ModalFooter borderTopWidth="1px" borderColor={borderColor}>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CodeSuggester;