/**
 * AgentDetailsModal Component
 * 
 * This component displays detailed information about a selected agent in a modal.
 * It shows status history, connection information, and capabilities.
 */

import React from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalFooter, ModalBody, ModalCloseButton,
  Tabs, TabList, TabPanels, Tab, TabPanel,
  Box, Heading, Text, Table, Tbody, Tr, Td, Th, Thead,
  Badge, Button, Code, HStack, VStack,
  useColorModeValue, Accordion, AccordionItem,
  AccordionButton, AccordionPanel, AccordionIcon
} from '@chakra-ui/react';

const AgentDetailsModal = ({ agent, isOpen, onClose }) => {
  if (!agent) return null;

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Status color mapping
  const STATUS_COLORS = {
    active: 'green',
    inactive: 'gray',
    error: 'red',
    pending: 'yellow',
    restarting: 'blue'
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    const color = STATUS_COLORS[status] || 'gray';
    
    return (
      <Badge colorScheme={color} px={2} py={1} borderRadius="md">
        {status}
      </Badge>
    );
  };

  const codeBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Agent Details: {agent.info?.name || agent.id}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs>
            <TabList>
              <Tab>Overview</Tab>
              <Tab>Status History</Tab>
              <Tab>Capabilities</Tab>
              <Tab>Connection</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Box mb={4}>
                  <Heading size="sm" mb={2}>Basic Information</Heading>
                  <Table size="sm" variant="simple">
                    <Tbody>
                      <Tr>
                        <Td fontWeight="bold">ID</Td>
                        <Td>{agent.id}</Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight="bold">Name</Td>
                        <Td>{agent.info?.name || 'Unnamed Agent'}</Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight="bold">Type</Td>
                        <Td>{agent.info?.type || 'Unknown'}</Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight="bold">Current Status</Td>
                        <Td>{renderStatusBadge(agent.status)}</Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight="bold">Registered Date</Td>
                        <Td>{formatTime(agent.registered)}</Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight="bold">Last Update</Td>
                        <Td>{formatTime(agent.lastUpdate)}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>

                {agent.info?.description && (
                  <Box mb={4}>
                    <Heading size="sm" mb={2}>Description</Heading>
                    <Text>{agent.info.description}</Text>
                  </Box>
                )}

                {agent.info?.version && (
                  <Box mb={4}>
                    <Heading size="sm" mb={2}>Version Information</Heading>
                    <HStack spacing={4}>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold">Version</Text>
                        <Text>{agent.info.version}</Text>
                      </VStack>
                      {agent.info?.releaseDate && (
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="bold">Release Date</Text>
                          <Text>{formatTime(agent.info.releaseDate)}</Text>
                        </VStack>
                      )}
                    </HStack>
                  </Box>
                )}
              </TabPanel>

              <TabPanel>
                <Box overflowY="auto" maxH="400px">
                  <Heading size="sm" mb={2}>Status History</Heading>
                  {(agent.statusHistory && agent.statusHistory.length > 0) ? (
                    <Table size="sm" variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Status</Th>
                          <Th>Timestamp</Th>
                          <Th>Details</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {(agent.statusHistory || []).map((item, index) => (
                          <Tr key={index}>
                            <Td>{renderStatusBadge(item.status)}</Td>
                            <Td>{formatTime(item.timestamp)}</Td>
                            <Td>
                              {item.details ? (
                                <Accordion allowToggle>
                                  <AccordionItem border="none">
                                    <AccordionButton py={1} px={2}>
                                      <Box flex="1" textAlign="left" fontSize="sm">
                                        View Details
                                      </Box>
                                      <AccordionIcon />
                                    </AccordionButton>
                                    <AccordionPanel pb={4}>
                                      <Code p={2} borderRadius="md" variant="subtle" bg={codeBg} fontSize="xs" display="block">
                                        {JSON.stringify(item.details, null, 2)}
                                      </Code>
                                    </AccordionPanel>
                                  </AccordionItem>
                                </Accordion>
                              ) : 'No details'}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  ) : (
                    <Text color="gray.500">No status history available</Text>
                  )}
                </Box>
              </TabPanel>

              <TabPanel>
                <Box mb={4}>
                  <Heading size="sm" mb={2}>Agent Capabilities</Heading>
                  {agent.info?.capabilities ? (
                    <Box>
                      {agent.info.capabilities.map((capability, index) => (
                        <Box 
                          key={index} 
                          p={3} 
                          mb={2} 
                          borderWidth="1px" 
                          borderRadius="md"
                          borderColor="gray.200"
                        >
                          <Heading size="xs" mb={1}>{capability.name}</Heading>
                          <Text fontSize="sm" mb={2}>{capability.description}</Text>
                          
                          {capability.actions && capability.actions.length > 0 && (
                            <Box mt={2}>
                              <Text fontSize="xs" fontWeight="bold" mb={1}>Supported Actions:</Text>
                              <HStack flexWrap="wrap">
                                {capability.actions.map((action, actionIndex) => (
                                  <Badge key={actionIndex} mx={1} my={1}>
                                    {action}
                                  </Badge>
                                ))}
                              </HStack>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Text color="gray.500">No capability information available</Text>
                  )}
                </Box>
              </TabPanel>

              <TabPanel>
                <Box mb={4}>
                  <Heading size="sm" mb={2}>Connection Information</Heading>
                  {agent.connectionInfo ? (
                    <Table size="sm" variant="simple">
                      <Tbody>
                        <Tr>
                          <Td fontWeight="bold">URL</Td>
                          <Td>{agent.connectionInfo.url || 'Not Available'}</Td>
                        </Tr>
                        <Tr>
                          <Td fontWeight="bold">Port</Td>
                          <Td>{agent.connectionInfo.port || 'Not Available'}</Td>
                        </Tr>
                        <Tr>
                          <Td fontWeight="bold">Last Connected</Td>
                          <Td>{formatTime(agent.connectionInfo.lastConnected)}</Td>
                        </Tr>
                        <Tr>
                          <Td fontWeight="bold">Connection Status</Td>
                          <Td>
                            <Badge colorScheme={agent.connectionInfo.isConnected ? 'green' : 'red'}>
                              {agent.connectionInfo.isConnected ? 'Connected' : 'Disconnected'}
                            </Badge>
                          </Td>
                        </Tr>
                        {agent.connectionInfo.connectionHistory && (
                          <Tr>
                            <Td fontWeight="bold">Connection Count</Td>
                            <Td>{agent.connectionInfo.connectionHistory.length}</Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  ) : (
                    <Text color="gray.500">No connection information available</Text>
                  )}
                </Box>

                {agent.connectionInfo?.connectionHistory && agent.connectionInfo.connectionHistory.length > 0 && (
                  <Box mb={4}>
                    <Heading size="sm" mb={2}>Connection History</Heading>
                    <Table size="sm" variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Status</Th>
                          <Th>Timestamp</Th>
                          <Th>Duration</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {agent.connectionInfo.connectionHistory.map((conn, index) => (
                          <Tr key={index}>
                            <Td>
                              <Badge colorScheme={conn.status === 'connected' ? 'green' : 'red'}>
                                {conn.status}
                              </Badge>
                            </Td>
                            <Td>{formatTime(conn.timestamp)}</Td>
                            <Td>{conn.duration ? `${conn.duration}s` : '-'}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="outline">
            Send Command
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AgentDetailsModal;