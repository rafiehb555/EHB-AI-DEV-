import React from 'react';
import {
  Box,
  SimpleGrid,
  Card,
  CardBody,
  Heading,
  Text,
  Flex,
  Badge,
  Stack,
  Skeleton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Divider,
  useColorModeValue
} from '@chakra-ui/react';

const UsageMetricsCard = ({ title, metrics, isLoading }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Card shadow="md" bg={cardBg}>
      <CardBody>
        <Heading size="sm" mb={4}>{title}</Heading>
        <Skeleton isLoaded={!isLoading}>
          <Stack spacing={3} divider={<Divider />}>
            {metrics.map((metric, index) => (
              <Flex key={index} justify="space-between" align="center">
                <Text fontSize="sm">{metric.name}</Text>
                <Flex align="center">
                  <Text fontWeight="bold" mr={2}>{metric.value}</Text>
                  {metric.change && (
                    <Badge 
                      colorScheme={metric.change > 0 ? 'green' : metric.change < 0 ? 'red' : 'gray'}
                      fontSize="xs"
                    >
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </Badge>
                  )}
                </Flex>
              </Flex>
            ))}
          </Stack>
        </Skeleton>
      </CardBody>
    </Card>
  );
};

const UsageTable = ({ data, columns, isLoading }) => {
  const tableBg = useColorModeValue('white', 'gray.700');
  const headerBg = useColorModeValue('gray.50', 'gray.600');
  
  return (
    <Skeleton isLoaded={!isLoading}>
      <Card shadow="md" bg={tableBg} overflow="hidden">
        <CardBody p={0}>
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead bg={headerBg}>
                <Tr>
                  {columns.map((column, index) => (
                    <Th key={index}>{column}</Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {data.map((row, rowIndex) => (
                  <Tr key={rowIndex}>
                    {columns.map((column, colIndex) => (
                      <Td key={colIndex}>
                        {row[column.toLowerCase().replace(/\s/g, '_')]}
                      </Td>
                    ))}
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

const UsageMetrics = ({ timeRange, isLoading }) => {
  // Mock data for demonstration
  const apiRequests = [
    { name: 'Total Requests', value: '3,245,897', change: 12.3 },
    { name: 'Success Rate', value: '99.7%', change: 0.2 },
    { name: 'Avg. Response Time', value: '125ms', change: -8.4 },
    { name: 'Bandwidth Used', value: '1.45 TB', change: 22.1 },
    { name: 'Cache Hit Rate', value: '78.3%', change: 5.7 }
  ];
  
  const serverUsage = [
    { name: 'CPU Utilization', value: '42%', change: -2.3 },
    { name: 'Memory Usage', value: '6.8 GB', change: 1.8 },
    { name: 'Disk I/O', value: '245 MB/s', change: 4.5 },
    { name: 'Network Traffic', value: '320 Mbps', change: 15.2 },
    { name: 'Avg. Server Load', value: '0.72', change: -3.1 }
  ];
  
  const databaseMetrics = [
    { name: 'Query Count', value: '725,431', change: 8.9 },
    { name: 'Avg. Query Time', value: '18ms', change: -12.4 },
    { name: 'Active Connections', value: '84', change: 5.2 },
    { name: 'Index Usage', value: '92.1%', change: 0.8 },
    { name: 'Storage Used', value: '512 GB', change: 25.3 }
  ];
  
  const serviceUsageData = [
    { 
      service: 'User Authentication',
      requests: '852,432',
      avg_time: '45ms',
      error_rate: '0.05%',
      peak_usage: '2,310 req/min'
    },
    { 
      service: 'API Gateway',
      requests: '1,243,564',
      avg_time: '12ms',
      error_rate: '0.02%',
      peak_usage: '4,520 req/min'
    },
    { 
      service: 'Data Processing',
      requests: '523,987',
      avg_time: '86ms',
      error_rate: '0.12%',
      peak_usage: '1,860 req/min'
    },
    { 
      service: 'AI Service',
      requests: '342,671',
      avg_time: '210ms',
      error_rate: '0.34%',
      peak_usage: '980 req/min'
    },
    { 
      service: 'Storage Service',
      requests: '283,243',
      avg_time: '65ms',
      error_rate: '0.08%',
      peak_usage: '1,240 req/min'
    }
  ];
  
  const serviceUsageColumns = ['Service', 'Requests', 'Avg Time', 'Error Rate', 'Peak Usage'];
  
  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={8}>
        <UsageMetricsCard title="API Usage" metrics={apiRequests} isLoading={isLoading} />
        <UsageMetricsCard title="Server Performance" metrics={serverUsage} isLoading={isLoading} />
        <UsageMetricsCard title="Database Metrics" metrics={databaseMetrics} isLoading={isLoading} />
      </SimpleGrid>
      
      <Box mb={8}>
        <Heading size="md" mb={4}>Service Usage Details</Heading>
        <UsageTable 
          data={serviceUsageData} 
          columns={serviceUsageColumns} 
          isLoading={isLoading} 
        />
      </Box>
      
      <Box mb={8}>
        <Heading size="md" mb={4}>Usage Summary</Heading>
        <Skeleton isLoaded={!isLoading}>
          <Card shadow="md">
            <CardBody>
              <Text mb={4}>
                The system has been operating with excellent performance metrics during the selected period. 
                API response times have decreased by 8.4% while handling 12.3% more requests compared to the previous period.
                Database optimizations have resulted in 12.4% faster query times despite an 8.9% increase in query volume.
              </Text>
              <Text>
                The AI service shows the highest error rate at 0.34%, which is still well below the target threshold of 1%. 
                Server resources are being efficiently utilized with plenty of headroom for scaling as needed.
              </Text>
            </CardBody>
          </Card>
        </Skeleton>
      </Box>
    </Box>
  );
};

export default UsageMetrics;