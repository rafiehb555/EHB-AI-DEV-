import React from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Flex,
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
  Progress,
  Divider,
  Skeleton
} from '@chakra-ui/react';

const AiStatCard = ({ title, value, subvalue, trend, trendValue, isLoading }) => {
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

const ModelUsageTable = ({ data, isLoading }) => {
  return (
    <Skeleton isLoaded={!isLoading}>
      <Card shadow="md" bg="white" overflow="hidden">
        <CardBody p={0}>
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead bg="gray.50">
                <Tr>
                  <Th>AI Model</Th>
                  <Th>Total Requests</Th>
                  <Th>Success Rate</Th>
                  <Th>Avg. Tokens</Th>
                  <Th>Response Time</Th>
                  <Th>Usage Share</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((model, index) => (
                  <Tr key={index}>
                    <Td fontWeight="medium">{model.name}</Td>
                    <Td>{model.requests}</Td>
                    <Td>
                      <Badge 
                        colorScheme={model.success_rate >= 99 ? 'green' : model.success_rate >= 95 ? 'yellow' : 'red'}
                      >
                        {model.success_rate}%
                      </Badge>
                    </Td>
                    <Td>{model.avg_tokens}</Td>
                    <Td>{model.response_time}</Td>
                    <Td>
                      <Flex align="center">
                        <Text width="40px" fontSize="xs">{model.usage_share}%</Text>
                        <Progress 
                          value={model.usage_share} 
                          max={100} 
                          size="xs" 
                          width="80px" 
                          colorScheme="blue" 
                          ml={2}
                        />
                      </Flex>
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

const AiUsageByCategoryTable = ({ data, isLoading }) => {
  return (
    <Skeleton isLoaded={!isLoading}>
      <Card shadow="md" bg="white" overflow="hidden">
        <CardBody p={0}>
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Category</Th>
                  <Th>Total Requests</Th>
                  <Th>Percentage</Th>
                  <Th>Growth</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((category, index) => (
                  <Tr key={index}>
                    <Td fontWeight="medium">{category.name}</Td>
                    <Td>{category.requests}</Td>
                    <Td>
                      <Flex align="center">
                        <Text width="40px" fontSize="xs">{category.percentage}%</Text>
                        <Progress 
                          value={category.percentage} 
                          max={100} 
                          size="xs" 
                          width="80px" 
                          colorScheme="purple" 
                          ml={2}
                        />
                      </Flex>
                    </Td>
                    <Td>
                      <Badge 
                        colorScheme={category.growth > 10 ? 'green' : category.growth > 0 ? 'blue' : 'red'}
                      >
                        {category.growth > 0 ? '+' : ''}{category.growth}%
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

const AiUsageReports = ({ timeRange, isLoading }) => {
  // Mock data for demonstration
  const modelUsageData = [
    { 
      name: 'GPT-4o', 
      requests: '324,852', 
      success_rate: 99.7, 
      avg_tokens: 1842, 
      response_time: '2.45s',
      usage_share: 42
    },
    { 
      name: 'Claude 3.5', 
      requests: '245,318', 
      success_rate: 99.5, 
      avg_tokens: 1945, 
      response_time: '2.32s',
      usage_share: 31
    },
    { 
      name: 'Llama-3', 
      requests: '145,762', 
      success_rate: 98.8, 
      avg_tokens: 1532, 
      response_time: '1.85s',
      usage_share: 18
    },
    { 
      name: 'Mistral-8x22B', 
      requests: '54,327', 
      success_rate: 97.2, 
      avg_tokens: 1252, 
      response_time: '1.42s',
      usage_share: 7
    },
    { 
      name: 'Custom Models', 
      requests: '12,892', 
      success_rate: 95.8, 
      avg_tokens: 842, 
      response_time: '0.95s',
      usage_share: 2
    }
  ];
  
  const aiUsageByCategoryData = [
    { name: 'Content Generation', requests: '235,421', percentage: 30, growth: 24.5 },
    { name: 'Data Analysis', requests: '198,237', percentage: 25, growth: 18.2 },
    { name: 'Customer Support', requests: '142,738', percentage: 18, growth: 32.7 },
    { name: 'Code Generation', requests: '102,346', percentage: 13, growth: 42.8 },
    { name: 'Image Analysis', requests: '65,421', percentage: 8, growth: 28.4 },
    { name: 'Audio Transcription', requests: '34,728', percentage: 4, growth: 15.3 },
    { name: 'Other', requests: '15,250', percentage: 2, growth: 7.8 }
  ];
  
  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={8}>
        <AiStatCard 
          title="Total AI Requests" 
          value="842,651" 
          subvalue="Across all models"
          trend="increase" 
          trendValue="18.74% since last period"
          isLoading={isLoading}
        />
        <AiStatCard 
          title="Avg. Response Time" 
          value="2.12s" 
          subvalue="Global average"
          trend="decrease" 
          trendValue="8.6% since last period"
          isLoading={isLoading}
        />
        <AiStatCard 
          title="Success Rate" 
          value="98.9%" 
          subvalue="All models combined"
          trend="increase" 
          trendValue="0.5% since last period"
          isLoading={isLoading}
        />
        <AiStatCard 
          title="Cost Efficiency" 
          value="$0.0032" 
          subvalue="Per request average"
          trend="decrease" 
          trendValue="12.5% since last period"
          isLoading={isLoading}
        />
      </SimpleGrid>
      
      <Box mb={8}>
        <Heading size="md" mb={4}>AI Model Usage</Heading>
        <ModelUsageTable data={modelUsageData} isLoading={isLoading} />
      </Box>
      
      <Box mb={8}>
        <Heading size="md" mb={4}>AI Usage by Category</Heading>
        <AiUsageByCategoryTable data={aiUsageByCategoryData} isLoading={isLoading} />
      </Box>
      
      <Box>
        <Heading size="md" mb={4}>AI Usage Insights</Heading>
        <Skeleton isLoaded={!isLoading}>
          <Card shadow="md" bg="white">
            <CardBody>
              <Text mb={4}>
                AI usage continues to grow across all categories with code generation showing the highest growth rate at 42.8%. 
                GPT-4o remains the most utilized model, accounting for 42% of all requests due to its superior performance in
                complex reasoning tasks and multi-modal capabilities.
              </Text>
              <Text>
                The customer support category has shown significant growth (32.7%), indicating successful adoption of AI-powered
                support workflows. Cost efficiency has improved by 12.5% due to strategic model selection and optimized prompt engineering,
                resulting in fewer tokens per request while maintaining high quality outputs.
              </Text>
            </CardBody>
          </Card>
        </Skeleton>
      </Box>
    </Box>
  );
};

export default AiUsageReports;