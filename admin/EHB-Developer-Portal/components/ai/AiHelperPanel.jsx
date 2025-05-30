import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  HStack,
  Avatar,
  Divider,
  Badge,
  IconButton,
  Spinner,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import {
  ArrowForwardIcon,
  ChatIcon,
  CloseIcon,
  InfoIcon,
  QuestionIcon,
  RepeatIcon,
  SearchIcon
} from '@chakra-ui/icons';
import { FaRobot } from 'react-icons/fa';

// Message component for both AI and user messages
const Message = ({ content, isAi, timestamp }) => {
  const aiMessageBg = useColorModeValue('blue.50', 'blue.900');
  const userMessageBg = useColorModeValue('gray.100', 'gray.700');
  
  return (
    <Box mb={4} maxW="100%">
      <HStack mb={1} spacing={2} justify={isAi ? "flex-start" : "flex-end"}>
        {isAi && (
          <Avatar size="xs" icon={<FaRobot fontSize="0.8rem" />} bg="blue.500" />
        )}
        <Text fontWeight="bold" fontSize="sm">{isAi ? 'AI Assistant' : 'You'}</Text>
        <Text fontSize="xs" color="gray.500">
          {timestamp}
        </Text>
        {!isAi && (
          <Avatar size="xs" bg="gray.400" />
        )}
      </HStack>
      <Box
        bg={isAi ? aiMessageBg : userMessageBg}
        p={3}
        borderRadius="lg"
        borderTopLeftRadius={isAi ? "0" : undefined}
        borderTopRightRadius={!isAi ? "0" : undefined}
        ml={isAi ? 0 : "auto"}
        mr={isAi ? "auto" : 0}
        maxW="85%"
      >
        <Text fontSize="sm" whiteSpace="pre-wrap">{content}</Text>
      </Box>
    </Box>
  );
};

// Quick Action Button
const QuickActionButton = ({ icon, label, onClick }) => (
  <Button
    leftIcon={icon}
    size="sm"
    variant="outline"
    justifyContent="flex-start"
    mb={2}
    w="full"
    onClick={onClick}
  >
    {label}
  </Button>
);

// Main AI Helper Component
const AiHelperPanel = ({ currentPage, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contextInfo, setContextInfo] = useState(null);
  
  const messagesEndRef = useRef(null);
  const toast = useToast();
  
  // Add initial greeting message
  useEffect(() => {
    const pageInfo = getPageContextInfo(currentPage);
    setContextInfo(pageInfo);
    
    const initialMessage = {
      content: `I'm your EHB AI assistant. I can help you understand and navigate the ${pageInfo?.title || 'dashboard'}. ${pageInfo?.description || ''}\n\nWhat would you like to know?`,
      isAi: true,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages([initialMessage]);
  }, [currentPage]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Get context information based on current page
  const getPageContextInfo = (page) => {
    // This would be expanded in a real implementation to cover all pages
    const pageContextMap = {
      dashboard: {
        title: 'Integrated Dashboard',
        description: 'This dashboard provides a comprehensive overview of all EHB phases and systems.',
        quickActions: [
          { label: 'View System Status', icon: <InfoIcon /> },
          { label: 'Understand Metrics', icon: <QuestionIcon /> },
          { label: 'Explore Phases', icon: <SearchIcon /> }
        ]
      },
      phases: {
        title: 'EHB Phases View',
        description: 'This page displays all implemented and planned EHB phases.',
        quickActions: [
          { label: 'Explain Phase Structure', icon: <InfoIcon /> },
          { label: 'Phase Dependencies', icon: <QuestionIcon /> },
          { label: 'Implementation Status', icon: <SearchIcon /> }
        ]
      },
      settings: {
        title: 'Settings Page',
        description: 'Configure system settings and user preferences.',
        quickActions: [
          { label: 'Security Settings', icon: <InfoIcon /> },
          { label: 'Integration Options', icon: <QuestionIcon /> },
          { label: 'User Management', icon: <SearchIcon /> }
        ]
      }
    };
    
    return pageContextMap[page] || {
      title: 'EHB System',
      description: 'I can help you with any aspect of the EHB system.',
      quickActions: [
        { label: 'System Overview', icon: <InfoIcon /> },
        { label: 'Common Tasks', icon: <QuestionIcon /> },
        { label: 'Find Features', icon: <SearchIcon /> }
      ]
    };
  };
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = {
      content: inputValue,
      isAi: false,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAiResponse(inputValue, currentPage, contextInfo);
      
      const aiMessage = {
        content: aiResponse,
        isAi: true,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };
  
  // Generate AI response based on input and context
  const generateAiResponse = (input, page, contextInfo) => {
    const lowercaseInput = input.toLowerCase();
    
    // Generic responses based on input
    if (lowercaseInput.includes('help') || lowercaseInput.includes('what can you do')) {
      return `I can help you with:\n\n• Understanding dashboard metrics and charts\n• Explaining EHB phases and their status\n• Navigating the system\n• Finding specific features\n• Troubleshooting common issues\n\nJust ask me any question about the ${contextInfo?.title || 'EHB system'}.`;
    }
    
    if (lowercaseInput.includes('dashboard') || lowercaseInput.includes('metrics')) {
      return `The Integrated Dashboard shows key metrics and statuses from all EHB phases. \n\nYou can see:\n• System stats (users, services, etc.)\n• Phase implementation progress\n• Module status\n• AI insights\n• Recent activities\n\nThe dashboard automatically updates with real-time data from all connected services.`;
    }
    
    if (lowercaseInput.includes('phase') || lowercaseInput.includes('phases')) {
      return `The EHB system consists of multiple phases (currently Phases 1-10 implemented):\n\n• Phases 1-6: Core system and services\n• Phase 7: AutoCardGen - AI-powered card generation\n• Phase 8: TestPassFail - Test tracking system\n• Phase 9: AI-Dashboard - Metrics visualization\n• Phase 10: SmartAIAgent - Conversational AI system\n\nEach phase follows a standardized structure with frontend, backend, models, and configuration components.`;
    }
    
    if (lowercaseInput.includes('ai') || lowercaseInput.includes('artificial intelligence')) {
      return `AI is integrated throughout the EHB system. Key AI features include:\n\n• SmartAIAgent for conversational assistance\n• AI-Dashboard for intelligent metric analysis\n• AutoCardGen for AI-assisted design\n• Automated insights generation\n\nThe system leverages OpenAI and Anthropic models for different AI capabilities.`;
    }
    
    // Page-specific responses
    if (page === 'dashboard') {
      if (lowercaseInput.includes('chart') || lowercaseInput.includes('graph')) {
        return `The dashboard charts visualize key system metrics. Hover over chart elements to see detailed values. You can change the time range in the top-right corner to view different periods.`;
      }
      
      if (lowercaseInput.includes('refresh') || lowercaseInput.includes('update')) {
        return `To refresh the dashboard data, click the refresh icon in the top-right corner. The dashboard also automatically updates every few minutes.`;
      }
    }
    
    // Default response
    return `I understand you're asking about "${input}" in the context of the ${contextInfo?.title || 'EHB system'}. \n\nThis area provides information about the EHB system's status, metrics, and features. You can navigate to different sections using the sidebar menu.\n\nCan you tell me more specifically what you'd like to know about this?`;
  };
  
  // Handle quick action click
  const handleQuickAction = (action) => {
    // Add user message
    const userMessage = {
      content: action.label,
      isAi: false,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      let response = '';
      
      // Generate response based on action
      switch (action.label) {
        case 'View System Status':
          response = `The system status shows the health and performance of all EHB components. Green indicators mean the component is functioning properly, while yellow or red indicate warnings or errors.`;
          break;
        case 'Understand Metrics':
          response = `The dashboard displays several key metrics:\n\n• Active Users: Number of users currently using the system\n• Services: Count of active system services\n• AI Requests: Number of AI API calls made\n• Database Size: Current size of the system database\n\nThese metrics help you monitor system usage and performance.`;
          break;
        case 'Explore Phases':
          response = `The Phases tab shows all EHB phases and their implementation status. Currently, Phases 1-10 are fully implemented. Each phase represents a key system capability:\n\n• Phase 7: AutoCardGen (card generation)\n• Phase 8: TestPassFail (test tracking)\n• Phase 9: AI-Dashboard (metrics visualization)\n• Phase 10: SmartAIAgent (conversational AI)`;
          break;
        default:
          response = `I can help you learn more about ${action.label}. What specific aspect would you like to understand better?`;
      }
      
      const aiMessage = {
        content: response,
        isAi: true,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Flex direction="column" h="100%" p={0}>
      {/* Header */}
      <Flex 
        p={4} 
        borderBottomWidth="1px"
        align="center"
        justify="space-between"
      >
        <HStack>
          <Avatar size="sm" icon={<FaRobot fontSize="1.2rem" />} bg="blue.500" />
          <Box>
            <Heading size="sm">AI Helper</Heading>
            <Text fontSize="xs" color="gray.500">
              Context: {contextInfo?.title || 'EHB System'}
            </Text>
          </Box>
        </HStack>
        <IconButton
          icon={<CloseIcon />}
          aria-label="Close AI Helper"
          size="sm"
          variant="ghost"
          onClick={onClose}
        />
      </Flex>
      
      {/* Messages Area */}
      <Box 
        flex="1" 
        overflowY="auto" 
        p={4}
        css={{
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            width: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '24px',
          },
        }}
      >
        {messages.map((message, index) => (
          <Message
            key={index}
            content={message.content}
            isAi={message.isAi}
            timestamp={message.timestamp}
          />
        ))}
        
        {isLoading && (
          <Flex align="center" mb={4}>
            <Avatar size="xs" icon={<FaRobot fontSize="0.8rem" />} bg="blue.500" mr={2} />
            <Spinner size="sm" color="blue.500" mr={2} />
            <Text fontSize="sm">Thinking...</Text>
          </Flex>
        )}
        
        <div ref={messagesEndRef} />
      </Box>
      
      {/* Quick Actions */}
      {contextInfo?.quickActions && messages.length <= 1 && (
        <Box p={4} borderTopWidth="1px">
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            Quick Actions
          </Text>
          <VStack align="stretch" spacing={2}>
            {contextInfo.quickActions.map((action, index) => (
              <QuickActionButton
                key={index}
                icon={action.icon}
                label={action.label}
                onClick={() => handleQuickAction(action)}
              />
            ))}
          </VStack>
        </Box>
      )}
      
      {/* Input Area */}
      <Box p={4} borderTopWidth="1px">
        <InputGroup size="md">
          <Input
            placeholder="Ask me anything about the system..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            pr="3.5rem"
            isDisabled={isLoading}
          />
          <InputRightElement width="3.5rem">
            <IconButton
              h="1.75rem"
              size="sm"
              colorScheme="blue"
              icon={<ArrowForwardIcon />}
              isDisabled={!inputValue.trim() || isLoading}
              onClick={handleSendMessage}
            />
          </InputRightElement>
        </InputGroup>
      </Box>
    </Flex>
  );
};

export default AiHelperPanel;