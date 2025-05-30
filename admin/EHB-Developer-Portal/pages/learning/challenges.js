import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Badge,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Divider,
  Card,
  CardBody,
  Progress,
  Spinner,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { SearchIcon, CheckIcon, StarIcon, TimeIcon } from '@chakra-ui/icons';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { useLearning } from '../../context/LearningContext';
import LearningProgress from '../../components/learning/LearningProgress';

// Sample challenge data
const challengeData = [
  {
    id: 'api-authentication',
    title: 'API Authentication',
    description: 'Learn how to implement secure authentication for your API endpoints in the EHB system.',
    type: 'coding',
    category: 'backend',
    difficulty: 'medium',
    estimatedTime: '25 min',
    xpReward: 100,
    tags: ['API', 'security', 'authentication', 'JWT'],
    pathId: 'api-integration',
    pathTitle: 'API Integration'
  },
  {
    id: 'blockchain-transaction',
    title: 'Blockchain Transaction',
    description: 'Create and validate blockchain transactions in the EHB system.',
    type: 'coding',
    category: 'blockchain',
    difficulty: 'hard',
    estimatedTime: '40 min',
    xpReward: 150,
    tags: ['blockchain', 'transaction', 'wallet', 'crypto'],
    pathId: 'blockchain-basics',
    pathTitle: 'Blockchain Integration'
  },
  {
    id: 'responsive-dashboard',
    title: 'Responsive Dashboard',
    description: 'Build a responsive dashboard component using EHB UI components.',
    type: 'coding',
    category: 'frontend',
    difficulty: 'easy',
    estimatedTime: '20 min',
    xpReward: 75,
    tags: ['UI', 'frontend', 'responsive', 'design'],
    pathId: 'frontend-development',
    pathTitle: 'Frontend Development'
  },
  {
    id: 'openai-integration',
    title: 'OpenAI Integration',
    description: 'Learn how to integrate OpenAI with EHB services for AI-powered features.',
    type: 'coding',
    category: 'ai',
    difficulty: 'medium',
    estimatedTime: '30 min',
    xpReward: 125,
    tags: ['AI', 'OpenAI', 'GPT', 'integration'],
    pathId: 'ai-integration',
    pathTitle: 'AI Services'
  },
  {
    id: 'data-storage',
    title: 'Secure Data Storage',
    description: 'Implement secure data storage methods in the EHB system.',
    type: 'coding',
    category: 'backend',
    difficulty: 'medium',
    estimatedTime: '35 min',
    xpReward: 120,
    tags: ['database', 'security', 'encryption', 'storage'],
    pathId: 'security-best-practices',
    pathTitle: 'Security Best Practices'
  },
  {
    id: 'real-time-updates',
    title: 'Real-Time Updates',
    description: 'Implement WebSocket-based real-time updates in an EHB application.',
    type: 'coding',
    category: 'backend',
    difficulty: 'hard',
    estimatedTime: '45 min',
    xpReward: 150,
    tags: ['websocket', 'real-time', 'events', 'notifications'],
    pathId: 'api-integration',
    pathTitle: 'API Integration'
  },
  {
    id: 'chatbot-implementation',
    title: 'AI Chatbot Implementation',
    description: 'Build a chatbot interface using the EHB AI services.',
    type: 'coding', 
    category: 'ai',
    difficulty: 'medium',
    estimatedTime: '40 min',
    xpReward: 130,
    tags: ['AI', 'chatbot', 'NLP', 'UI'],
    pathId: 'ai-integration',
    pathTitle: 'AI Services'
  },
  {
    id: 'smart-contract',
    title: 'Smart Contract Creation',
    description: 'Create a smart contract for the EHB blockchain system.',
    type: 'coding',
    category: 'blockchain',
    difficulty: 'hard',
    estimatedTime: '50 min',
    xpReward: 200,
    tags: ['blockchain', 'smart contract', 'solidity', 'ethereum'],
    pathId: 'blockchain-basics',
    pathTitle: 'Blockchain Integration'
  }
];

/**
 * Challenge Card Component
 */
const ChallengeCard = ({ challenge, isCompleted }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  
  // Define difficulty colors
  const difficultyColors = {
    easy: 'green',
    medium: 'orange',
    hard: 'red'
  };
  
  // Define category colors
  const categoryColors = {
    frontend: 'blue',
    backend: 'purple',
    blockchain: 'yellow',
    ai: 'teal'
  };
  
  return (
    <Card 
      bg={cardBg} 
      borderWidth="1px" 
      borderRadius="lg" 
      borderColor={borderColor}
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-4px)', shadow: 'md' }}
    >
      {/* Color strip based on category */}
      <Box 
        h="8px" 
        bg={`${categoryColors[challenge.category] || 'gray'}.400`} 
      />
      
      <CardBody>
        <Flex 
          justify="space-between" 
          align="flex-start"
          mb={2}
        >
          <Heading
            as="h3"
            size="md"
            mb={2}
            color={isCompleted ? 'green.500' : 'gray.800'}
            display="flex"
            alignItems="center"
          >
            {isCompleted && <CheckIcon mr={2} color="green.500" />}
            {challenge.title}
          </Heading>
          
          <Badge
            colorScheme={difficultyColors[challenge.difficulty] || 'gray'}
            textTransform="capitalize"
            px={2}
            py={1}
            borderRadius="full"
            fontWeight="medium"
          >
            {challenge.difficulty}
          </Badge>
        </Flex>
        
        <Text color={textColor} mb={3} minHeight="60px">
          {challenge.description}
        </Text>
        
        <Divider mb={3} />
        
        <Flex direction="column" gap={2}>
          <Flex align="center" color="gray.500" fontSize="sm">
            <TimeIcon mr={2} />
            <Text>{challenge.estimatedTime}</Text>
          </Flex>
          
          <Flex align="center" color="gray.500" fontSize="sm">
            <StarIcon mr={2} />
            <Text>{challenge.xpReward} XP</Text>
          </Flex>
          
          <Text 
            fontSize="sm" 
            color="blue.500" 
            fontWeight="medium"
            mb={2}
          >
            Path: {challenge.pathTitle}
          </Text>
        </Flex>
        
        <Flex 
          wrap="wrap" 
          gap={2} 
          mb={4}
        >
          {challenge.tags.map(tag => (
            <Badge
              key={tag}
              variant="subtle"
              colorScheme="gray"
              px={2}
              py={1}
              borderRadius="full"
              fontSize="xs"
            >
              {tag}
            </Badge>
          ))}
        </Flex>
        
        <Button
          as={NextLink}
          href={`/learning/challenge/${challenge.id}`}
          colorScheme={isCompleted ? 'green' : 'blue'}
          width="full"
          mt={2}
        >
          {isCompleted ? 'Review Challenge' : 'Start Challenge'}
        </Button>
      </CardBody>
    </Card>
  );
};

/**
 * Challenges Page - Lists all available coding challenges
 * with filtering, search, and gamification elements
 */
function ChallengesPage() {
  const siteConfig = useSiteConfig();
  const { completedChallenges } = useLearning();
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter challenges based on search and filters
  const filteredChallenges = challengeData.filter(challenge => {
    // Search term filter
    const matchesSearch = !searchTerm || (
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    // Category filter
    const matchesCategory = !categoryFilter || challenge.category === categoryFilter;
    
    // Difficulty filter
    const matchesDifficulty = !difficultyFilter || challenge.difficulty === difficultyFilter;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });
  
  // Calculate completion percentage
  const completionPercentage = Math.round(
    (completedChallenges?.length || 0) / challengeData.length * 100
  );
  
  return (
    <DashboardLayout activeItem="learning">
      <Head>
        <title>{`${siteConfig.title} | Coding Challenges`}</title>
      </Head>
      
      <Box maxW="1200px" mx="auto" px={{ base: 4, md: 8 }}>
        {/* Header */}
        <Flex 
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'flex-start', md: 'center' }}
          mb={6}
        >
          <Box mb={{ base: 4, md: 0 }}>
            <Heading as="h1" size="xl" mb={2}>
              Coding Challenges
            </Heading>
            <Text color="gray.600">
              Test your skills with interactive EHB development challenges
            </Text>
          </Box>
          
          <Flex 
            align="center" 
            gap={2}
            bg="green.50"
            color="green.600"
            px={4}
            py={2}
            borderRadius="md"
          >
            <Box>
              <Text fontWeight="bold">
                {completedChallenges?.length || 0} of {challengeData.length} Completed
              </Text>
              <Progress 
                value={completionPercentage} 
                size="sm" 
                colorScheme="green" 
                borderRadius="full"
                mt={1}
                width="150px"
              />
            </Box>
          </Flex>
        </Flex>
        
        {/* Learning Progress Section */}
        <LearningProgress />
        
        {/* Filters and Search */}
        <Flex 
          mb={6} 
          gap={4}
          direction={{ base: 'column', md: 'row' }}
        >
          <InputGroup maxW={{ base: 'full', md: '300px' }}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search challenges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          
          <Select
            placeholder="All Categories"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            maxW={{ base: 'full', md: '200px' }}
          >
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="blockchain">Blockchain</option>
            <option value="ai">AI</option>
          </Select>
          
          <Select
            placeholder="All Difficulties"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            maxW={{ base: 'full', md: '200px' }}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>
        </Flex>
        
        {/* Challenges Grid */}
        {isLoading ? (
          <Flex justify="center" align="center" h="200px">
            <Spinner size="xl" color="blue.500" />
          </Flex>
        ) : filteredChallenges.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredChallenges.map(challenge => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge} 
                isCompleted={completedChallenges?.includes(challenge.id)}
              />
            ))}
          </SimpleGrid>
        ) : (
          <Box
            borderWidth="1px"
            borderRadius="lg"
            p={8}
            textAlign="center"
            bg="white"
          >
            <Text fontSize="lg" mb={3}>
              No challenges match your filters
            </Text>
            <Text color="gray.500" mb={4}>
              Try adjusting your search criteria
            </Text>
            <Button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
                setDifficultyFilter('');
              }}
              colorScheme="blue"
            >
              Clear Filters
            </Button>
          </Box>
        )}
      </Box>
    </DashboardLayout>
  );
}

export default ChallengesPage;