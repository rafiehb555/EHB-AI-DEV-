import React from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Skeleton
} from '@chakra-ui/react';

const UserStatCard = ({ title, value, subvalue, trend, trendValue, isLoading }) => {
  return (
    <Card shadow="md" bg="white">
      <CardBody>
        <Skeleton isLoaded={!isLoading}>
          <Stat>
            <StatLabel color="gray.500">{title}</StatLabel>
            <StatNumber fontSize="2xl">{value}</StatNumber>
            {subvalue && <Text fontSize="sm" color="gray.500">{subvalue}</Text>}
            {trend && (
              <StatHelpText>
                <StatArrow type={trend} />
                {trendValue}
              </StatHelpText>
            )}
          </Stat>
        </Skeleton>
      </CardBody>
    </Card>
  );
};

const UserStatsTable = ({ data, isLoading }) => {
  return (
    <Skeleton isLoaded={!isLoading}>
      <Card shadow="md" bg="white" overflow="hidden">
        <CardBody p={0}>
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead bg="gray.50">
                <Tr>
                  <Th>User Type</Th>
                  <Th>Total Users</Th>
                  <Th>Active Users</Th>
                  <Th>Growth Rate</Th>
                  <Th>Retention</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((row, index) => (
                  <Tr key={index}>
                    <Td fontWeight="medium">{row.type}</Td>
                    <Td>{row.total}</Td>
                    <Td>
                      {row.active} 
                      <Text as="span" fontSize="xs" color="gray.500" ml={1}>
                        ({Math.round((row.active / row.total) * 100)}%)
                      </Text>
                    </Td>
                    <Td>
                      <Badge 
                        colorScheme={row.growth > 10 ? 'green' : row.growth > 0 ? 'blue' : 'red'}
                      >
                        {row.growth > 0 ? '+' : ''}{row.growth}%
                      </Badge>
                    </Td>
                    <Td>{row.retention}%</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>
    </Skeleton>
  );
};

const GeoDistributionTable = ({ data, isLoading }) => {
  return (
    <Skeleton isLoaded={!isLoading}>
      <Card shadow="md" bg="white" overflow="hidden">
        <CardBody p={0}>
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Region</Th>
                  <Th>Users</Th>
                  <Th>Percentage</Th>
                  <Th>Growth</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((row, index) => (
                  <Tr key={index}>
                    <Td fontWeight="medium">{row.region}</Td>
                    <Td>{row.users}</Td>
                    <Td>{row.percentage}%</Td>
                    <Td>
                      <Badge 
                        colorScheme={row.growth > 5 ? 'green' : row.growth > 0 ? 'blue' : 'red'}
                      >
                        {row.growth > 0 ? '+' : ''}{row.growth}%
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>
    </Skeleton>
  );
};

const UserStats = ({ timeRange, isLoading }) => {
  // Mock data for demonstration
  const userTypeData = [
    { 
      type: 'Administrators', 
      total: 152, 
      active: 138, 
      growth: 4.2, 
      retention: 96.5 
    },
    { 
      type: 'Developers', 
      total: 3245, 
      active: 2840, 
      growth: 12.8, 
      retention: 88.2 
    },
    { 
      type: 'End Users', 
      total: 56890, 
      active: 48320, 
      growth: 23.5, 
      retention: 78.6 
    },
    { 
      type: 'Enterprise Clients', 
      total: 427, 
      active: 412, 
      growth: 8.7, 
      retention: 94.3 
    },
    { 
      type: 'API Integrators', 
      total: 789, 
      active: 645, 
      growth: 15.2, 
      retention: 85.7 
    }
  ];
  
  const geoDistribution = [
    { region: 'North America', users: '32,450', percentage: 57.2, growth: 8.4 },
    { region: 'Europe', users: '12,835', percentage: 22.6, growth: 12.7 },
    { region: 'Asia Pacific', users: '8,753', percentage: 15.4, growth: 28.5 },
    { region: 'South America', users: '1,842', percentage: 3.2, growth: 14.2 },
    { region: 'Africa', users: '810', percentage: 1.4, growth: 35.8 },
    { region: 'Other Regions', users: '123', percentage: 0.2, growth: 5.1 }
  ];
  
  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={8}>
        <UserStatCard 
          title="Total Users" 
          value="61,503" 
          subvalue="Across all platforms"
          trend="increase" 
          trendValue="22.4% since last period"
          isLoading={isLoading}
        />
        <UserStatCard 
          title="Active Users" 
          value="52,355" 
          subvalue="85.1% of total users"
          trend="increase" 
          trendValue="18.7% since last period"
          isLoading={isLoading}
        />
        <UserStatCard 
          title="New Registrations" 
          value="12,875" 
          subvalue="Last 30 days"
          trend="increase" 
          trendValue="32.5% since last period"
          isLoading={isLoading}
        />
        <UserStatCard 
          title="Churn Rate" 
          value="3.2%" 
          subvalue="Monthly average"
          trend="decrease" 
          trendValue="1.8% since last period"
          isLoading={isLoading}
        />
      </SimpleGrid>
      
      <Box mb={8}>
        <Heading size="md" mb={4}>User Types</Heading>
        <UserStatsTable data={userTypeData} isLoading={isLoading} />
      </Box>
      
      <Box mb={8}>
        <Heading size="md" mb={4}>Geographic Distribution</Heading>
        <GeoDistributionTable data={geoDistribution} isLoading={isLoading} />
      </Box>
      
      <Box>
        <Heading size="md" mb={4}>User Growth Summary</Heading>
        <Skeleton isLoaded={!isLoading}>
          <Card shadow="md" bg="white">
            <CardBody>
              <Text mb={4}>
                User growth continues to exceed projections with a 22.4% increase across all user categories. 
                The highest growth is observed in End Users (23.5%) and API Integrators (15.2%), indicating 
                successful market penetration and developer adoption.
              </Text>
              <Text>
                Geographic expansion shows promising results with 35.8% growth in Africa and 28.5% in Asia Pacific regions,
                highlighting the effectiveness of recent localization efforts. The enterprise retention rate of 94.3% exceeds
                the target goal of 90%, demonstrating strong product-market fit in the enterprise segment.
              </Text>
            </CardBody>
          </Card>
        </Skeleton>
      </Box>
    </Box>
  );
};

export default UserStats;