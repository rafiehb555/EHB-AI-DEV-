import React, { useState, useEffect } from 'react';
import { FiActivity, FiBox, FiChevronDown, FiCode, FiDatabase, FiList, FiSettings } from 'react-icons/fi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import ServiceSection from './ServiceSection';
import SystemHealthCard from './SystemHealthCard';

// Mock data - will be replaced with real data
const chartData = {
  labels: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10'],
  datasets: [
    {
      label: 'Completion',
      data: [100, 100, 95, 90, 85, 80, 75, 65, 50, 25],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
    },
  ],
};

const donutData = {
  labels: ['Completed', 'In Progress', 'Not Started'],
  datasets: [
    {
      data: [14, 44, 24],
      backgroundColor: ['#38B2AC', '#4299E1', '#CBD5E0'],
      borderWidth: 0,
    },
  ],
};

const MainDashboard = () => {
  const [phases, setPhases] = useState([]);
  const [stats, setStats] = useState({
    totalPhases: 0,
    completedPhases: 0,
    inProgressPhases: 0,
    notStartedPhases: 0,
    lastUpdated: new Date().toLocaleDateString(),
  });
  const [services, setServices] = useState([]);
  const [systems, setSystems] = useState([]);
  const [adminModules, setAdminModules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Card background color based on theme
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const statColor = useColorModeValue('blue.500', 'blue.300');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    // Fetch phases data
    const fetchPhases = async () => {
      try {
        const response = await fetch('/api/phases');
        const data = await response.json();
        setPhases(data);
        
        // Calculate statistics
        const completed = data.filter(phase => phase.status === 'completed').length;
        const inProgress = data.filter(phase => phase.status === 'in-progress').length;
        const notStarted = data.filter(phase => phase.status === 'not-started').length;
        
        setStats({
          totalPhases: data.length,
          completedPhases: completed,
          inProgressPhases: inProgress,
          notStartedPhases: notStarted,
          lastUpdated: new Date().toLocaleDateString(),
        });
      } catch (error) {
        console.error('Error fetching phases:', error);
        // Use mock data if API fails
        setPhases([]);
      }
    };

    // Fetch services, systems, and admin modules
    const fetchServiceData = async () => {
      try {
        const [servicesRes, systemsRes, adminRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/systems'),
          fetch('/api/admin-modules')
        ]);
        
        setServices(await servicesRes.json());
        setSystems(await systemsRes.json());
        setAdminModules(await adminRes.json());
      } catch (error) {
        console.error('Error fetching service data:', error);
        // Use mock data if API fails
        setServices([]);
        setSystems([]);
        setAdminModules([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPhases();
    fetchServiceData();
  }, []);

  return (
    <Box p={5}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="xl" fontWeight="bold">EHB Development Portal</Heading>
        
        <Flex>
          <Menu>
            <MenuButton as={Button} rightIcon={<FiChevronDown />} colorScheme="blue" mr={2}>
              Quick Access
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => window.open('/ehb-home', '_blank')}>EHB Home</MenuItem>
              <MenuItem onClick={() => window.open('/admin', '_blank')}>Admin Panel</MenuItem>
              <MenuItem onClick={() => window.open('/gosellr', '_blank')}>GoSellr</MenuItem>
              <MenuItem onClick={() => window.open('/playground', '_blank')}>AI Playground</MenuItem>
            </MenuList>
          </Menu>
          
          <Button colorScheme="teal">View All Services</Button>
        </Flex>
      </Flex>

      {/* Status Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
        <Card bg={cardBg} boxShadow="md" borderRadius="lg">
          <CardBody>
            <Stat>
              <StatLabel fontSize="md" fontWeight="medium">Total Phases</StatLabel>
              <StatNumber fontSize="3xl" fontWeight="bold" color={statColor}>{stats.totalPhases}</StatNumber>
              <StatHelpText>EHB-AI-Dev Phases</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} boxShadow="md" borderRadius="lg">
          <CardBody>
            <Stat>
              <StatLabel fontSize="md" fontWeight="medium">Completed</StatLabel>
              <StatNumber fontSize="3xl" fontWeight="bold" color="green.500">{stats.completedPhases}</StatNumber>
              <Progress value={(stats.completedPhases/stats.totalPhases*100)} colorScheme="green" size="sm" mt={2} />
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} boxShadow="md" borderRadius="lg">
          <CardBody>
            <Stat>
              <StatLabel fontSize="md" fontWeight="medium">In Progress</StatLabel>
              <StatNumber fontSize="3xl" fontWeight="bold" color="blue.500">{stats.inProgressPhases}</StatNumber>
              <Progress value={(stats.inProgressPhases/stats.totalPhases*100)} colorScheme="blue" size="sm" mt={2} />
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} boxShadow="md" borderRadius="lg">
          <CardBody>
            <Stat>
              <StatLabel fontSize="md" fontWeight="medium">Last Updated</StatLabel>
              <StatNumber fontSize="xl" fontWeight="bold">{stats.lastUpdated}</StatNumber>
              <StatHelpText>Today at {new Date().toLocaleTimeString()}</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Main Grid */}
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
        {/* Left Column */}
        <Box>
          <Tabs variant="enclosed" colorScheme="blue" mb={6}>
            <TabList>
              <Tab fontWeight="semibold">Development Phases</Tab>
              <Tab fontWeight="semibold">Services</Tab>
              <Tab fontWeight="semibold">Systems</Tab>
              <Tab fontWeight="semibold">Admin</Tab>
            </TabList>
            
            <TabPanels>
              {/* Development Phases Tab */}
              <TabPanel p={0} pt={4}>
                <Card bg={cardBg} boxShadow="md" borderRadius="lg" mb={6}>
                  <CardHeader pb={0}>
                    <Heading size="md">Phase Completion Progress</Heading>
                  </CardHeader>
                  <CardBody>
                    <Box h="300px">
                      <Line 
                        data={chartData} 
                        options={{
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 100,
                              ticks: {
                                callback: function(value) {
                                  return value + '%';
                                }
                              }
                            }
                          }
                        }} 
                      />
                    </Box>
                  </CardBody>
                </Card>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} bg={cardBg} boxShadow="sm" borderRadius="lg" overflow="hidden">
                      <CardHeader pb={2}>
                        <Flex justify="space-between" align="center">
                          <Heading size="sm">Phase {i + 1}</Heading>
                          <Badge colorScheme={i < 2 ? "green" : i < 4 ? "blue" : "gray"}>
                            {i < 2 ? "Completed" : i < 4 ? "In Progress" : "Not Started"}
                          </Badge>
                        </Flex>
                      </CardHeader>
                      <CardBody pt={0}>
                        <Text fontSize="sm" color="gray.500" mb={2}>
                          {i === 0 ? "AI Agent Initialization" : 
                           i === 1 ? "Code Suggestion Interface" : 
                           i === 2 ? "AI Coding Chat" : 
                           i === 3 ? "Voice Module Generator" : 
                           i === 4 ? "SQL Badge System" : 
                           "Referral Tree System"}
                        </Text>
                        <Progress 
                          value={i === 0 ? 100 : i === 1 ? 100 : i === 2 ? 85 : i === 3 ? 60 : i === 4 ? 30 : 0} 
                          colorScheme={i < 2 ? "green" : i < 4 ? "blue" : "gray"} 
                          size="sm" 
                        />
                        <Flex justify="space-between" mt={2}>
                          <Text fontSize="xs">Last updated: May {10 + i}, 2025</Text>
                          <Button size="xs" colorScheme="blue" variant="link">Details</Button>
                        </Flex>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </TabPanel>
              
              {/* Services Tab */}
              <TabPanel p={0} pt={4}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Card bg={cardBg} boxShadow="md" borderRadius="lg">
                    <CardHeader pb={0}>
                      <Flex align="center">
                        <Icon as={FiBox} mr={2} color="purple.500" />
                        <Heading size="md">GoSellr Service</Heading>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Text mb={2}>E-commerce and franchise management solution.</Text>
                      <Progress value={90} colorScheme="purple" size="sm" mb={2} />
                      <Flex justify="space-between">
                        <Badge colorScheme="green">Online</Badge>
                        <Button size="sm" colorScheme="purple" variant="outline" onClick={() => window.open('/gosellr', '_blank')}>
                          Open Dashboard
                        </Button>
                      </Flex>
                    </CardBody>
                  </Card>
                  
                  <Card bg={cardBg} boxShadow="md" borderRadius="lg">
                    <CardHeader pb={0}>
                      <Flex align="center">
                        <Icon as={FiCode} mr={2} color="blue.500" />
                        <Heading size="md">AI Playground</Heading>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Text mb={2}>Interactive AI code generation and testing environment.</Text>
                      <Progress value={85} colorScheme="blue" size="sm" mb={2} />
                      <Flex justify="space-between">
                        <Badge colorScheme="green">Online</Badge>
                        <Button size="sm" colorScheme="blue" variant="outline" onClick={() => window.open('/playground', '_blank')}>
                          Open Playground
                        </Button>
                      </Flex>
                    </CardBody>
                  </Card>
                  
                  <Card bg={cardBg} boxShadow="md" borderRadius="lg">
                    <CardHeader pb={0}>
                      <Flex align="center">
                        <Icon as={FiDatabase} mr={2} color="orange.500" />
                        <Heading size="md">JPS Service</Heading>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Text mb={2}>Job Providing Service for enterprise task management.</Text>
                      <Progress value={70} colorScheme="orange" size="sm" mb={2} />
                      <Flex justify="space-between">
                        <Badge colorScheme="green">Online</Badge>
                        <Button size="sm" colorScheme="orange" variant="outline">Open Dashboard</Button>
                      </Flex>
                    </CardBody>
                  </Card>
                  
                  <Card bg={cardBg} boxShadow="md" borderRadius="lg">
                    <CardHeader pb={0}>
                      <Flex align="center">
                        <Icon as={FiActivity} mr={2} color="red.500" />
                        <Heading size="md">EHB-AI-Dev Service</Heading>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Text mb={2}>AI-powered development automation platform.</Text>
                      <Progress value={65} colorScheme="red" size="sm" mb={2} />
                      <Flex justify="space-between">
                        <Badge colorScheme="green">Online</Badge>
                        <Button size="sm" colorScheme="red" variant="outline">Open Dashboard</Button>
                      </Flex>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </TabPanel>
              
              {/* Systems Tab */}
              <TabPanel p={0} pt={4}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Card bg={cardBg} boxShadow="md" borderRadius="lg">
                    <CardHeader pb={0}>
                      <Flex align="center">
                        <Icon as={FiSettings} mr={2} color="green.500" />
                        <Heading size="md">Blockchain System</Heading>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Text mb={2}>Core blockchain infrastructure for secure transactions.</Text>
                      <Progress value={95} colorScheme="green" size="sm" mb={2} />
                      <Flex justify="space-between">
                        <Badge colorScheme="green">Online</Badge>
                        <Button size="sm" colorScheme="green" variant="outline">View Status</Button>
                      </Flex>
                    </CardBody>
                  </Card>
                  
                  <Card bg={cardBg} boxShadow="md" borderRadius="lg">
                    <CardHeader pb={0}>
                      <Flex align="center">
                        <Icon as={FiDatabase} mr={2} color="blue.500" />
                        <Heading size="md">SQL Department System</Heading>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Text mb={2}>Database management and query optimization system.</Text>
                      <Progress value={85} colorScheme="blue" size="sm" mb={2} />
                      <Flex justify="space-between">
                        <Badge colorScheme="green">Online</Badge>
                        <Button size="sm" colorScheme="blue" variant="outline">View Status</Button>
                      </Flex>
                    </CardBody>
                  </Card>
                  
                  <Card bg={cardBg} boxShadow="md" borderRadius="lg">
                    <CardHeader pb={0}>
                      <Flex align="center">
                        <Icon as={FiList} mr={2} color="purple.500" />
                        <Heading size="md">Franchise System</Heading>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Text mb={2}>Multi-level franchise management and reporting system.</Text>
                      <Progress value={80} colorScheme="purple" size="sm" mb={2} />
                      <Flex justify="space-between">
                        <Badge colorScheme="green">Online</Badge>
                        <Button size="sm" colorScheme="purple" variant="outline">View Status</Button>
                      </Flex>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </TabPanel>
              
              {/* Admin Tab */}
              <TabPanel p={0} pt={4}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Card bg={cardBg} boxShadow="md" borderRadius="lg">
                    <CardHeader pb={0}>
                      <Flex align="center">
                        <Icon as={FiSettings} mr={2} color="red.500" />
                        <Heading size="md">Admin Panel</Heading>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Text mb={2}>Main administrative dashboard for EHB system management.</Text>
                      <Progress value={100} colorScheme="red" size="sm" mb={2} />
                      <Flex justify="space-between">
                        <Badge colorScheme="green">Online</Badge>
                        <Button size="sm" colorScheme="red" variant="outline" onClick={() => window.open('/admin', '_blank')}>
                          Open Admin
                        </Button>
                      </Flex>
                    </CardBody>
                  </Card>
                  
                  <Card bg={cardBg} boxShadow="md" borderRadius="lg">
                    <CardHeader pb={0}>
                      <Flex align="center">
                        <Icon as={FiActivity} mr={2} color="orange.500" />
                        <Heading size="md">Dashboard</Heading>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Text mb={2}>Data visualization and reporting dashboard.</Text>
                      <Progress value={90} colorScheme="orange" size="sm" mb={2} />
                      <Flex justify="space-between">
                        <Badge colorScheme="green">Online</Badge>
                        <Button size="sm" colorScheme="orange" variant="outline">Open Dashboard</Button>
                      </Flex>
                    </CardBody>
                  </Card>
                  
                  <Card bg={cardBg} boxShadow="md" borderRadius="lg">
                    <CardHeader pb={0}>
                      <Flex align="center">
                        <Icon as={FiDatabase} mr={2} color="teal.500" />
                        <Heading size="md">Wallet System</Heading>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Text mb={2}>Digital wallet and transaction management system.</Text>
                      <Progress value={85} colorScheme="teal" size="sm" mb={2} />
                      <Flex justify="space-between">
                        <Badge colorScheme="green">Online</Badge>
                        <Button size="sm" colorScheme="teal" variant="outline">Open Wallet</Button>
                      </Flex>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
        
        {/* Right Column */}
        <Box>
          {/* Overall Status Chart */}
          <Card bg={cardBg} boxShadow="md" borderRadius="lg" mb={6}>
            <CardHeader pb={0}>
              <Heading size="md">Overall Project Status</Heading>
            </CardHeader>
            <CardBody>
              <Box h="250px" display="flex" justifyContent="center">
                <Doughnut 
                  data={donutData} 
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      }
                    },
                    cutout: '70%'
                  }} 
                />
              </Box>
            </CardBody>
          </Card>
          
          {/* Active Teams Card */}
          <Card bg={cardBg} boxShadow="md" borderRadius="lg" mb={6}>
            <CardHeader pb={0}>
              <Heading size="md">Active Development Teams</Heading>
            </CardHeader>
            <CardBody>
              <Flex justify="space-between" align="center" mb={3}>
                <Text fontWeight="medium">EHB Core Team</Text>
                <AvatarGroup size="sm" max={3}>
                  <Avatar bg="red.500" />
                  <Avatar bg="blue.500" />
                  <Avatar bg="green.500" />
                  <Avatar bg="purple.500" />
                </AvatarGroup>
              </Flex>
              <Divider />
              
              <Flex justify="space-between" align="center" mb={3} mt={3}>
                <Text fontWeight="medium">GoSellr Team</Text>
                <AvatarGroup size="sm" max={3}>
                  <Avatar bg="orange.500" />
                  <Avatar bg="cyan.500" />
                  <Avatar bg="yellow.500" />
                </AvatarGroup>
              </Flex>
              <Divider />
              
              <Flex justify="space-between" align="center" mb={3} mt={3}>
                <Text fontWeight="medium">AI Development Team</Text>
                <AvatarGroup size="sm" max={3}>
                  <Avatar bg="teal.500" />
                  <Avatar bg="pink.500" />
                  <Avatar bg="blue.500" />
                </AvatarGroup>
              </Flex>
              <Divider />
              
              <Flex justify="space-between" align="center" mt={3}>
                <Text fontWeight="medium">Frontend Team</Text>
                <AvatarGroup size="sm" max={3}>
                  <Avatar bg="purple.500" />
                  <Avatar bg="green.500" />
                  <Avatar bg="red.500" />
                </AvatarGroup>
              </Flex>
            </CardBody>
          </Card>
          
          {/* Recent Activities Card */}
          <Card bg={cardBg} boxShadow="md" borderRadius="lg">
            <CardHeader pb={0}>
              <Heading size="md">Recent Activities</Heading>
            </CardHeader>
            <CardBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <React.Fragment key={i}>
                  <Flex align="center" mb={i === 4 ? 0 : 3}>
                    <Box
                      rounded="full"
                      bg={
                        i === 0 ? "green.500" : 
                        i === 1 ? "blue.500" : 
                        i === 2 ? "orange.500" : 
                        i === 3 ? "purple.500" : 
                        "teal.500"
                      }
                      w={2}
                      h={2}
                      mr={2}
                    />
                    <Box>
                      <Text fontSize="sm" fontWeight="medium">
                        {i === 0 ? "Phase 5: SQL Badge System started" : 
                         i === 1 ? "New team member added to GoSellr" : 
                         i === 2 ? "Dashboard UI updated" : 
                         i === 3 ? "API integration completed" : 
                         "New system documentation added"}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {i === 0 ? "10 minutes ago" : 
                         i === 1 ? "2 hours ago" : 
                         i === 2 ? "5 hours ago" : 
                         i === 3 ? "Yesterday" : 
                         "2 days ago"}
                      </Text>
                    </Box>
                  </Flex>
                  {i !== 4 && <Divider my={2} />}
                </React.Fragment>
              ))}
            </CardBody>
          </Card>
        </Box>
      </Grid>
    </Box>
  );
};

export default MainDashboard;