import React from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Container,
  Image
} from '@chakra-ui/react';
import NextLink from 'next/link';

export default function Custom404() {
  return (
    <Container maxW="container.md" py={10}>
      <Flex direction="column" align="center" justify="center" textAlign="center">
        <Heading as="h1" size="4xl" mb={4} color="blue.500">
          404
        </Heading>
        <Text fontSize="xl" mb={6}>
          Page Not Found
        </Text>
        <Text color="gray.500" mb={8}>
          The page you are looking for doesn't exist or has been moved.
        </Text>
        <NextLink href="/dashboard" passHref>
          <Button colorScheme="blue" size="lg">
            Return to Dashboard
          </Button>
        </NextLink>
      </Flex>
    </Container>
  );
}