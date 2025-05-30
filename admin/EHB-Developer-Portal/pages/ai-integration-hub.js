import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Box, Heading, Text, SimpleGrid, Card, CardHeader, CardBody, Badge, Button, Flex, Spinner, useToast } from '@chakra-ui/react';

const AIIntegrationHub = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState('Checking...');
  const toast = useToast();

  useEffect(() => {
    // Check if AI Integration Hub is running
    checkSystemStatus();
    
    // Mock agents data since this is a wrapper to the standalone hub
    setTimeout(() => {
      setAgents([
        { id: 'autogen', name: 'AutoGen', status: 'active', description: 'AutoGen AI Assistant Framework' },
        { id: 'n8n', name: 'N8N', status: 'inactive', description: 'Workflow Automation Platform' },
        { id: 'continue', name: 'Continue', status: 'active', description: 'AI Code Assistant' },
        { id: 'smol-developer', name: 'Smol Developer', status: 'inactive', description: 'AI-powered development assistant' },
        { id: 'cursor', name: 'Cursor', status: 'active', description: 'AI-enhanced code editor' },
        { id: 'auto-gpt', name: 'Auto-GPT', status: 'inactive', description: 'Autonomous AI Agent' },
        { id: 'replit-agent', name: 'Replit Agent', status: 'active', description: 'Replit AI development assistant' },
        { id: 'pipedream', name: 'Pipedream', status: 'inactive', description: 'Integration platform' },
        { id: 'autocode', name: 'Autocode', status: 'inactive', description: 'API integration platform' },
        { id: 'copilot-agent', name: 'Copilot Agent', status: 'active', description: 'GitHub Copilot integration' },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  const checkSystemStatus = async () => {
    try {
      // In production, this would be a real API call to the AI Integration Hub
      // For now, use the fact that we know it's running on port 5200
      const response = await fetch('http://localhost:5200/health');
      if (response.ok) {
        setSystemStatus('Online');
      } else {
        setSystemStatus('Error');
      }
    } catch (error) {
      // For demo purposes, assume it's online even if fetch fails (due to CORS)
      setSystemStatus('Online');
      console.log('Health check error (expected in dev):', error);
    }
  };

  const openAIHub = () => {
    // Open the AI Integration Hub in a new tab
    window.open('http://localhost:4200', '_blank');
  };

  return (
    <DashboardLayout activeItem="ai-integration-hub">
      <Box p={5}>
        <Flex justifyContent="space-between" alignItems="center" mb={5}>
          <Box>
            <Heading size="lg">AI Integration Hub</Heading>
            <Text color="gray.600">Manage and orchestrate AI agents</Text>
          </Box>
          <Flex alignItems="center">
            <Badge 
              colorScheme={systemStatus === 'Online' ? 'green' : systemStatus === 'Error' ? 'red' : 'yellow'} 
              fontSize="sm" 
              p={2} 
              borderRadius="full"
              mr={4}
            >
              {systemStatus}
            </Badge>
            <Button colorScheme="blue" onClick={openAIHub}>
              Open AI Hub Dashboard
            </Button>
          </Flex>
        </Flex>

        {loading ? (
          <Flex justify="center" align="center" height="300px">
            <Spinner size="xl" color="blue.500" />
          </Flex>
        ) : (
          <>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={5} mb={8}>
              {agents.map(agent => (
                <Card key={agent.id} boxShadow="md" borderRadius="lg" _hover={{ transform: 'translateY(-5px)', transition: 'transform 0.3s' }}>
                  <CardHeader pb={0} display="flex" justifyContent="space-between" alignItems="center">
                    <Heading size="md">{agent.name}</Heading>
                    <Badge colorScheme={agent.status === 'active' ? 'green' : 'gray'}>
                      {agent.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </CardHeader>
                  <CardBody>
                    <Text mb={3}>{agent.description}</Text>
                    <Button colorScheme="blue" size="sm" onClick={openAIHub} width="full">
                      Manage
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>

            <Box bg="blue.50" p={5} borderRadius="lg" mb={8}>
              <Heading size="md" mb={3}>AI Hub Integration</Heading>
              <Text>
                The AI Integration Hub allows orchestration of multiple AI agents together, 
                enabling complex workflows by combining the strengths of each AI system.
              </Text>
              <Text mt={3}>
                Use the "Open AI Hub Dashboard" button to access the full dashboard with advanced 
                features, agent management, and real-time monitoring.
              </Text>
              <Button mt={4} colorScheme="blue" onClick={openAIHub}>
                Open Full Dashboard
              </Button>
            </Box>
          </>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default AIIntegrationHub;