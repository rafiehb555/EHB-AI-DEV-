import React from 'react';
import {
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  Badge,
  Flex,
  Button,
  Icon,
  Spacer,
  Tooltip,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  CheckIcon, 
  LockIcon, 
  StarIcon, 
  ArrowForwardIcon,
  TimeIcon
} from '@chakra-ui/icons';
import { FaCode, FaQuestionCircle, FaBook, FaProjectDiagram } from 'react-icons/fa';
import NextLink from 'next/link';

const ChallengeCard = ({ challenge, href }) => {
  const {
    id,
    title,
    description,
    type,
    difficulty,
    estimatedTime,
    xpReward,
    completed,
    locked
  } = challenge;
  
  // Get the appropriate icon based on challenge type
  const getChallengeIcon = (type) => {
    switch(type.toLowerCase()) {
      case 'coding': return FaCode;
      case 'quiz': return FaQuestionCircle;
      case 'guided': return FaBook;
      case 'project': return FaProjectDiagram;
      default: return FaCode;
    }
  };
  
  // Get the appropriate badge color based on difficulty
  const getDifficultyColor = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return 'green';
      case 'medium': return 'blue';
      case 'hard': return 'purple';
      default: return 'gray';
    }
  };
  
  // Get the appropriate badge color based on challenge type
  const getTypeColor = (type) => {
    switch(type.toLowerCase()) {
      case 'coding': return 'blue';
      case 'quiz': return 'orange';
      case 'guided': return 'green';
      case 'project': return 'purple';
      default: return 'gray';
    }
  };
  
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const borderColor = completed 
    ? 'green.400' 
    : useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Card 
      shadow="md" 
      position="relative" 
      borderWidth="1px"
      borderColor={borderColor}
      bg={cardBgColor}
      opacity={locked ? 0.6 : 1}
      transition="all 0.2s"
      _hover={{ transform: locked ? 'none' : 'translateY(-2px)' }}
    >
      {locked && (
        <Box 
          position="absolute" 
          top="0" 
          left="0" 
          width="100%" 
          height="100%" 
          bg="blackAlpha.600" 
          zIndex="1" 
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <LockIcon w={8} h={8} color="white" mb={2} />
          <Text color="white" fontWeight="bold" fontSize="sm">Complete previous challenges</Text>
        </Box>
      )}
      
      <CardBody>
        <Flex align="center" mb={3}>
          <Box
            bg={`${getTypeColor(type)}.100`}
            color={`${getTypeColor(type)}.500`}
            borderRadius="full"
            p={2}
            mr={3}
          >
            <Icon as={getChallengeIcon(type)} />
          </Box>
          
          <Flex direction="column">
            <Heading size="sm" mb={1}>{title}</Heading>
            <Flex>
              <Badge colorScheme={getDifficultyColor(difficulty)} mr={2}>
                {difficulty}
              </Badge>
              <Badge colorScheme="gray">
                {type}
              </Badge>
            </Flex>
          </Flex>
          
          {completed && (
            <Tooltip label="Completed" placement="top">
              <Box 
                bg="green.100" 
                color="green.500" 
                borderRadius="full" 
                p={1} 
                ml={2}
              >
                <CheckIcon w={3} h={3} />
              </Box>
            </Tooltip>
          )}
        </Flex>
        
        <Text fontSize="sm" mb={4} noOfLines={2} color="gray.600">
          {description}
        </Text>
        
        <Flex align="center" justify="space-between" mb={3}>
          <Flex align="center">
            <TimeIcon color="gray.500" mr={1} />
            <Text fontSize="xs" color="gray.500">{estimatedTime}</Text>
          </Flex>
          
          <Flex align="center">
            <StarIcon color="yellow.400" mr={1} />
            <Text fontSize="xs" fontWeight="bold">{xpReward} XP</Text>
          </Flex>
        </Flex>
        
        <NextLink href={href} passHref legacyBehavior>
          <Button 
            as="a"
            rightIcon={<ArrowForwardIcon />}
            colorScheme={completed ? "green" : "blue"}
            size="sm"
            width="100%"
            variant={completed ? "outline" : "solid"}
            isDisabled={locked}
          >
            {completed ? "Review" : "Start Challenge"}
          </Button>
        </NextLink>
      </CardBody>
    </Card>
  );
};

export default ChallengeCard;