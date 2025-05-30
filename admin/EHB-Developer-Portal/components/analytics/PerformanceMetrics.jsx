import React from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  SimpleGrid,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardBody,
  Skeleton
} from '@chakra-ui/react';

// Simple Performance Stat Card that doesn't use color mode value
const PerformanceStatCard = ({ title, value, unit, trend, trendValue, isLoading, color = "blue.500" }) => {
  return (
    <Card shadow="md" bg="white">
      <CardBody>
        <Skeleton isLoaded={!isLoading}>
          <StatLabel color="gray.500" fontSize="sm">{title}</StatLabel>
          <Flex align="baseline" mt={1}>
            <StatNumber fontSize="2xl" fontWeight="bold" color="gray.900">{value}</StatNumber>
            {unit && <Text ml={1} fontSize="sm" color="gray.500">{unit}</Text>}
          </Flex>
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

// Simple Performance Progress Card
const PerformanceProgressCard = ({ title, value, max, isLoading, color = "blue" }) => {
  const percentage = Math.round((value / max) * 100);
  
  return (
    <Card shadow="md" bg="white">
      <CardBody>
        <Skeleton isLoaded={!isLoading}>
          <Heading size="sm" mb={2}>{title}</Heading>
          <Text fontSize="2xl" fontWeight="bold" mb={2}>{percentage}%</Text>
          <Progress value={percentage} colorScheme={color} size="sm" borderRadius="full" />
          <Text fontSize="xs" mt={2} color="gray.500">
            {value} of {max} maximum
          </Text>
        </Skeleton>
      </CardBody>
    </Card>
  );
};

const PerformanceMetrics = ({ timeRange, isLoading }) => {
  return (
    <Box>
      <Box mb={8}>
        <Heading size="md" mb={4}>System Performance Metrics</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          <PerformanceStatCard 
            title="Average Response Time" 
            value="125" 
            unit="ms"
            trend="decrease" 
            trendValue="8.32%"
            isLoading={isLoading}
            color="green.500"
          />
          <PerformanceStatCard 
            title="CPU Utilization" 
            value="42" 
            unit="%"
            trend="decrease" 
            trendValue="2.3%"
            isLoading={isLoading}
            color="blue.500"
          />
          <PerformanceStatCard 
            title="Memory Usage" 
            value="6.8" 
            unit="GB"
            trend="increase" 
            trendValue="1.8%"
            isLoading={isLoading}
            color="purple.500"
          />
          <PerformanceStatCard 
            title="Avg. Server Load" 
            value="0.72" 
            unit=""
            trend="decrease" 
            trendValue="3.1%"
            isLoading={isLoading}
            color="teal.500"
          />
        </SimpleGrid>
      </Box>
      
      <Box mb={8}>
        <Heading size="md" mb={4}>Resource Utilization</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          <PerformanceProgressCard 
            title="Database Connections" 
            value={84} 
            max={250} 
            isLoading={isLoading}
            color="green"
          />
          <PerformanceProgressCard 
            title="API Rate Limit" 
            value={4520} 
            max={10000} 
            isLoading={isLoading}
            color="blue"
          />
          <PerformanceProgressCard 
            title="Storage Utilization" 
            value={512} 
            max={1024} 
            isLoading={isLoading}
            color="orange"
          />
        </SimpleGrid>
      </Box>
      
      <Box>
        <Heading size="md" mb={4}>System Health Summary</Heading>
        <Skeleton isLoaded={!isLoading}>
          <Card shadow="md" bg="white">
            <CardBody>
              <Text mb={4}>
                The EHB system is performing well within expected parameters. Response times continue to improve
                with an 8.32% decrease compared to the previous period. CPU utilization remains low at 42%,
                indicating sufficient headroom for increased load.
              </Text>
              <Text>
                Storage utilization is currently at 50% of capacity, with an estimated 6 months before additional
                storage allocation may be required based on current growth rates. Database connections are well
                below the configured maximum, ensuring optimal query performance.
              </Text>
            </CardBody>
          </Card>
        </Skeleton>
      </Box>
    </Box>
  );
};

export default PerformanceMetrics;