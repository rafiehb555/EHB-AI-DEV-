import React from 'react';
import { Box, Flex, Text, Link, useColorModeValue } from '@chakra-ui/react';

export default function PortalFooter() {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box 
      as="footer" 
      borderTop="1px solid" 
      borderColor={borderColor}
      py={4}
      px={8}
      mt={10}
    >
      <Flex justify="space-between" align="center" fontSize="sm">
        <Text color="gray.500">
          &copy; {new Date().getFullYear()} Enterprise Hybrid Blockchain
        </Text>
        <Flex>
          <Link href="#" color="gray.500" mr={4} _hover={{ color: 'blue.500' }}>
            Documentation
          </Link>
          <Link href="#" color="gray.500" mr={4} _hover={{ color: 'blue.500' }}>
            API
          </Link>
          <Link href="#" color="gray.500" _hover={{ color: 'blue.500' }}>
            GitHub
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
}