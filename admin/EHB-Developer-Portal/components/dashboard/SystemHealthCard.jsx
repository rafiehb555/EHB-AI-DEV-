import React from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Flex,
  Progress,
  HStack,
  Badge,
  Icon,
  SimpleGrid,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  CheckCircleIcon,
  WarningIcon, 
  InfoIcon
} from '@chakra-ui/icons';
import { 
  FaServer, 
  FaDatabase, 
  FaUser, 
  FaCode, 
  FaCloudUploadAlt, 
  FaMemory 
} from 'react-icons/fa';

const HealthItem = ({ title, percentage, status }) => {
  // Set color based on health status
  const getColorScheme = (percentage) => {
    if (percentage >= 90) return 'green';
    if (percentage >= 70) return 'blue';
    if (percentage >= 50) return 'yellow';
    return 'red';
  };
  
  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon color="green.500" />;
      case 'warning':
        return <WarningIcon color="orange.500" />;
      case 'critical':
        return <WarningIcon color="red.500" />;
      default:
        return <InfoIcon color="blue.500" />;
    }
  };
  
  // Map titles to icons
  const getIcon = (title) => {
    const iconMap = {
      'admin': FaUser,
      'services': FaServer,
      'system': FaCode,
      'api': FaCloudUploadAlt,
      'database': FaDatabase,
      'storage': FaMemory
    };
    
    return iconMap[title.toLowerCase()] || FaServer;
  };
  
  const colorScheme = getColorScheme(percentage);
  
  return (
    <Box mb={4}>
      <Flex justify="space-between" align="center" mb={1}>
        <HStack>
          <Icon as={getIcon(title)} color={`${colorScheme}.500`} />
          <Text fontWeight="medium" fontSize="sm">{title}</Text>
        </HStack>
        <HStack>
          <Badge 
            colorScheme={status === 'healthy' ? 'green' : status === 'warning' ? 'orange' : 'red'}
            fontSize="xs"
          >
            {status}
          </Badge>
          <Text fontSize="xs" fontWeight="bold">{percentage}%</Text>
        </HStack>
      </Flex>
      <Progress 
        value={percentage} 
        size="sm" 
        colorScheme={colorScheme} 
        borderRadius="full" 
      />
    </Box>
  );
};

const SystemHealthCard = ({ healthData }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Calculate overall health percentage
  const overallHealth = Object.values(healthData).reduce((sum, item) => sum + item.percentage, 0) / Object.keys(healthData).length;
  
  return (
    <Card borderWidth="1px" borderColor={borderColor} bg={cardBg} h="100%">
      <CardHeader pb={2}>
        <Flex justify="space-between" align="center">
          <Heading size="md">System Health</Heading>
          <Badge 
            colorScheme={overallHealth >= 90 ? 'green' : overallHealth >= 70 ? 'blue' : 'orange'}
            fontSize="sm"
            px={2}
            py={1}
            borderRadius="md"
          >
            {Math.round(overallHealth)}%
          </Badge>
        </Flex>
        <Text fontSize="sm" color="gray.500">
          Real-time system performance metrics
        </Text>
      </CardHeader>
      
      <CardBody>
        <SimpleGrid columns={1} spacing={1}>
          {Object.entries(healthData).map(([key, value]) => (
            <HealthItem 
              key={key}
              title={key.charAt(0).toUpperCase() + key.slice(1)} 
              percentage={value.percentage}
              status={value.status}
            />
          ))}
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

export default SystemHealthCard;