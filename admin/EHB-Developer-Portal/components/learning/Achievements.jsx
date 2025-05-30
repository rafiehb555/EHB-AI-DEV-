import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Badge,
  Tooltip,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { StarIcon, CheckIcon, TimeIcon, InfoIcon } from '@chakra-ui/icons';
import { useLearning } from '../../context/LearningContext';

// Badge design configuration
const badgeConfig = {
  // Challenge completion badges
  'first-challenge': {
    icon: CheckIcon,
    color: 'green',
    title: 'First Steps',
    description: 'Complete your first challenge'
  },
  '5-challenges': {
    icon: CheckIcon,
    color: 'green',
    title: 'Getting Started',
    description: 'Complete 5 challenges'
  },
  '10-challenges': {
    icon: CheckIcon,
    color: 'green',
    title: 'Challenge Enthusiast',
    description: 'Complete 10 challenges'
  },
  '25-challenges': {
    icon: CheckIcon,
    color: 'green',
    title: 'Challenge Master',
    description: 'Complete 25 challenges'
  },
  '50-challenges': {
    icon: CheckIcon,
    color: 'green',
    title: 'Challenge Champion',
    description: 'Complete 50 challenges'
  },
  
  // Learning path badges
  'first-path': {
    icon: StarIcon,
    color: 'purple',
    title: 'Path Finder',
    description: 'Complete your first learning path'
  },
  '3-paths': {
    icon: StarIcon,
    color: 'purple',
    title: 'Path Explorer',
    description: 'Complete 3 learning paths'
  },
  '5-paths': {
    icon: StarIcon,
    color: 'purple',
    title: 'Path Master',
    description: 'Complete 5 learning paths'
  },
  
  // Level achievement badges
  'level-5': {
    icon: StarIcon,
    color: 'yellow',
    title: 'Apprentice',
    description: 'Reach level 5'
  },
  'level-10': {
    icon: StarIcon,
    color: 'yellow',
    title: 'Journeyman',
    description: 'Reach level 10'
  },
  'level-20': {
    icon: StarIcon,
    color: 'yellow',
    title: 'Expert',
    description: 'Reach level 20'
  },
  'level-30': {
    icon: StarIcon,
    color: 'yellow',
    title: 'Master',
    description: 'Reach level 30'
  },
  
  // Streak badges
  'streak-3': {
    icon: TimeIcon,
    color: 'blue',
    title: 'Consistent Learner',
    description: 'Maintain a 3-day learning streak'
  },
  'streak-7': {
    icon: TimeIcon,
    color: 'blue',
    title: 'Weekly Warrior',
    description: 'Maintain a 7-day learning streak'
  },
  'streak-30': {
    icon: TimeIcon,
    color: 'blue',
    title: 'Monthly Maven',
    description: 'Maintain a 30-day learning streak'
  },
  
  // Special badges
  'blockchain-expert': {
    icon: InfoIcon,
    color: 'teal',
    title: 'Blockchain Expert',
    description: 'Complete all blockchain challenges'
  },
  'ai-specialist': {
    icon: InfoIcon,
    color: 'teal',
    title: 'AI Specialist',
    description: 'Complete all AI challenges'
  },
  'security-expert': {
    icon: InfoIcon,
    color: 'red',
    title: 'Security Expert',
    description: 'Complete all security challenges'
  }
};

/**
 * Single achievement/badge component
 */
const AchievementBadge = ({ id, achieved = false }) => {
  const config = badgeConfig[id] || {
    icon: InfoIcon,
    color: 'gray', 
    title: 'Unknown Badge',
    description: 'Badge details unavailable'
  };
  
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  
  return (
    <Tooltip 
      label={config.description}
      hasArrow
      placement="top"
    >
      <Box
        bg={cardBg}
        borderWidth="1px"
        borderRadius="md"
        borderColor={achieved ? `${config.color}.200` : borderColor}
        p={3}
        cursor="pointer"
        transition="all 0.2s"
        _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
        opacity={achieved ? 1 : 0.5}
        position="relative"
      >
        <Flex 
          direction="column" 
          align="center" 
          justify="center" 
          textAlign="center"
        >
          <Box
            bg={achieved ? `${config.color}.100` : 'gray.100'}
            color={achieved ? `${config.color}.500` : 'gray.400'}
            borderRadius="full"
            p={3}
            mb={2}
          >
            <Icon as={config.icon} boxSize={6} />
          </Box>
          
          <Text 
            fontWeight="bold" 
            fontSize="sm"
            color={achieved ? 'gray.800' : textColor}
            mb={1}
          >
            {config.title}
          </Text>
          
          {!achieved && (
            <Badge 
              colorScheme="gray" 
              variant="outline" 
              fontSize="xs"
            >
              Locked
            </Badge>
          )}
          
          {achieved && (
            <Badge 
              colorScheme={config.color} 
              fontSize="xs"
            >
              Achieved
            </Badge>
          )}
        </Flex>
      </Box>
    </Tooltip>
  );
};

/**
 * Achievements and Badges display component
 */
const Achievements = ({ showAllBadges = false }) => {
  const { achievements } = useLearning();
  
  // Determine which badges to show
  const badgesToShow = showAllBadges 
    ? Object.keys(badgeConfig) 
    : achievements || [];
  
  return (
    <Box>
      <Heading as="h3" size="md" mb={4}>
        {showAllBadges ? 'Available Achievements' : 'Your Achievements'}
      </Heading>
      
      {(!achievements || achievements.length === 0) && !showAllBadges && (
        <Text color="gray.500" mb={4}>
          Complete challenges and learning paths to earn achievements and badges.
        </Text>
      )}
      
      <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4}>
        {badgesToShow.map(badgeId => (
          <AchievementBadge 
            key={badgeId} 
            id={badgeId} 
            achieved={achievements && achievements.includes(badgeId)}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Achievements;