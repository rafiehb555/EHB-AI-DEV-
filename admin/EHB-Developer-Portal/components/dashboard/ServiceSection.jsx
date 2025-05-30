import React from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  HStack,
  Flex,
  Icon,
  Button,
  Progress,
  useColorModeValue,
  Link
} from '@chakra-ui/react';
import { ChevronRightIcon, ViewIcon, SettingsIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { FaServer, FaDatabase, FaRobot, FaCog, FaChartBar, FaHome } from 'react-icons/fa';

// Service Card Component
const ServiceCard = ({ service }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Status colors
  const statusColors = {
    active: 'green',
    inactive: 'red',
    maintenance: 'orange',
    deprecated: 'gray',
    beta: 'purple',
    development: 'blue'
  };
  
  // Icon mapping
  const iconMap = {
    DATABASE: FaDatabase,
    ADMIN: FaCog,
    AI: FaRobot,
    SERVICES: FaServer,
    DASHBOARD: FaChartBar,
    HOME: FaHome
  };
  
  const ServiceIcon = iconMap[service.tag] || FaServer;
  
  // Calculate the service progress percentage
  const progressValue = service.progress || 100;
  
  return (
    <Card borderColor={borderColor} bg={cardBg}>
      <CardBody>
        <Flex justify="space-between" mb={3}>
          <HStack>
            <Box
              bg={`${statusColors[service.status]}.100`}
              color={`${statusColors[service.status]}.500`}
              p={2}
              borderRadius="md"
            >
              <Icon as={ServiceIcon} boxSize={5} />
            </Box>
            <Text fontWeight="bold">{service.name}</Text>
          </HStack>
          <Badge colorScheme={statusColors[service.status]}>{service.status}</Badge>
        </Flex>
        
        <Text fontSize="sm" mb={3} noOfLines={2}>
          {service.description}
        </Text>
        
        {/* Progress bar */}
        {service.progress !== undefined && (
          <Box mb={3}>
            <Flex justify="space-between" mb={1}>
              <Text fontSize="xs" fontWeight="medium">Progress</Text>
              <Text fontSize="xs">{progressValue}%</Text>
            </Flex>
            <Progress
              value={progressValue}
              size="xs"
              colorScheme={
                progressValue === 100 ? 'green' :
                progressValue > 70 ? 'blue' :
                progressValue > 40 ? 'yellow' :
                'orange'
              }
              borderRadius="full"
            />
          </Box>
        )}
        
        <HStack mt={3} spacing={2}>
          {service.tag && (
            <Badge size="sm" colorScheme="blue" variant="subtle">
              {service.tag}
            </Badge>
          )}
          
          {service.version && (
            <Badge size="sm" colorScheme="gray" variant="subtle">
              v{service.version}
            </Badge>
          )}
        </HStack>
        
        <Flex justify="space-between" align="center" mt={3}>
          <Link
            as={NextLink}
            href={service.url || '#'}
            fontSize="sm"
            color="blue.500"
          >
            View Details
          </Link>
          
          <HStack>
            <Button size="xs" leftIcon={<ViewIcon />} variant="ghost">
              Open
            </Button>
            <Button size="xs" leftIcon={<SettingsIcon />} variant="ghost">
              Config
            </Button>
          </HStack>
        </Flex>
      </CardBody>
    </Card>
  );
};

// ServiceSection Component
const ServiceSection = ({
  title,
  description,
  services,
  viewAllLink,
  showViewAll = true
}) => {
  return (
    <Box mb={8}>
      <Flex justify="space-between" align="center" mb={4}>
        <Box>
          <Heading size="md" mb={1}>{title}</Heading>
          {description && (
            <Text fontSize="sm" color="gray.500">
              {description}
            </Text>
          )}
        </Box>
        
        {showViewAll && viewAllLink && (
          <Button
            as={NextLink}
            href={viewAllLink}
            size="sm"
            rightIcon={<ChevronRightIcon />}
            variant="ghost"
            colorScheme="blue"
          >
            View All
          </Button>
        )}
      </Flex>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {services && services.length > 0 ? (
          services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))
        ) : (
          <Text color="gray.500">No services available</Text>
        )}
      </SimpleGrid>
    </Box>
  );
};

export default ServiceSection;