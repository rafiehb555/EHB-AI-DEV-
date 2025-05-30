import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  StackDivider,
  Progress,
  Badge,
  Button,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  VStack,
  Select,
  useColorModeValue,
  Divider,
  Link
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  FaServer, 
  FaDatabase, 
  FaUsers, 
  FaRobot, 
  FaChartLine,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaCode,
  FaShield,
  FaCubes,
  FaNetworkWired
} from 'react-icons/fa';
import {
  CheckCircleIcon,
  WarningIcon,
  InfoIcon,
  TimeIcon,
  StarIcon,
  SettingsIcon,
  ViewIcon,
  ChevronRightIcon
} from '@chakra-ui/icons';

// Mock data for dashboard stats
const statsData = [
  { 
    name: 'Active Users', 
    value: 2453, 
    change: 12.5, 
    icon: FaUsers, 
    color: 'blue' 
  },
  { 
    name: 'Services', 
    value: 48, 
    change: 4.2, 
    icon: FaServer, 
    color: 'purple' 
  },
  { 
    name: 'AI Requests', 
    value: 15792, 
    change: 22.8, 
    icon: FaRobot, 
    color: 'green' 
  },
  { 
    name: 'DB Size', 
    value: '2.8 GB', 
    change: 1.5, 
    icon: FaDatabase, 
    color: 'orange' 
  }
];

// Mock data for system health
const systemHealth = {
  overall: 96,
  components: [
    { name: 'Frontend', status: 'healthy', uptime: '18d 4h', responseTime: '42ms' },
    { name: 'Backend API', status: 'healthy', uptime: '18d 4h', responseTime: '128ms' },
    { name: 'Database', status: 'healthy', uptime: '29d 7h', responseTime: '35ms' },
    { name: 'AI Services', status: 'warning', uptime: '6d 12h', responseTime: '350ms' },
    { name: 'Blockchain', status: 'healthy', uptime: '12d 8h', responseTime: '220ms' },
    { name: 'GoSellr', status: 'healthy', uptime: '8d 16h', responseTime: '95ms' }
  ]
};

// Mock data for usage charts
const usageData = [
  { name: 'Jan', users: 4000, requests: 2400, amt: 2400 },
  { name: 'Feb', users: 3000, requests: 1398, amt: 2210 },
  { name: 'Mar', users: 2000, requests: 9800, amt: 2290 },
  { name: 'Apr', users: 2780, requests: 3908, amt: 2000 },
  { name: 'May', users: 1890, requests: 4800, amt: 2181 },
  { name: 'Jun', users: 2390, requests: 3800, amt: 2500 },
  { name: 'Jul', users: 3490, requests: 4300, amt: 2100 },
];

// Service categories with completion percentage
const serviceCategories = [
  { name: 'Core Services', complete: 100, total: 6 },
  { name: 'AI Components', complete: 4, total: 5 },
  { name: 'Database Layers', complete: 3, total: 3 },
  { name: 'Admin Tools', complete: 7, total: 8 },
  { name: 'Blockchain', complete: 2, total: 4 },
  { name: 'API Endpoints', complete: 12, total: 15 }
];

// Recent activities
const recentActivities = [
  { action: 'New user registration', time: '2 minutes ago', status: 'normal' },
  { action: 'AI service restarted', time: '15 minutes ago', status: 'warning' },
  { action: 'Database backup completed', time: '1 hour ago', status: 'normal' },
  { action: 'API endpoint updated', time: '2 hours ago', status: 'normal' },
  { action: 'System update deployed', time: '1 day ago', status: 'normal' }
];

// Activity breakdown data for pie chart
const activityBreakdown = [
  { name: 'Users', value: 35 },
  { name: 'AI', value: 25 },
  { name: 'API', value: 20 },
  { name: 'Admin', value: 15 },
  { name: 'Other', value: 5 }
];

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Stat Card Component
const StatCard = ({ stat }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Card borderWidth="1px" borderColor={borderColor} bg={cardBg}>
      <CardBody>
        <Flex justify="space-between">
          <Box>
            <StatLabel color="gray.500">{stat.name}</StatLabel>
            <StatNumber fontSize="2xl">{stat.value}</StatNumber>
            <StatHelpText>
              <StatArrow type={stat.change > 0 ? 'increase' : 'decrease'} />
              {Math.abs(stat.change)}%
            </StatHelpText>
          </Box>
          <Box
            bg={`${stat.color}.100`}
            color={`${stat.color}.700`}
            p={3}
            borderRadius="lg"
            height="fit-content"
          >
            <Icon as={stat.icon} boxSize={6} />
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
};

// System Health Status Component
const SystemHealthStatus = ({ data }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon color="green.500" />;
      case 'warning':
        return <WarningIcon color="orange.500" />;
      case 'error':
        return <FaExclamationTriangle color="red.500" />;
      default:
        return <InfoIcon color="blue.500" />;
    }
  };
  
  return (
    <Card borderWidth="1px" borderColor={borderColor} bg={cardBg} h="100%">
      <CardHeader pb={0}>
        <Flex justify="space-between" align="center">
          <Heading size="md">System Health</Heading>
          <Badge colorScheme="green" fontSize="md" px={2} py={1} borderRadius="md">
            {data.overall}%
          </Badge>
        </Flex>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing={2}>
          {data.components.map((component, index) => (
            <Flex key={index} justify="space-between" align="center">
              <HStack>
                {getStatusIcon(component.status)}
                <Text fontWeight="medium">{component.name}</Text>
              </HStack>
              <HStack spacing={4}>
                <Text fontSize="sm" color="gray.500" display={{ base: 'none', md: 'block' }}>
                  <Icon as={FaClock} mr={1} />
                  {component.uptime}
                </Text>
                <Badge 
                  colorScheme={
                    component.status === 'healthy' ? 'green' : 
                    component.status === 'warning' ? 'orange' : 'red'
                  }
                >
                  {component.responseTime}
                </Badge>
              </HStack>
            </Flex>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
};

// Service Category Progress Component
const ServiceProgress = ({ categories }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Card borderWidth="1px" borderColor={borderColor} bg={cardBg} h="100%">
      <CardHeader pb={0}>
        <Heading size="md">Implementation Progress</Heading>
      </CardHeader>
      <CardBody>
        <VStack spacing={4} align="stretch">
          {categories.map((category, index) => {
            const percentage = Math.round((category.complete / category.total) * 100);
            
            return (
              <Box key={index}>
                <Flex justify="space-between" mb={1}>
                  <Text fontSize="sm" fontWeight="medium">{category.name}</Text>
                  <Text fontSize="sm">
                    {category.complete}/{category.total} ({percentage}%)
                  </Text>
                </Flex>
                <Progress 
                  value={percentage} 
                  size="sm" 
                  colorScheme={
                    percentage === 100 ? 'green' :
                    percentage >= 75 ? 'blue' :
                    percentage >= 50 ? 'yellow' :
                    'orange'
                  }
                  borderRadius="full"
                />
              </Box>
            );
          })}
        </VStack>
      </CardBody>
      <CardFooter pt={0}>
        <Button size="sm" rightIcon={<ChevronRightIcon />} variant="ghost" colorScheme="blue">
          View All Services
        </Button>
      </CardFooter>
    </Card>
  );
};

// Recent Activity Component
const RecentActivity = ({ activities }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Card borderWidth="1px" borderColor={borderColor} bg={cardBg} h="100%">
      <CardHeader pb={0}>
        <Heading size="md">Recent Activity</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing={2}>
          {activities.map((activity, index) => (
            <Flex key={index} justify="space-between" align="center">
              <HStack>
                {activity.status === 'warning' ? (
                  <WarningIcon color="orange.500" />
                ) : (
                  <InfoIcon color="blue.500" />
                )}
                <Text fontSize="sm">{activity.action}</Text>
              </HStack>
              <Text fontSize="xs" color="gray.500">
                {activity.time}
              </Text>
            </Flex>
          ))}
        </Stack>
      </CardBody>
      <CardFooter pt={0}>
        <Button size="sm" rightIcon={<ChevronRightIcon />} variant="ghost" colorScheme="blue">
          View All Activity
        </Button>
      </CardFooter>
    </Card>
  );
};

// Main Dashboard Component
const IntegratedDashboard = () => {
  // Time range state
  const [timeRange, setTimeRange] = useState('7d');
  
  return (
    <Box>
      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        justify="space-between" 
        align={{ base: 'flex-start', md: 'center' }}
        mb={6}
      >
        <Box mb={{ base: 4, md: 0 }}>
          <Heading size="lg" mb={1}>Dashboard</Heading>
          <Text color="gray.500">Overview of EHB system status and metrics</Text>
        </Box>
        
        <HStack spacing={4}>
          <Select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            size="sm"
            width="120px"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </Select>
          
          <Button 
            size="sm" 
            leftIcon={<ViewIcon />}
            colorScheme="blue"
            variant="outline"
          >
            Refresh
          </Button>
        </HStack>
      </Flex>
      
      {/* Stat Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={6}>
        {statsData.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </SimpleGrid>
      
      {/* Charts Section */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
        {/* Usage Chart */}
        <Card>
          <CardHeader pb={1}>
            <Heading size="md">System Usage</Heading>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={usageData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="#82ca9d"
                  fillOpacity={1}
                  fill="url(#colorRequests)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
        
        {/* Activity Breakdown */}
        <Card>
          <CardHeader pb={1}>
            <Heading size="md">Activity Breakdown</Heading>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={activityBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {activityBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      {/* System Info and Recent Activity */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={6}>
        <GridItem colSpan={{ base: 1, lg: 1 }}>
          <SystemHealthStatus data={systemHealth} />
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 1 }}>
          <ServiceProgress categories={serviceCategories} />
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 1 }}>
          <RecentActivity activities={recentActivities} />
        </GridItem>
      </SimpleGrid>
      
      {/* Tabs for Additional Information */}
      <Card>
        <CardBody>
          <Tabs colorScheme="blue" variant="enclosed">
            <TabList>
              <Tab><Icon as={FaCode} mr={2} /> Development</Tab>
              <Tab><Icon as={FaShield} mr={2} /> Security</Tab>
              <Tab><Icon as={FaCubes} mr={2} /> Resources</Tab>
              <Tab><Icon as={FaNetworkWired} mr={2} /> Integration</Tab>
            </TabList>
            
            <TabPanels>
              <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <Card>
                    <CardHeader pb={0}>
                      <Heading size="sm">Active Developers</Heading>
                    </CardHeader>
                    <CardBody>
                      <Stat>
                        <StatNumber>14</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          2 since last week
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                  
                  <Card>
                    <CardHeader pb={0}>
                      <Heading size="sm">Code Commits</Heading>
                    </CardHeader>
                    <CardBody>
                      <Stat>
                        <StatNumber>256</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          24 since yesterday
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                  
                  <Card>
                    <CardHeader pb={0}>
                      <Heading size="sm">Pull Requests</Heading>
                    </CardHeader>
                    <CardBody>
                      <Stat>
                        <StatNumber>18</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          5 since yesterday
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                </SimpleGrid>
                
                <Divider my={4} />
                
                <Heading size="sm" mb={3}>Recent Code Updates</Heading>
                <Stack divider={<StackDivider />} spacing={2}>
                  <Flex justify="space-between" align="center">
                    <HStack>
                      <InfoIcon color="blue.500" />
                      <Text fontSize="sm">AI Dashboard components updated</Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.500">2 hours ago</Text>
                  </Flex>
                  <Flex justify="space-between" align="center">
                    <HStack>
                      <InfoIcon color="blue.500" />
                      <Text fontSize="sm">Fixed authentication in API gateway</Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.500">5 hours ago</Text>
                  </Flex>
                  <Flex justify="space-between" align="center">
                    <HStack>
                      <InfoIcon color="blue.500" />
                      <Text fontSize="sm">Optimized database queries for better performance</Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.500">1 day ago</Text>
                  </Flex>
                </Stack>
              </TabPanel>
              
              <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={4}>
                  <Card>
                    <CardHeader pb={0}>
                      <Heading size="sm">Security Score</Heading>
                    </CardHeader>
                    <CardBody>
                      <Stat>
                        <StatNumber>92/100</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          3 points since last check
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                  
                  <Card>
                    <CardHeader pb={0}>
                      <Heading size="sm">Vulnerabilities</Heading>
                    </CardHeader>
                    <CardBody>
                      <Stat>
                        <StatNumber>2</StatNumber>
                        <StatHelpText>
                          <StatArrow type="decrease" />
                          5 fixed this week
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                  
                  <Card>
                    <CardHeader pb={0}>
                      <Heading size="sm">Last Security Scan</Heading>
                    </CardHeader>
                    <CardBody>
                      <Stat>
                        <StatNumber>8 hours ago</StatNumber>
                        <StatHelpText>
                          Daily automated scan
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                </SimpleGrid>
                
                <Card>
                  <CardHeader pb={0}>
                    <Heading size="sm">Security Alerts</Heading>
                  </CardHeader>
                  <CardBody>
                    <Stack divider={<StackDivider />} spacing={2}>
                      <Flex justify="space-between" align="center">
                        <HStack>
                          <WarningIcon color="orange.500" />
                          <VStack align="start" spacing={0}>
                            <Text fontSize="sm" fontWeight="medium">OAuth token expiration issue</Text>
                            <Text fontSize="xs" color="gray.500">Affects: Authentication Service</Text>
                          </VStack>
                        </HStack>
                        <Badge colorScheme="yellow">Medium</Badge>
                      </Flex>
                      
                      <Flex justify="space-between" align="center">
                        <HStack>
                          <WarningIcon color="red.500" />
                          <VStack align="start" spacing={0}>
                            <Text fontSize="sm" fontWeight="medium">Dependency needs update</Text>
                            <Text fontSize="xs" color="gray.500">Affects: AI Dashboard, Smart AI Agent</Text>
                          </VStack>
                        </HStack>
                        <Badge colorScheme="red">High</Badge>
                      </Flex>
                    </Stack>
                  </CardBody>
                </Card>
              </TabPanel>
              
              <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                  <Card>
                    <CardHeader pb={0}>
                      <Heading size="sm">CPU Usage</Heading>
                    </CardHeader>
                    <CardBody>
                      <Stat>
                        <StatNumber>42%</StatNumber>
                        <Progress value={42} size="sm" colorScheme="green" mb={2} />
                        <StatHelpText>
                          <StatArrow type="decrease" />
                          5% since yesterday
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                  
                  <Card>
                    <CardHeader pb={0}>
                      <Heading size="sm">Memory Usage</Heading>
                    </CardHeader>
                    <CardBody>
                      <Stat>
                        <StatNumber>68%</StatNumber>
                        <Progress value={68} size="sm" colorScheme="blue" mb={2} />
                        <StatHelpText>
                          <StatArrow type="increase" />
                          3% since yesterday
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                  
                  <Card>
                    <CardHeader pb={0}>
                      <Heading size="sm">Disk Usage</Heading>
                    </CardHeader>
                    <CardBody>
                      <Stat>
                        <StatNumber>35%</StatNumber>
                        <Progress value={35} size="sm" colorScheme="green" mb={2} />
                        <StatHelpText>
                          <StatArrow type="increase" />
                          2% since last week
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                  
                  <Card>
                    <CardHeader pb={0}>
                      <Heading size="sm">Network Load</Heading>
                    </CardHeader>
                    <CardBody>
                      <Stat>
                        <StatNumber>56%</StatNumber>
                        <Progress value={56} size="sm" colorScheme="yellow" mb={2} />
                        <StatHelpText>
                          <StatArrow type="increase" />
                          8% since yesterday
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </TabPanel>
              
              <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={4}>
                  <Card>
                    <CardHeader pb={0}>
                      <Heading size="sm">API Endpoints</Heading>
                    </CardHeader>
                    <CardBody>
                      <Stat>
                        <StatNumber>48</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          5 new endpoints added
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                  
                  <Card>
                    <CardHeader pb={0}>
                      <Heading size="sm">API Requests</Heading>
                    </CardHeader>
                    <CardBody>
                      <Stat>
                        <StatNumber>2.8M</StatNumber>
                        <StatHelpText>
                          Last 30 days
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                  
                  <Card>
                    <CardHeader pb={0}>
                      <Heading size="sm">Integration Services</Heading>
                    </CardHeader>
                    <CardBody>
                      <Stat>
                        <StatNumber>15</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          2 since last month
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                </SimpleGrid>
                
                <Heading size="sm" mb={3}>Connected Services</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Card>
                    <CardBody>
                      <Stack divider={<StackDivider />} spacing={2}>
                        <Flex justify="space-between" align="center">
                          <HStack>
                            <CheckCircleIcon color="green.500" />
                            <Text fontSize="sm">GoSellr E-commerce</Text>
                          </HStack>
                          <Badge colorScheme="green">Connected</Badge>
                        </Flex>
                        <Flex justify="space-between" align="center">
                          <HStack>
                            <CheckCircleIcon color="green.500" />
                            <Text fontSize="sm">EHB AI Dashboard</Text>
                          </HStack>
                          <Badge colorScheme="green">Connected</Badge>
                        </Flex>
                        <Flex justify="space-between" align="center">
                          <HStack>
                            <CheckCircleIcon color="green.500" />
                            <Text fontSize="sm">Smart AI Agent</Text>
                          </HStack>
                          <Badge colorScheme="green">Connected</Badge>
                        </Flex>
                      </Stack>
                    </CardBody>
                  </Card>
                  
                  <Card>
                    <CardBody>
                      <Stack divider={<StackDivider />} spacing={2}>
                        <Flex justify="space-between" align="center">
                          <HStack>
                            <CheckCircleIcon color="green.500" />
                            <Text fontSize="sm">EHB Admin Panel</Text>
                          </HStack>
                          <Badge colorScheme="green">Connected</Badge>
                        </Flex>
                        <Flex justify="space-between" align="center">
                          <HStack>
                            <CheckCircleIcon color="green.500" />
                            <Text fontSize="sm">SQL Database</Text>
                          </HStack>
                          <Badge colorScheme="green">Connected</Badge>
                        </Flex>
                        <Flex justify="space-between" align="center">
                          <HStack>
                            <WarningIcon color="orange.500" />
                            <Text fontSize="sm">Blockchain Node</Text>
                          </HStack>
                          <Badge colorScheme="orange">Syncing</Badge>
                        </Flex>
                      </Stack>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
    </Box>
  );
};

export default IntegratedDashboard;