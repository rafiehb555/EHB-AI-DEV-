import React from 'react';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import PortalHeader from './PortalHeader';
import PortalSidebar from './PortalSidebar';
import PortalFooter from './PortalFooter';

export default function PortalLayout({ children, config = {} }) {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  // Default values for layout
  const defaultLayout = {
    sidebarWidth: 80,
    headerHeight: 64
  };
  
  // Use layout from config if available, otherwise use defaults
  const layout = (config && config.layout) ? config.layout : defaultLayout;
  const sidebarWidth = layout.sidebarWidth || 80;
  const headerHeight = layout.headerHeight || 64;
  
  // Create a safe config object to pass to children
  const safeConfig = {
    layout: {
      sidebarWidth,
      headerHeight
    }
  };
  
  return (
    <Flex 
      direction="column" 
      minH="100vh"
      bg={bgColor}
    >
      <PortalHeader config={safeConfig} />
      
      <Flex flex="1">
        <PortalSidebar config={safeConfig} />
        <Box 
          flex="1" 
          maxW={{ base: "100%", md: `calc(100% - ${sidebarWidth}px)` }} 
          marginLeft={{ base: 0, md: `${sidebarWidth}px` }}
          transition="all 0.3s"
        >
          <Box as="main" flex="1">
            {children}
          </Box>
          
          <PortalFooter config={safeConfig} />
        </Box>
      </Flex>
    </Flex>
  );
}