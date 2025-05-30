import React, { useMemo } from 'react';
import {
  Box,
  Flex,
  Text,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  CircularProgress,
  CircularProgressLabel,
  Badge,
  Tooltip,
  useColorModeValue
} from '@chakra-ui/react';
import { StarIcon, TimeIcon } from '@chakra-ui/icons';
import { useLearning } from '../../context/LearningContext';

/**
 * Learning Progress Component
 * 
 * Displays the user's learning progress, level, XP, and streaks
 * in a visually appealing way with progress bars and stats
 */
const LearningProgress = () => {
  const { 
    learningStats, 
    calculateXPForNextLevel,
    completedChallenges 
  } = useLearning();
  
  // Calculate XP needed for next level
  const xpInfo = useMemo(() => {
    return calculateXPForNextLevel();
  }, [calculateXPForNextLevel, learningStats?.totalXP]);
  
  // Calculate completion percentage for pathways
  const pathwayPercentage = useMemo(() => {
    if (!learningStats) return 0;
    return learningStats.completedPaths > 0 
      ? Math.min(100, Math.round((learningStats.completedPaths / 6) * 100)) 
      : 0;
  }, [learningStats]);
  
  // UI colors
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const statBg = useColorModeValue('blue.50', 'blue.900');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  
  // No learning stats available yet
  if (!learningStats) {
    return (
      <Box
        bg={cardBg}
        borderWidth="1px"
        borderRadius="lg"
        borderColor={borderColor}
        p={5}
      >
        <Text>
          Start completing challenges to see your learning progress!
        </Text>
      </Box>
    );
  }

  return (
    <Box
      bg={cardBg}
      borderWidth="1px"
      borderRadius="lg"
      borderColor={borderColor}
      p={5}
      mb={6}
    >
      <Flex 
        justify="space-between" 
        align="center" 
        mb={6}
        direction={{ base: 'column', md: 'row' }}
        gap={{ base: 4, md: 0 }}
      >
        <Box>
          <Flex align="center" mb={1}>
            <StarIcon color="yellow.400" mr={2} />
            <Text fontSize="xl" fontWeight="bold">
              Level {learningStats.level}
            </Text>
          </Flex>
          <Text color={textColor} fontSize="sm">
            {xpInfo.needed} XP needed for next level
          </Text>
        </Box>
        
        <Flex 
          align="center"
          bg="blue.50" 
          p={2} 
          borderRadius="md"
          color="blue.500"
        >
          <TimeIcon mr={2} />
          <Text fontWeight="medium">
            {learningStats.streakDays} Day{learningStats.streakDays !== 1 ? 's' : ''} Streak
          </Text>
        </Flex>
      </Flex>
      
      {/* Level Progress Bar */}
      <Box mb={6}>
        <Flex justify="space-between" mb={1}>
          <Text fontSize="sm" color={textColor}>
            Level {learningStats.level}
          </Text>
          <Text fontSize="sm" color={textColor}>
            Level {learningStats.level + 1}
          </Text>
        </Flex>
        <Progress 
          value={xpInfo.progressPercentage} 
          size="md" 
          colorScheme="blue" 
          borderRadius="full"
        />
        <Flex justify="space-between" mt={1}>
          <Text fontSize="xs" color={textColor}>
            {Math.round(xpInfo.progressPercentage)}% Complete
          </Text>
          <Text fontSize="xs" color={textColor}>
            {learningStats.totalXP} / {xpInfo.nextLevelTotal} XP
          </Text>
        </Flex>
      </Box>
      
      {/* Statistics Grid */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4} mb={6}>
        <Stat bg={statBg} p={3} borderRadius="md">
          <StatLabel>Total XP</StatLabel>
          <StatNumber>{learningStats.totalXP}</StatNumber>
          <StatHelpText>Earned from challenges</StatHelpText>
        </Stat>
        
        <Stat bg={statBg} p={3} borderRadius="md">
          <StatLabel>Challenges</StatLabel>
          <StatNumber>{learningStats.completedChallenges}</StatNumber>
          <StatHelpText>Completed</StatHelpText>
        </Stat>
        
        <Stat bg={statBg} p={3} borderRadius="md">
          <StatLabel>Learning Paths</StatLabel>
          <StatNumber>{learningStats.completedPaths}</StatNumber>
          <StatHelpText>Completed</StatHelpText>
        </Stat>
        
        <Stat bg={statBg} p={3} borderRadius="md">
          <StatLabel>Achievements</StatLabel>
          <StatNumber>{learningStats.achievements?.length || 0}</StatNumber>
          <StatHelpText>Unlocked</StatHelpText>
        </Stat>
      </SimpleGrid>
      
      {/* Progress Circles */}
      <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={6}>
        {/* Challenge Progress */}
        <Box textAlign="center">
          <CircularProgress 
            value={Math.min(100, ((completedChallenges?.length || 0) / 20) * 100)} 
            color="green.400" 
            size="120px"
            thickness="8px"
          >
            <CircularProgressLabel>
              <Text fontSize="lg" fontWeight="bold">
                {completedChallenges?.length || 0}
              </Text>
              <Text fontSize="xs">/ 20</Text>
            </CircularProgressLabel>
          </CircularProgress>
          <Text mt={2} fontWeight="medium">
            Challenges
          </Text>
        </Box>
        
        {/* Pathway Progress */}
        <Box textAlign="center">
          <CircularProgress 
            value={pathwayPercentage} 
            color="purple.400" 
            size="120px" 
            thickness="8px"
          >
            <CircularProgressLabel>
              <Text fontSize="lg" fontWeight="bold">
                {learningStats.completedPaths}
              </Text>
              <Text fontSize="xs">/ 6</Text>
            </CircularProgressLabel>
          </CircularProgress>
          <Text mt={2} fontWeight="medium">
            Learning Paths
          </Text>
        </Box>
        
        {/* XP Progress to Major Milestone */}
        <Box textAlign="center">
          <Tooltip label="XP towards major milestone (1000 XP)">
            <CircularProgress 
              value={Math.min(100, (learningStats.totalXP / 1000) * 100)} 
              color="blue.400" 
              size="120px"
              thickness="8px"
            >
              <CircularProgressLabel>
                <Text fontSize="lg" fontWeight="bold">
                  {learningStats.totalXP}
                </Text>
                <Text fontSize="xs">/ 1000</Text>
              </CircularProgressLabel>
            </CircularProgress>
          </Tooltip>
          <Text mt={2} fontWeight="medium">
            Total XP
          </Text>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default LearningProgress;