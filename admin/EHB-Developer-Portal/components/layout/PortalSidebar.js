import React from 'react';
import {
  Box, 
  VStack, 
  Icon, 
  Tooltip, 
  useColorModeValue,
  Link
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import {
  FiHome,
  FiPackage,
  FiServer,
  FiDatabase,
  FiMonitor,
  FiSettings,
  FiInfo
} from 'react-icons/fi';
import NextLink from 'next/link';

export default function PortalSidebar() {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const activeColor = useColorModeValue('blue.500', 'blue.300');
  const activeBgColor = useColorModeValue('blue.50', 'blue.900');
  
  // Navigation items
  const navItems = [
    { icon: FiHome, label: 'Dashboard', path: '/' },
    { icon: FiPackage, label: 'Modules', path: '/modules' },
    { icon: FiServer, label: 'Services', path: '/services' },
    { icon: FiDatabase, label: 'Database', path: '/database' },
    { icon: FiMonitor, label: 'Monitoring', path: '/monitoring' },
    { icon: FiSettings, label: 'Settings', path: '/settings' },
    { icon: FiInfo, label: 'About', path: '/about' }
  ];
  
  return (
    <Box 
      as="nav"
      position="fixed"
      h="100vh"
      top="0"
      left="0"
      zIndex="5"
      bg={bgColor}
      borderRight="1px solid"
      borderColor={borderColor}
      w="80px"
      pt="64px" // Height of header
      boxShadow="sm"
    >
      <VStack spacing={6} mt={6}>
        {(navItems || []).map(item => {
          const isActive = router.pathname === item.path;
          
          return (
            <Tooltip key={item.path} label={item.label} placement="right" hasArrow>
              <Link
                as={NextLink}
                href={item.path}
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="40px"
                h="40px"
                borderRadius="md"
                color={isActive ? activeColor : 'gray.500'}
                bg={isActive ? activeBgColor : 'transparent'}
                _hover={{
                  bg: isActive ? activeBgColor : useColorModeValue('gray.100', 'gray.700'),
                  color: isActive ? activeColor : useColorModeValue('gray.800', 'white')
                }}
                transition="all 0.2s"
              >
                <Icon as={item.icon} boxSize={5} />
              </Link>
            </Tooltip>
          );
        })}
      </VStack>
    </Box>
  );
}