import { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Grid, 
  Card, 
  CardBody, 
  CardHeader, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatHelpText, 
  SimpleGrid,
  Spinner,
  Center
} from '@chakra-ui/react';

export default function DeveloperPortal() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch modules only on initial mount
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch('/api/modules');
        const data = await response.json();
        
        if (data.success) {
          setModules(data.modules || []);
        } else {
          console.error('Failed to fetch modules:', data.error);
        }
      } catch (error) {
        console.error('Error fetching modules:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchModules();
  }, []); // Empty dependency array ensures this runs only once
  
  if (loading) {
    return (
      <Center h="300px"></Center><Spinner size="xl" color="blue.500" /></Spinner>e.500" />
      </Center>
    );
  }<Box></Box> <Heading as="h1" size="xl" mb={6}></Heading>as="h1" size="xl" mb={6}>
        Developer Po<SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}></SimpleGrid>e: 1, md: 3 }} spacing={6} mb={10}>
        <Stat bg="blue.50"<StatLabel></StatLabel>erRadius="md" shadow="sm<StatNumber></StatNumber> <StatLabel>Total Modules</<StatHelpText></StatHelpText>       <StatNumber>{modules.length}</StatNumber>
        <Stat bg="green.50" p={4} borderRadius="md" shadow="sm"></Stat>    <StatLabel></StatLabel>        
        <S<StatNumber></StatNumber>n.50" p={4} borderRadius="md" shadow="sm">
          <StatLabel>Services</StatLabel>
        <StatHelpText></StatHelpText>
            {(modules || []).filter(m => m.type <Stat bg="purple.50" p={4} borderRadius="md" shadow="sm"></Stat><Sta<StatLabel></StatLabel>ctive services</StatH<StatNumber></StatNumber>     </Stat>
        
        <Stat bg="purple.50" p={4} borderRadius="md" shadow="sm">
     <StatHelpText></StatHelpText>l>Components</StatLabel>
          <StatNumber>
     (modules || []).filte<Heading as="h2" size="lg" mb={4}></Heading>').length}
          </StatNumber>
          <StatHelpText>UI and system componen<Text color="gray.600"></Text>   </Stat>
      </SimpleGrid>
      
      <H<Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap=(modules || []).map(   {modules.map((module) =></Grid>"gray.60<Card key={module.name}></Card>yet.</Te<CardHeader bg="gray.50" pb={2}></CardHeader>mpla<Heading size="md"></Heading>"1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap<CardBody></CardBody>|| [])<Text color="gray.600" mb={2}></Text>=> (
            <<Text as="span" fontWeight="bold"></Text>    <CardHeader bg="gray.50" pb={2}>
                <<Text color="gray.600"></Text>le.name}</Heading>
              </CardHeader>
              <CardBody>
                <Text color="gray.600" mb={2}>
                  Type: <Text as="span" fontWeight="bold">{module.type}</Text>
                </Text>
                <Text color="gray.600">
                  Path: {module.path}
                </Text>
              </CardBody>
            </Card>
          ))}
        </Grid>
      )}
    </Box>
  );
}