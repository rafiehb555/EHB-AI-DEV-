import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Button, Badge, Flex, Spinner, useToast } from '@chakra-ui/react';
import { RepeatIcon, CheckIcon, CloseIcon, LinkIcon } from '@chakra-ui/icons';

/**
 * GitHub Integration component
 * Displays the status of the GitHub integration and provides controls
 * for managing repositories and the auto-push functionality.
 */
const GitHubIntegration = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [integrationStatus, setIntegrationStatus] = useState({
    initialized: false,
    hasToken: false,
    isAuthenticated: false,
    isMonitoring: false,
    monitoredRepoCount: 0,
    repositories: []
  });
  const [actionInProgress, setActionInProgress] = useState(false);
  const toast = useToast();

  // Fetch GitHub integration status
  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/github/status');
      const data = await response.json();
      
      setIntegrationStatus({
        initialized: data.success,
        hasToken: data.hasToken,
        isAuthenticated: data.isAuthenticated,
        isMonitoring: data.isMonitoring,
        monitoredRepoCount: data.monitoredRepoCount,
        repositories: data.repositories || []
      });
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch GitHub integration status');
      console.error('Error fetching GitHub status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize GitHub integration
  const handleInitialize = async () => {
    try {
      setActionInProgress(true);
      const response = await fetch('/api/github/initialize');
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'GitHub integration initialized',
          description: 'The GitHub integration was successfully initialized.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Fetch updated status
        await fetchStatus();
      } else {
        toast({
          title: 'Initialization failed',
          description: data.message || 'Failed to initialize GitHub integration.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'Initialization failed',
        description: 'An error occurred while initializing the GitHub integration.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error initializing GitHub integration:', err);
    } finally {
      setActionInProgress(false);
    }
  };

  // Setup auto-push
  const handleSetupAutoPush = async () => {
    try {
      setActionInProgress(true);
      const response = await fetch('/api/github/auto-push/setup');
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Auto-push set up',
          description: 'GitHub auto-push was successfully set up.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Fetch updated status
        await fetchStatus();
      } else {
        toast({
          title: 'Auto-push setup failed',
          description: data.message || 'Failed to set up GitHub auto-push.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'Auto-push setup failed',
        description: 'An error occurred while setting up GitHub auto-push.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error setting up auto-push:', err);
    } finally {
      setActionInProgress(false);
    }
  };

  // Stop auto-push
  const handleStopAutoPush = async () => {
    try {
      setActionInProgress(true);
      const response = await fetch('/api/github/auto-push/stop');
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Auto-push stopped',
          description: 'GitHub auto-push was successfully stopped.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Fetch updated status
        await fetchStatus();
      } else {
        toast({
          title: 'Failed to stop auto-push',
          description: data.message || 'Failed to stop GitHub auto-push.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'Failed to stop auto-push',
        description: 'An error occurred while stopping GitHub auto-push.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error stopping auto-push:', err);
    } finally {
      setActionInProgress(false);
    }
  };

  // Fetch status on component mount
  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
      <Heading as="h2" size="md" mb={4}>GitHub Integration</Heading>
      
      {loading ? (
        <Flex justify="center" align="center" py={4}>
          <Spinner mr={3} />
          <Text>Loading GitHub integration status...</Text>
        </Flex>
      ) : error ? (
        <Flex direction="column" align="center" py={4}>
          <Text color="red.500" mb={2}>{error}</Text>
          <Button 
            size="sm" 
            leftIcon={<RepeatIcon />} 
            onClick={fetchStatus}
            isLoading={loading}
          >
            Retry
          </Button>
        </Flex>
      ) : (
        <>
          <Flex mb={4} align="center">
            <Text fontWeight="bold" mr={2}>Status:</Text>
            <Badge 
              colorScheme={integrationStatus.initialized ? "green" : "red"}
              px={2}
              py={1}
              borderRadius="md"
            >
              {integrationStatus.initialized ? "Connected" : "Disconnected"}
            </Badge>
          </Flex>
          
          <Flex mb={4} align="center">
            <Text fontWeight="bold" mr={2}>GitHub Token:</Text>
            <Badge 
              colorScheme={integrationStatus.hasToken ? "green" : "red"}
              px={2}
              py={1}
              borderRadius="md"
            >
              {integrationStatus.hasToken ? "Available" : "Not Available"}
            </Badge>
          </Flex>
          
          <Flex mb={4} align="center">
            <Text fontWeight="bold" mr={2}>Authentication:</Text>
            <Badge 
              colorScheme={integrationStatus.isAuthenticated ? "green" : "red"}
              px={2}
              py={1}
              borderRadius="md"
            >
              {integrationStatus.isAuthenticated ? "Authenticated" : "Not Authenticated"}
            </Badge>
          </Flex>
          
          <Flex mb={4} align="center">
            <Text fontWeight="bold" mr={2}>Auto-Push:</Text>
            <Badge 
              colorScheme={integrationStatus.isMonitoring ? "green" : "gray"}
              px={2}
              py={1}
              borderRadius="md"
            >
              {integrationStatus.isMonitoring ? "Enabled" : "Disabled"}
            </Badge>
            {integrationStatus.isMonitoring && (
              <Text ml={2} fontSize="sm">
                ({integrationStatus.monitoredRepoCount} repositories monitored)
              </Text>
            )}
          </Flex>
          
          <Box mt={6}>
            <Heading as="h3" size="sm" mb={4}>Actions</Heading>
            
            <Flex wrap="wrap" gap={3}>
              {!integrationStatus.initialized && (
                <Button
                  colorScheme="blue"
                  size="sm"
                  leftIcon={<LinkIcon />}
                  onClick={handleInitialize}
                  isLoading={actionInProgress}
                  loadingText="Initializing..."
                  mr={2}
                  mb={2}
                >
                  Initialize GitHub Integration
                </Button>
              )}
              
              {integrationStatus.initialized && !integrationStatus.isMonitoring && (
                <Button
                  colorScheme="green"
                  size="sm"
                  leftIcon={<CheckIcon />}
                  onClick={handleSetupAutoPush}
                  isLoading={actionInProgress}
                  loadingText="Setting up..."
                  mr={2}
                  mb={2}
                >
                  Enable Auto-Push
                </Button>
              )}
              
              {integrationStatus.isMonitoring && (
                <Button
                  colorScheme="red"
                  size="sm"
                  leftIcon={<CloseIcon />}
                  onClick={handleStopAutoPush}
                  isLoading={actionInProgress}
                  loadingText="Stopping..."
                  mr={2}
                  mb={2}
                >
                  Disable Auto-Push
                </Button>
              )}
              
              <Button
                size="sm"
                leftIcon={<RepeatIcon />}
                onClick={fetchStatus}
                isLoading={loading}
                mr={2}
                mb={2}
              >
                Refresh Status
              </Button>
            </Flex>
          </Box>
          
          {integrationStatus.repositories && integrationStatus.repositories.length > 0 && (
            <Box mt={6}>
              <Heading as="h3" size="sm" mb={4}>Repositories</Heading>
              
              {integrationStatus.repositories.map((repo) => (
                <Box 
                  key={repo.id} 
                  p={3} 
                  mb={3} 
                  borderWidth="1px" 
                  borderRadius="md"
                  bg="gray.50"
                >
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontWeight="bold">{repo.name}</Text>
                      <Text fontSize="sm" color="gray.600">{repo.url}</Text>
                      <Text fontSize="xs" mt={1}>Branch: {repo.branch}</Text>
                    </Box>
                    <Box>
                      <Badge 
                        colorScheme={repo.cloned ? "green" : "yellow"}
                        mr={2}
                      >
                        {repo.cloned ? "Cloned" : "Not Cloned"}
                      </Badge>
                      <Badge 
                        colorScheme={repo.autoSync ? "green" : "gray"}
                      >
                        {repo.autoSync ? "Auto-Sync" : "Manual Sync"}
                      </Badge>
                    </Box>
                  </Flex>
                </Box>
              ))}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default GitHubIntegration;