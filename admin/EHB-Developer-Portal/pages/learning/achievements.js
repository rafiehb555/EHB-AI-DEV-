import React from 'react';
import Head from 'next/head';
import {
  Box,
  Heading,
  Text,
  Flex,
  SimpleGrid,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Card,
  CardBody,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  useColorModeValue
} from '@chakra-ui/react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { useLearning } from '../../context/LearningContext';
import Achievements from '../../components/learning/Achievements';
import LearningProgress from '../../components/learning/LearningProgress';

/**
 * Learning Achievements Page
 * 
 * Displays all achievements, badges, and learning progress in a gamified UI
 */
function AchievementsPage() {
  const siteConfig = useSiteConfig();
  const { learningStats, completedChallenges } = useLearning();
  
  // UI Colors
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <DashboardLayout activeItem="learning">
      <Head>
        <title>{`${siteConfig.title} | Learning Achievements`}</title>
      </Head>
      
      <Box maxW="1200px" mx="auto" px={{ base: 4, md: 8 }}>
        {/* Header */}
        <Flex 
          justify="space-between"
          align={{ base: 'flex-start', md: 'center' }}
          direction={{ base: 'column', md: 'row' }}
          mb={6}
        >
          <Box mb={{ base: 4, md: 0 }}>
            <Heading as="h1" size="xl" mb={2}>
              Learning Achievements
            </Heading>
            <Text color="gray.600">
              Track your EHB learning journey progress and earned rewards
            </Text>
          </Box>
          
          <Flex 
            align="center" 
            bg="blue.50" 
            p={3} 
            borderRadius="md"
            color="blue.600"
          >
            <Box textAlign="center">
              <Text fontWeight="bold" fontSize="xl">
                Level {learningStats?.level || 1}
              </Text>
              <Text fontSize="sm">
                {learningStats?.totalXP || 0} Total XP
              </Text>
            </Box>
          </Flex>
        </Flex>
        
        {/* Learning Progress */}
        <LearningProgress />
        
        {/* Current Achievements */}
        <Card
          bg={cardBg}
          borderWidth="1px"
          borderRadius="lg"
          borderColor={borderColor}
          mb={6}
          overflow="hidden"
        >
          <CardBody>
            <Achievements />
          </CardBody>
        </Card>
        
        {/* All Achievements */}
        <Card
          bg={cardBg}
          borderWidth="1px"
          borderRadius="lg"
          borderColor={borderColor}
          overflow="hidden"
        >
          <CardBody>
            <Heading as="h3" size="md" mb={4}>
              Available Achievements
            </Heading>
            
            <Text color="gray.600" mb={6}>
              Complete learning paths and challenges to unlock all available achievements and badges.
            </Text>
            
            <Tabs variant="enclosed" colorScheme="blue">
              <TabList mb={4}>
                <Tab>All Achievements</Tab>
                <Tab>Challenge Badges</Tab>
                <Tab>Path Badges</Tab>
                <Tab>Level Badges</Tab>
                <Tab>Special Badges</Tab>
              </TabList>
              
              <TabPanels>
                <TabPanel p={0}>
                  <Achievements showAllBadges={true} />
                </TabPanel>
                
                <TabPanel p={0}>
                  <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4}>
                    {['first-challenge', '5-challenges', '10-challenges', '25-challenges', '50-challenges'].map(badgeId => (
                      <Box key={badgeId}>
                        {/* We're reusing the Achievements component for simplicity */}
                        <Achievements
                          showAllBadges={true}
                          badgeFilter={id => id === badgeId}
                        />
                      </Box>
                    ))}
                  </SimpleGrid>
                </TabPanel>
                
                <TabPanel p={0}>
                  <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4}>
                    {['first-path', '3-paths', '5-paths'].map(badgeId => (
                      <Box key={badgeId}>
                        {/* We're reusing the Achievements component for simplicity */}
                        <Achievements
                          showAllBadges={true}
                          badgeFilter={id => id === badgeId}
                        />
                      </Box>
                    ))}
                  </SimpleGrid>
                </TabPanel>
                
                <TabPanel p={0}>
                  <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4}>
                    {['level-5', 'level-10', 'level-20', 'level-30'].map(badgeId => (
                      <Box key={badgeId}>
                        {/* We're reusing the Achievements component for simplicity */}
                        <Achievements
                          showAllBadges={true}
                          badgeFilter={id => id === badgeId}
                        />
                      </Box>
                    ))}
                  </SimpleGrid>
                </TabPanel>
                
                <TabPanel p={0}>
                  <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4}>
                    {['blockchain-expert', 'ai-specialist', 'security-expert'].map(badgeId => (
                      <Box key={badgeId}>
                        {/* We're reusing the Achievements component for simplicity */}
                        <Achievements
                          showAllBadges={true}
                          badgeFilter={id => id === badgeId}
                        />
                      </Box>
                    ))}
                  </SimpleGrid>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
        
        {/* Upcoming Feature Note */}
        <Box 
          bg="purple.50" 
          p={6} 
          borderRadius="lg" 
          mt={8}
          borderWidth="1px"
          borderColor="purple.200"
        >
          <Heading as="h3" size="md" color="purple.700" mb={2}>
            Coming Soon: Learning Leaderboards
          </Heading>
          <Text color="purple.600">
            Compare your progress with other learners and compete for top positions on our global leaderboards.
            Earn special badges and achievements for ranking in the top positions!
          </Text>
        </Box>
      </Box>
    </DashboardLayout>
  );
}

export default AchievementsPage;