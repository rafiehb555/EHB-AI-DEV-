import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
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
  Flex,
} from '@chakra-ui/react';
import { InfoIcon, QuestionIcon } from '@chakra-ui/icons';
import { getCodeExplanation } from '../../services/AIService';

/**
 * CodeExplainer Component
 * 
 * Provides one-click code explanation functionality using AI.
 * Users can select code and get an explanation of what it does.
 */
const CodeExplainer = ({
  code,
  language = 'javascript',
  context = '',
  selectedText = '',
  onSelect = () => {},
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const buttonBg = useColorModeValue('blue.50', 'blue.900');
  const buttonColor = useColorModeValue('blue.600', 'blue.200');
  
  /**
   * Generate an explanation for the provided code
   */
  const explainCode = async (codeToExplain = code) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use the selected text if available, otherwise use the full code
      const textToExplain = selectedText || codeToExplain;
      
      if (!textToExplain || textToExplain.trim() === '') {
        setError('No code selected to explain.');
        setIsLoading(false);
        return;
      }
      
      // Get the explanation from the AI service
      const result = await getCodeExplanation(textToExplain, language, context);
      setExplanation(result);
      
      // Open the modal to display the explanation
      onOpen();
    } catch (err) {
      console.error('Error explaining code:', err);
      setError(err.message || 'Failed to generate code explanation');
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Format the explanation text with Markdown-like syntax highlighting
   */
  const formatExplanation = (text) => {
    if (!text) return '';
    
    // Split the text into sections based on numbered points (1., 2., etc.)
    const sections = text.split(/(\d+\.\s)/g);
    
    // Join the sections back together with proper formatting
    return sections.map((section, index) => {
      // If the section is a numbered point, make it bold
      if (/^\d+\.\s$/.test(section)) {
        return (
          <Text as="span" fontWeight="bold" key={index}>
            {section}
          </Text>
        );
      }
      
      // Otherwise, return the section as is
      return (
        <Text as="span" key={index}>
          {section}
        </Text>
      );
    });
  };
  
  return (
    <>
      <Box
        position="absolute"
        top="10px"
        right="10px"
        zIndex="10"
      >
        <Tooltip 
          label="Get AI explanation of your code"
          placement="left"
        >
          <Button
            size="sm"
            leftIcon={<QuestionIcon />}
            onClick={() => explainCode()}
            isLoading={isLoading}
            loadingText="Analyzing"
            bg={buttonBg}
            color={buttonColor}
            _hover={{ bg: useColorModeValue('blue.100', 'blue.800') }}
            boxShadow="sm"
          >
            Explain Code
          </Button>
        </Tooltip>
      </Box>
      
      {/* Explanation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent bg={bgColor}>
          <ModalHeader borderBottomWidth="1px" borderColor={borderColor}>
            <Flex align="center">
              <InfoIcon mr={2} color="blue.500" />
              Code Explanation
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
            
            {isLoading ? (
              <Flex justify="center" align="center" py={8}>
                <Spinner size="lg" color="blue.500" mr={4} />
                <Text>Analyzing your code...</Text>
              </Flex>
            ) : (
              <>
                <Text mb={4} fontWeight="medium" fontSize="lg">
                  Here's an explanation of your code:
                </Text>
                
                <Box
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  p={4}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor={borderColor}
                  mb={4}
                >
                  <Text whiteSpace="pre-wrap" fontSize="sm">
                    {formatExplanation(explanation)}
                  </Text>
                </Box>
                
                <Accordion allowToggle mt={5}>
                  <AccordionItem border="none">
                    <AccordionButton 
                      px={0} 
                      color="blue.500"
                      _hover={{ bg: 'transparent', textDecoration: 'underline' }}
                    >
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        View analyzed code
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4} px={0}>
                      <Box
                        bg="gray.800"
                        color="gray.100"
                        p={3}
                        borderRadius="md"
                        fontSize="sm"
                        fontFamily="monospace"
                        whiteSpace="pre-wrap"
                        overflowX="auto"
                      >
                        {selectedText || code}
                      </Box>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </>
            )}
          </ModalBody>
          
          <ModalFooter borderTopWidth="1px" borderColor={borderColor}>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CodeExplainer;