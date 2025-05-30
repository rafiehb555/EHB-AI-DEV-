import React from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Container
} from '@chakra-ui/react';
import NextLink from 'next/link';

function Error({ statusCode }) {
  return (
    <Container maxW="container.md" py={10}>
      <Flex direction="column" align="center" justify="center" textAlign="center">
        <Heading as="h1" size="4xl" mb={4} color="red.500">
          {statusCode || 'Error'}
        </Heading>
        <Text fontSize="xl" mb={6}>
          {statusCode
            ? `An error ${statusCode} occurred on the server`
            : 'An error occurred on the client'}
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

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;