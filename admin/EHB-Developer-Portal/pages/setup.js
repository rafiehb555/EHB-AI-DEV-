import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Progress,
  useToast,
  Image,
  Card,
  CardBody,
  Stack,
  Divider,
  SimpleGrid,
  Center,
  Icon
} from '@chakra-ui/react';
import { CheckCircleIcon, InfoIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';

const steps = [
  { 
    id: 'welcome', 
    title: 'Welcome to EHB', 
    description: 'The Enterprise Hybrid Blockchain system combines AI, microservices, and blockchain technologies into a powerful enterprise platform.'
  },
  { 
    id: 'services', 
    title: 'System Services', 
    description: 'EHB consists of multiple interconnected services that work together to provide a comprehensive solution.'
  },
  { 
    id: 'features', 
    title: 'Key Features', 
    description: 'Your EHB installation includes the following key features and capabilities.'
  },
  { 
    id: 'complete', 
    title: 'Setup Complete', 
    description: 'Your EHB system is now set up and ready to use.'
  }
];

export default function Setup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const router = useRouter();

  // Fetch modules data
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch('/api/modules');
        const data = await response.json();
        setModules(data.modules || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching modules:', error);
        toast({
          title: 'Error',
          description: 'Failed to load modules information',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      }
    };

    fetchModules();
  }, [toast]);

  const handleComplete = async () => {
    try {
      const response = await fetch('/api/complete-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Setup Complete',
          description: 'Your EHB system is now ready to use',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Redirect to main dashboard
        router.push('/');
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to complete setup',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error completing setup:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete setup',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Adjust the progress percentage based on the current step
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  // Group modules by type for display
  const modulesByType = modules.reduce((acc, module) => {
    const type = module.type || 'other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(module);
    return acc;
  }, {});

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="6xl" py={10}>
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading size="xl" mb={2}>EHB Developer Portal</Heading>
            <Text color="gray.600" fontSize="lg">Initial Setup Wizard</Text>
            
            <Progress
              value={progressPercentage}
              size="sm"
              colorScheme="blue"
              borderRadius="md"
              mt={4}
            />
          </Box>
          
          <Box bg="white" p={8} borderRadius="lg" boxShadow="md">
            <Heading size="lg" mb={4}>{steps[currentStep].title}</Heading>
            <Text fontSize="md" color="gray.600" mb={6}>
              {steps[currentStep].description}
            </Text>

            {/* Step Content */}
            <Box mt={6} mb={8}>
              {currentStep === 0 && (
                <Center>
                  <VStack spacing={6}>
                    <Icon as={InfoIcon} w={16} h={16} color="blue.500" />
                    <Text fontSize="lg" textAlign="center">
                      Welcome to the EHB Developer Portal. This setup wizard will guide you through
                      the initial installation.
                    </Text>
                    <Text fontSize="md" textAlign="center" color="gray.600">
                      The EHB system combines AI-powered services, blockchain integration,
                      and enterprise management tools to provide a comprehensive solution for businesses.
                    </Text>
                  </VStack>
                </Center>
              )}

              {currentStep === 1 && (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {Object.entries(modulesByType).map(([type, modules]) => (
                    <Card key={type}>
                      <CardBody>
                        <Heading size="md" textTransform="capitalize" mb={4}>{type} Modules</Heading>
                        <Stack divider={<Divider />} spacing={4}>
                          {modules.map((module) => (
                            <Box key={module.id}>
                              <HStack spacing={2}>
                                <CheckCircleIcon color="green.500" />
                                <Text fontWeight="bold">{module.name}</Text>
                              </HStack>
                              <Text fontSize="sm" color="gray.600" ml={6}>
                                {module.description}
                              </Text>
                            </Box>
                          ))}
                        </Stack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              )}

              {currentStep === 2 && (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Card>
                    <CardBody>
                      <Heading size="md" mb={4}>AI Integration</Heading>
                      <Text>Enhanced AI capabilities for data analysis, workflow automation, and predictive insights.</Text>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody>
                      <Heading size="md" mb={4}>Blockchain Security</Heading>
                      <Text>Secure transactions and data integrity using blockchain technology.</Text>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody>
                      <Heading size="md" mb={4}>Microservices Architecture</Heading>
                      <Text>Flexible, scalable services that can be deployed and updated independently.</Text>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody>
                      <Heading size="md" mb={4}>Enterprise Management</Heading>
                      <Text>Comprehensive tools for enterprise workflow management across the entire platform.</Text>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              )}

              {currentStep === 3 && (
                <Center>
                  <VStack spacing={6}>
                    <CheckCircleIcon w={16} h={16} color="green.500" />
                    <Heading size="md">Setup Complete</Heading>
                    <Text fontSize="lg" textAlign="center">
                      Your EHB system is now configured and ready to use. You will be redirected to the
                      Developer Portal dashboard.
                    </Text>
                  </VStack>
                </Center>
              )}
            </Box>

            <Flex justify="space-between" mt={8}>
              <Button 
                onClick={handlePrevious}
                visibility={currentStep > 0 ? 'visible' : 'hidden'}
                variant="outline"
              >
                Previous
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext} colorScheme="blue">
                  Next
                </Button>
              ) : (
                <Button onClick={handleComplete} colorScheme="green">
                  Complete Setup
                </Button>
              )}
            </Flex>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}