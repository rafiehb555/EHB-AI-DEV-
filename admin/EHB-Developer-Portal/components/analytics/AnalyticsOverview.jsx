import React from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardBody,
  Heading,
  Skeleton,
  Stack,
  Flex,
  Progress,
  Text,
  Divider,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  RepeatIcon, 
  CheckCircleIcon, 
  WarningIcon,
  InfoIcon,
  TimeIcon
} from '@chakra-ui/icons';

const StatCard = ({ title, value, trend, trendValue, isLoading, icon, color }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.500', 'gray.400');
  const valueColor = useColorModeValue('gray.900', 'white');
  
  return (
    <Card shadow="md" bg={cardBg}>
      <CardBody>
        <Skeleton isLoaded={!isLoading}>
          <Flex justify="space-between" align="center" mb={2}>
            <StatLabel color={textColor} fontSize="sm">{title}</StatLabel>
            <Box color={color || 'gray.500'}>
              {icon}
            </Box>
          </Flex>
          <StatNumber fontSize="2xl" fontWeight="bold" color={valueColor}>{value}</StatNumber>
          {trend && (
            <StatHelpText mb={0}>
              <StatArrow type={trend} />
              {trendValue}
            </StatHelpText>
          )}
        </Skeleton>
      </CardBody>
    </Card>
  );
};

const SystemStatusCard = ({ status, uptime, isLoading }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const statusColors = {
    operational: 'green.500',
    degraded: 'orange.500', 
    outage: 'red.500'
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'operational':
        return <CheckCircleIcon color="green.500" />;
      case 'degraded':
        return <WarningIcon color="orange.500" />;
      case 'outage':
        return <WarningIcon color="red.500" />;
      default:
        return <InfoIcon color="gray.500" />;
    }
  };
  
  return (
    <Card shadow="md" bg={cardBg}>
      <CardBody>
        <Skeleton isLoaded={!isLoading}>
          <Flex justify="space-between" align="center" mb={2}>
            <Heading size="sm">System Status</Heading>
            <Box>{getStatusIcon(status)}</Box>
          </Flex>
          
          <Text 
            fontSize="md" 
            fontWeight="bold" 
            color={statusColors[status]}
            textTransform="capitalize"
          >
            {status}
          </Text>
          
          <Flex align="center" mt={2}>
            <TimeIcon mr={2} color="gray.500" />
            <Text fontSize="sm" color="gray.500">Uptime: {uptime}</Text>
          </Flex>
        </Skeleton>
      </CardBody>
    </Card>
  );
};

const ProgressCard = ({ title, value, max, color, isLoading }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const percentage = Math.round((value / max) * 100);
  
  return (
    <Card shadow="md" bg={cardBg}>
      <CardBody>
        <Skeleton isLoaded={!isLoading}>
          <Heading size="sm" mb={2}>{title}</Heading>
          <Text fontSize="2xl" fontWeight="bold" mb={2}>{percentage}%</Text>
          <Progress value={percentage} colorScheme={color} size="sm" borderRadius="full" />
          <Text fontSize="xs" mt={2} color="gray.500">
            {value} of {max} completed
          </Text>
        </Skeleton>
      </CardBody>
    </Card>
  );
};

const AnalyticsOverview = ({ timeRange, isLoading }) => {
  // In a real app, these values would come from API calls
  // Using static data for demonstration
  const systemStatus = {
    status: 'operational',
    uptime: '99.8% (30 days)'
  };
  
  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={8}>
        <StatCard 
          title="Active Users" 
          value="5,824" 
          trend="increase" 
          trendValue="23.36%"
          isLoading={isLoading}
          icon={<RepeatIcon />}
          color="blue.500"
        />
        <StatCard 
          title="API Requests" 
          value="3.2M" 
          trend="increase" 
          trendValue="12.05%"
          isLoading={isLoading}
          icon={<RepeatIcon />}
          color="purple.500"
        />
        <StatCard 
          title="AI Queries" 
          value="842,651" 
          trend="increase" 
          trendValue="18.74%"
          isLoading={isLoading}
          icon={<RepeatIcon />}
          color="teal.500"
        />
        <StatCard 
          title="Response Time" 
          value="125ms" 
          trend="decrease" 
          trendValue="8.32%"
          isLoading={isLoading}
          icon={<RepeatIcon />}
          color="green.500"
        />
      </SimpleGrid>
      
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={8}>
        <SystemStatusCard 
          status={systemStatus.status} 
          uptime={systemStatus.uptime}
          isLoading={isLoading}
        />
        <ProgressCard 
          title="Development Progress" 
          value={75} 
          max={100} 
          color="blue" 
          isLoading={isLoading}
        />
        <ProgressCard 
          title="API Integration" 
          value={23} 
          max={30} 
          color="green" 
          isLoading={isLoading}
        />
      </SimpleGrid>
      
      <Box>
        <Heading size="md" mb={4}>System Health Summary</Heading>
        <Skeleton isLoaded={!isLoading}>
          <Text mb={4}>
            The EHB system is currently operating at optimal efficiency with all core services reporting
            normal operation. There was a slight increase in API response times between 2:00 AM and 3:30 AM UTC
            due to scheduled database maintenance, but all metrics have returned to normal levels.
          </Text>
          
          <Box borderRadius="md" border="1px" borderColor="gray.200" p={4} bg={useColorModeValue('gray.50', 'gray.700')}>
            <Stack spacing={3}>
              <Flex justify="space-between">
                <Text fontWeight="medium">Frontend Services</Text>
                <Text color="green.500" fontWeight="medium">Operational</Text>
              </Flex>
              <Divider />
              <Flex justify="space-between">
                <Text fontWeight="medium">API Gateway</Text>
                <Text color="green.500" fontWeight="medium">Operational</Text>
              </Flex>
              <Divider />
              <Flex justify="space-between">
                <Text fontWeight="medium">Database Services</Text>
                <Text color="green.500" fontWeight="medium">Operational</Text>
              </Flex>
              <Divider />
              <Flex justify="space-between">
                <Text fontWeight="medium">Authentication Services</Text>
                <Text color="green.500" fontWeight="medium">Operational</Text>
              </Flex>
              <Divider />
              <Flex justify="space-between">
                <Text fontWeight="medium">AI Processing</Text>
                <Text color="green.500" fontWeight="medium">Operational</Text>
              </Flex>
            </Stack>
          </Box>
        </Skeleton>
      </Box>
    </Box>
  );
};

export default AnalyticsOverview;