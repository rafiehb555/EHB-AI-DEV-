import React from 'react';
import {
  Box, 
  Flex, 
  Heading, 
  Button, 
  IconButton, 
  Avatar, 
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorMode,
  useColorModeValue,
  HStack,
  Text
} from '@chakra-ui/react';
import { 
  FiUser, 
  FiSettings, 
  FiLogOut, 
  FiMoon, 
  FiSun,
  FiBell
} from 'react-icons/fi';

export default function PortalHeader() {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box 
      as="header" 
      position="sticky" 
      top="0" 
      zIndex="10"
      bg={bgColor}
      borderBottom="1px solid" 
      borderColor={borderColor} 
      py={2}
      px={4}
      boxShadow="sm"
    >
      <Flex justify="space-between" align="center">
        <Flex align="center">
          <Heading size="md" mr={2}>Developer Portal</Heading>
          <Text fontSize="xs" color="gray.500">v1.0.0</Text>
        </Flex>
        
        <HStack spacing={2}>
          <IconButton
            aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
            variant="ghost"
            icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
            onClick={toggleColorMode}
          />
          
          <IconButton
            aria-label="Notifications"
            variant="ghost"
            icon={<FiBell />}
          />
          
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              rightIcon={<FiUser />}
            >
              Admin
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiUser />}>Profile</MenuItem>
              <MenuItem icon={<FiSettings />}>Settings</MenuItem>
              <MenuDivider />
              <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
}