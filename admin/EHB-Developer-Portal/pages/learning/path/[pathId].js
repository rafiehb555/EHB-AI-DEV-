import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
  Button,
  Badge,
  Progress,
  Card,
  CardBody,
  SimpleGrid,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Image,
  Skeleton,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  CheckCircleIcon, 
  TimeIcon, 
  StarIcon, 
  ArrowBackIcon, 
  ArrowForwardIcon,
  CheckIcon,
  LockIcon
} from '@chakra-ui/icons';
import NextLink from 'next/link';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ChallengeCard from '../../../components/learning/ChallengeCard';

const LearningPathDetails = () => {
  const router = useRouter();
  const { pathId } = router.query;
  
  const [isLoading, setIsLoading] = useState(true);
  const [pathData, setPathData] = useState(null);
  const [challenges, setChallenges] = useState([]);
  
  useEffect(() => {
    // Only fetch when pathId is available
    if (!pathId) return;
    
    const fetchPathData = async () => {
      try {
        // In a real app, these would be API calls
        // For now, we'll simulate a loading delay
        setTimeout(() => {
          const paths = {
            'ehb-basics': {
              id: 'ehb-basics',
              title: 'EHB Basics',
              description: 'Learn the fundamentals of the EHB system architecture and components. This path will introduce you to the core concepts, tools, and technologies that power the EHB platform.',
              totalChallenges: 10,
              completedChallenges: 8,
              level: 'Beginner',
              estimatedTime: '2 hours',
              xpReward: 500,
              image: '/images/learning/ehb-basics.svg',
              prerequisites: [],
              learningObjectives: [
                'Understand the EHB architecture and components',
                'Learn how to set up a basic EHB development environment',
                'Create your first EHB module',
                'Implement basic authentication and authorization',
                'Connect to the EHB database'
              ]
            },
            'api-integration': {
              id: 'api-integration',
              title: 'API Integration',
              description: 'Master connecting with EHB APIs and building integrations. Learn how to create, consume, and manage API endpoints in the EHB ecosystem.',
              totalChallenges: 12,
              completedChallenges: 5,
              level: 'Intermediate',
              estimatedTime: '3 hours',
              xpReward: 750,
              image: '/images/learning/api-integration.svg',
              prerequisites: ['ehb-basics'],
              learningObjectives: [
                'Understand RESTful API principles in the context of EHB',
                'Create and document API endpoints',
                'Implement authentication for API requests',
                'Consume external APIs from your EHB application',
                'Handle errors and edge cases in API interactions'
              ]
            }
          };
          
          const challengesByPath = {
            'ehb-basics': [
              {
                id: 'ehb-intro',
                title: 'Introduction to EHB',
                description: 'Learn the fundamental concepts and architecture of the EHB system.',
                type: 'quiz',
                difficulty: 'easy',
                estimatedTime: '10 min',
                xpReward: 50,
                completed: true,
                locked: false
              },
              {
                id: 'setup-environment',
                title: 'Setting Up Your Environment',
                description: 'Configure your development environment for EHB development.',
                type: 'guided',
                difficulty: 'easy',
                estimatedTime: '15 min',
                xpReward: 50,
                completed: true,
                locked: false
              },
              {
                id: 'hello-ehb',
                title: 'Hello EHB',
                description: 'Create your first EHB module and understand the module structure.',
                type: 'coding',
                difficulty: 'easy',
                estimatedTime: '20 min',
                xpReward: 75,
                completed: true,
                locked: false
              },
              {
                id: 'authentication-basics',
                title: 'Authentication Basics',
                description: 'Implement basic authentication in your EHB application.',
                type: 'coding',
                difficulty: 'medium',
                estimatedTime: '25 min',
                xpReward: 100,
                completed: true,
                locked: false
              },
              {
                id: 'database-connection',
                title: 'Database Connection',
                description: 'Connect to the EHB database and perform basic operations.',
                type: 'coding',
                difficulty: 'medium',
                estimatedTime: '25 min',
                xpReward: 100,
                completed: true,
                locked: false
              },
              {
                id: 'ui-components',
                title: 'UI Components',
                description: 'Learn how to use EHB UI components to build user interfaces.',
                type: 'coding',
                difficulty: 'medium',
                estimatedTime: '30 min',
                xpReward: 125,
                completed: true,
                locked: false
              },
              {
                id: 'module-configuration',
                title: 'Module Configuration',
                description: 'Configure your EHB module using the configuration system.',
                type: 'coding',
                difficulty: 'medium',
                estimatedTime: '20 min',
                xpReward: 75,
                completed: true,
                locked: false
              },
              {
                id: 'error-handling',
                title: 'Error Handling',
                description: 'Implement proper error handling in your EHB applications.',
                type: 'coding',
                difficulty: 'medium',
                estimatedTime: '25 min',
                xpReward: 100,
                completed: true,
                locked: false
              },
              {
                id: 'module-communication',
                title: 'Module Communication',
                description: 'Learn how modules communicate with each other in the EHB system.',
                type: 'coding',
                difficulty: 'hard',
                estimatedTime: '30 min',
                xpReward: 150,
                completed: false,
                locked: false
              },
              {
                id: 'final-project',
                title: 'Final Project',
                description: 'Build a complete EHB module with all the concepts learned in this path.',
                type: 'project',
                difficulty: 'hard',
                estimatedTime: '45 min',
                xpReward: 200,
                completed: false,
                locked: false
              }
            ],
            'api-integration': [
              {
                id: 'api-intro',
                title: 'Introduction to EHB APIs',
                description: 'Learn the structure and principles of EHB APIs.',
                type: 'quiz',
                difficulty: 'easy',
                estimatedTime: '15 min',
                xpReward: 50,
                completed: true,
                locked: false
              },
              {
                id: 'api-authentication',
                title: 'API Authentication',
                description: 'Implement authentication for your API endpoints.',
                type: 'coding',
                difficulty: 'medium',
                estimatedTime: '25 min',
                xpReward: 100,
                completed: true,
                locked: false
              },
              {
                id: 'create-endpoints',
                title: 'Creating API Endpoints',
                description: 'Create your first API endpoints in EHB.',
                type: 'coding',
                difficulty: 'medium',
                estimatedTime: '30 min',
                xpReward: 125,
                completed: true,
                locked: false
              },
              {
                id: 'data-validation',
                title: 'Data Validation',
                description: 'Implement data validation for your API endpoints.',
                type: 'coding',
                difficulty: 'medium',
                estimatedTime: '25 min',
                xpReward: 100,
                completed: true,
                locked: false
              },
              {
                id: 'api-versioning',
                title: 'API Versioning',
                description: 'Learn how to version your APIs for backward compatibility.',
                type: 'guided',
                difficulty: 'medium',
                estimatedTime: '20 min',
                xpReward: 75,
                completed: true,
                locked: false
              },
              {
                id: 'consuming-apis',
                title: 'Consuming APIs',
                description: 'Learn how to consume EHB and external APIs.',
                type: 'coding',
                difficulty: 'medium',
                estimatedTime: '30 min',
                xpReward: 125,
                completed: false,
                locked: false
              },
              {
                id: 'error-handling-apis',
                title: 'API Error Handling',
                description: 'Implement robust error handling for your API endpoints.',
                type: 'coding',
                difficulty: 'hard',
                estimatedTime: '30 min',
                xpReward: 150,
                completed: false,
                locked: false
              },
              {
                id: 'rate-limiting',
                title: 'Rate Limiting',
                description: 'Implement rate limiting for your API endpoints.',
                type: 'coding',
                difficulty: 'hard',
                estimatedTime: '25 min',
                xpReward: 125,
                completed: false,
                locked: false
              },
              {
                id: 'api-documentation',
                title: 'API Documentation',
                description: 'Document your API endpoints using OpenAPI specification.',
                type: 'guided',
                difficulty: 'medium',
                estimatedTime: '20 min',
                xpReward: 75,
                completed: false,
                locked: false
              },
              {
                id: 'api-monitoring',
                title: 'API Monitoring',
                description: 'Set up monitoring for your API endpoints.',
                type: 'guided',
                difficulty: 'medium',
                estimatedTime: '25 min',
                xpReward: 100,
                completed: false,
                locked: false
              },
              {
                id: 'api-webhooks',
                title: 'Webhooks',
                description: 'Implement webhooks for your API endpoints.',
                type: 'coding',
                difficulty: 'hard',
                estimatedTime: '35 min',
                xpReward: 175,
                completed: false,
                locked: false
              },
              {
                id: 'api-final-project',
                title: 'Final Project',
                description: 'Build a complete API integration with all the concepts learned in this path.',
                type: 'project',
                difficulty: 'hard',
                estimatedTime: '45 min',
                xpReward: 200,
                completed: false,
                locked: false
              }
            ]
          };
          
          setPathData(paths[pathId] || null);
          setChallenges(challengesByPath[pathId] || []);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching path data:', error);
        setIsLoading(false);
      }
    };
    
    fetchPathData();
  }, [pathId]);
  
  if (!pathId) return null;
  
  // Calculate progress percentage
  const progressPercentage = pathData ? 
    Math.round((pathData.completedChallenges / pathData.totalChallenges) * 100) : 0;
  
  return (
    <DashboardLayout>
      <Container maxW="container.xl">
        <Box mb={8}>
          <Breadcrumb mb={4} fontSize="sm">
            <BreadcrumbItem>
              <NextLink href="/learning" passHref legacyBehavior>
                <BreadcrumbLink>Learning Paths</BreadcrumbLink>
              </NextLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>
                {isLoading ? <Skeleton width="100px" height="1em" /> : pathData?.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          
          <Flex 
            justify="space-between" 
            align={{ base: 'flex-start', md: 'center' }}
            direction={{ base: 'column', md: 'row' }}
            mb={6}
          >
            <Box mb={{ base: 4, md: 0 }}>
              <Heading mb={2}>
                {isLoading ? <Skeleton width="250px" height="1.2em" /> : pathData?.title}
              </Heading>
              <Text color="gray.600">
                {isLoading ? <Skeleton width="400px" height="1em" /> : pathData?.description}
              </Text>
            </Box>
            
            <NextLink href="/learning" passHref legacyBehavior>
              <Button 
                as="a" 
                leftIcon={<ArrowBackIcon />} 
                variant="outline"
                size="sm"
              >
                Back to Paths
              </Button>
            </NextLink>
          </Flex>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} height="100px" />
              ))
            ) : (
              <>
                <Card shadow="md">
                  <CardBody>
                    <Flex align="center" mb={2}>
                      <Box 
                        borderRadius="full" 
                        bg="blue.100" 
                        p={2} 
                        mr={3}
                      >
                        <StarIcon color="blue.500" />
                      </Box>
                      <Box>
                        <Text fontWeight="bold">{pathData?.xpReward} XP</Text>
                        <Text fontSize="sm" color="gray.500">Total Reward</Text>
                      </Box>
                    </Flex>
                  </CardBody>
                </Card>
                
                <Card shadow="md">
                  <CardBody>
                    <Flex align="center" mb={2}>
                      <Box 
                        borderRadius="full" 
                        bg="green.100" 
                        p={2} 
                        mr={3}
                      >
                        <TimeIcon color="green.500" />
                      </Box>
                      <Box>
                        <Text fontWeight="bold">{pathData?.estimatedTime}</Text>
                        <Text fontSize="sm" color="gray.500">Estimated Time</Text>
                      </Box>
                    </Flex>
                  </CardBody>
                </Card>
                
                <Card shadow="md">
                  <CardBody>
                    <Flex align="center" mb={2}>
                      <Box 
                        borderRadius="full" 
                        bg="purple.100" 
                        p={2} 
                        mr={3}
                      >
                        <CheckCircleIcon color="purple.500" />
                      </Box>
                      <Box>
                        <Text fontWeight="bold">{pathData?.completedChallenges} / {pathData?.totalChallenges}</Text>
                        <Text fontSize="sm" color="gray.500">Challenges Completed</Text>
                      </Box>
                    </Flex>
                    <Progress 
                      value={progressPercentage} 
                      size="sm" 
                      colorScheme="purple" 
                      borderRadius="full" 
                      mt={2} 
                    />
                  </CardBody>
                </Card>
              </>
            )}
          </SimpleGrid>
          
          {!isLoading && pathData && (
            <Card shadow="md" mb={8}>
              <CardBody>
                <Heading size="md" mb={4}>Learning Objectives</Heading>
                <List spacing={2}>
                  {pathData.learningObjectives.map((objective, index) => (
                    <ListItem key={index} display="flex" alignItems="flex-start">
                      <ListIcon as={CheckIcon} color="green.500" mt={1} />
                      <Text>{objective}</Text>
                    </ListItem>
                  ))}
                </List>
              </CardBody>
            </Card>
          )}
          
          <Box mb={8}>
            <Heading size="md" mb={4}>Challenges</Heading>
            
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} height="100px" mb={4} />
              ))
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {challenges.map((challenge, index) => (
                  <ChallengeCard 
                    key={challenge.id}
                    challenge={challenge}
                    href={`/learning/challenge/${challenge.id}`}
                  />
                ))}
              </SimpleGrid>
            )}
          </Box>
        </Box>
      </Container>
    </DashboardLayout>
  );
};

export default LearningPathDetails;