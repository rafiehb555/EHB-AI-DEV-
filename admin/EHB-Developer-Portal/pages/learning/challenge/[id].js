import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Container,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { ChevronRightIcon, ArrowBackIcon } from '@chakra-ui/icons';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useSiteConfig } from '../../../context/SiteConfigContext';
import { useLearning } from '../../../context/LearningContext';
import InteractiveCodingChallenge from '../../../components/learning/InteractiveCodingChallenge';

// Sample challenge data (in a real application, this would come from an API or database)
const challengesData = {
  'api-authentication': {
    id: 'api-authentication',
    title: 'API Authentication',
    description: 'Learn how to implement secure authentication for your API endpoints in the EHB system.',
    type: 'coding',
    category: 'backend',
    difficulty: 'medium',
    estimatedTime: '25 min',
    xpReward: 100,
    tags: ['API', 'security', 'authentication', 'JWT'],
    pathId: 'api-integration',
    pathTitle: 'API Integration',
    instructions: 'Create a JWT authentication middleware for an Express API. The middleware should verify the token from the request headers and attach the user information to the request object.',
    starterCode: `// JWT Authentication Middleware
// Complete the verifyToken middleware function below

const jwt = require('jsonwebtoken');

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Middleware to authenticate JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function verifyToken(req, res, next) {
  // TODO: Get the token from the 'Authorization' header
  // The header will be in the format: "Bearer <token>"
  
  // TODO: Verify the token using jwt.verify()
  
  // TODO: If verification is successful, attach the decoded user to the request object
  
  // TODO: If verification fails, return a 401 Unauthorized response
  
}

// Example usage:
const app = require('express')();

// Protected route that requires authentication
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ 
    message: 'You have access to this protected resource',
    user: req.user 
  });
});

// Export the middleware for testing
module.exports = { verifyToken };`,
    testCases: [
      {
        input: '',
        expectedOutput: '',
        description: 'Middleware correctly extracts token from the Authorization header'
      },
      {
        input: '',
        expectedOutput: '',
        description: 'Middleware properly verifies valid tokens'
      },
      {
        input: '',
        expectedOutput: '',
        description: 'Middleware returns 401 for invalid tokens'
      }
    ]
  },
  'blockchain-transaction': {
    id: 'blockchain-transaction',
    title: 'Blockchain Transaction',
    description: 'Create and validate blockchain transactions in the EHB system.',
    type: 'coding',
    category: 'blockchain',
    difficulty: 'hard',
    estimatedTime: '40 min',
    xpReward: 150,
    tags: ['blockchain', 'transaction', 'wallet', 'crypto'],
    pathId: 'blockchain-basics',
    pathTitle: 'Blockchain Integration',
    instructions: 'Implement a function to create and sign a blockchain transaction. The transaction should include sender, recipient, amount, and timestamp, and should be signed with the sender\'s private key.',
    starterCode: `// Blockchain Transaction
// Implement the createTransaction and verifyTransaction functions

// For this exercise, we'll use a simplified cryptographic approach
const crypto = require('crypto');

class Transaction {
  constructor(sender, recipient, amount) {
    this.sender = sender;
    this.recipient = recipient;
    this.amount = amount;
    this.timestamp = Date.now();
    this.signature = null;
  }
  
  // Calculate transaction hash
  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(this.sender + this.recipient + this.amount + this.timestamp)
      .digest('hex');
  }
  
  // TODO: Implement the signTransaction method
  // This method should:
  // 1. Take a signing key (private key)
  // 2. Create a signature using the transaction hash
  // 3. Store the signature in this.signature
  signTransaction(signingKey) {
    // Your code here
  }
  
  // TODO: Implement the isValid method
  // This method should:
  // 1. Verify that the transaction has a signature
  // 2. Verify that the signature is valid for this transaction
  // 3. Return true if valid, false otherwise
  isValid() {
    // Your code here
  }
}

// Export for testing
module.exports = { Transaction };`,
    testCases: [
      {
        input: '',
        expectedOutput: '',
        description: 'Transaction correctly calculates hash'
      },
      {
        input: '',
        expectedOutput: '',
        description: 'Transaction can be signed with a private key'
      },
      {
        input: '',
        expectedOutput: '',
        description: 'Transaction validity can be verified'
      }
    ]
  },
  'responsive-dashboard': {
    id: 'responsive-dashboard',
    title: 'Responsive Dashboard',
    description: 'Build a responsive dashboard component using EHB UI components.',
    type: 'coding',
    category: 'frontend',
    difficulty: 'easy',
    estimatedTime: '20 min',
    xpReward: 75,
    tags: ['UI', 'frontend', 'responsive', 'design'],
    pathId: 'frontend-development',
    pathTitle: 'Frontend Development',
    instructions: 'Create a responsive dashboard layout component using React and CSS Grid. The dashboard should adjust its layout based on screen size, showing a different number of columns on desktop vs. mobile.',
    starterCode: `// Responsive Dashboard Component
// Implement a responsive dashboard layout

import React from 'react';

// Sample data for dashboard cards
const cards = [
  { id: 1, title: 'Total Users', value: '1,245', color: 'blue' },
  { id: 2, title: 'Revenue', value: '$34,567', color: 'green' },
  { id: 3, title: 'Pending Orders', value: '23', color: 'orange' },
  { id: 4, title: 'Support Tickets', value: '12', color: 'red' },
  { id: 5, title: 'Conversion Rate', value: '3.2%', color: 'purple' },
  { id: 6, title: 'Active Sessions', value: '43', color: 'teal' }
];

// TODO: Implement the DashboardCard component
function DashboardCard({ title, value, color }) {
  // Your code here
}

// TODO: Implement the ResponsiveDashboard component
function ResponsiveDashboard() {
  // Your code here
}

export default ResponsiveDashboard;`,
    testCases: [
      {
        input: '',
        expectedOutput: '',
        description: 'Dashboard displays all cards correctly'
      },
      {
        input: '',
        expectedOutput: '',
        description: 'Dashboard layout is responsive to different screen sizes'
      },
      {
        input: '',
        expectedOutput: '',
        description: 'Dashboard cards display title and value with proper styling'
      }
    ]
  }
};

/**
 * Challenge Detail Page
 * 
 * Displays the details of a single coding challenge and provides
 * an interactive code editor for completing the challenge.
 */
function ChallengeDetail() {
  const router = useRouter();
  const { id } = router.query;
  const siteConfig = useSiteConfig();
  const { getChallengeProgress, completedChallenges } = useLearning();
  const toast = useToast();
  
  const [challenge, setChallenge] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialCode, setInitialCode] = useState('');
  
  // UI Colors
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  // Load challenge data
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      
      // Simulating API call with a timeout
      setTimeout(() => {
        // Get challenge data
        const challengeData = challengesData[id];
        
        if (challengeData) {
          setChallenge(challengeData);
          
          // Check if there's saved progress
          const progress = getChallengeProgress(id);
          
          if (progress && progress.code) {
            setInitialCode(progress.code);
          } else {
            setInitialCode(challengeData.starterCode || '');
          }
        } else {
          toast({
            title: 'Challenge not found',
            description: 'The requested challenge does not exist.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          
          // Redirect after a short delay
          setTimeout(() => {
            router.push('/learning/challenges');
          }, 2000);
        }
        
        setIsLoading(false);
      }, 1000);
    }
  }, [id, getChallengeProgress, toast, router]);
  
  // Handle completion of challenge
  const handleChallengeComplete = () => {
    toast({
      title: 'Challenge Completed!',
      description: `You've successfully completed the "${challenge.title}" challenge.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    
    // Navigate back to challenges list after a delay
    setTimeout(() => {
      router.push('/learning/challenges');
    }, 3000);
  };
  
  if (isLoading) {
    return (
      <DashboardLayout activeItem="learning">
        <Head>
          <title>{`${siteConfig.title} | Loading Challenge...`}</title>
        </Head>
        
        <Container maxW="container.xl" p={8}>
          <Flex direction="column" align="center" justify="center" py={20}>
            <Spinner size="xl" mb={6} color="blue.500" />
            <Heading size="md">Loading Challenge...</Heading>
          </Flex>
        </Container>
      </DashboardLayout>
    );
  }
  
  if (!challenge) {
    return (
      <DashboardLayout activeItem="learning">
        <Head>
          <title>{`${siteConfig.title} | Challenge Not Found`}</title>
        </Head>
        
        <Container maxW="container.xl" p={8}>
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            Challenge not found. Redirecting...
          </Alert>
        </Container>
      </DashboardLayout>
    );
  }
  
  const isCompleted = completedChallenges?.includes(challenge.id);
  
  return (
    <DashboardLayout activeItem="learning">
      <Head>
        <title>{`${siteConfig.title} | ${challenge.title}`}</title>
      </Head>
      
      <Box bg={bgColor} minH="calc(100vh - 80px)">
        <Container maxW="container.xl" p={{ base: 4, md: 8 }}>
          {/* Breadcrumb navigation */}
          <Breadcrumb 
            separator={<ChevronRightIcon color="gray.500" />} 
            mb={6}
            fontSize="sm"
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="/learning">Learning</BreadcrumbLink>
            </BreadcrumbItem>
            
            <BreadcrumbItem>
              <BreadcrumbLink href="/learning/challenges">Challenges</BreadcrumbLink>
            </BreadcrumbItem>
            
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>{challenge.title}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          
          {/* Back button */}
          <Button
            leftIcon={<ArrowBackIcon />}
            variant="ghost"
            mb={6}
            onClick={() => router.push('/learning/challenges')}
          >
            Back to Challenges
          </Button>
          
          {isCompleted && (
            <Alert status="success" mb={6} borderRadius="md">
              <AlertIcon />
              You have already completed this challenge!
            </Alert>
          )}
          
          {/* Interactive challenge component */}
          <InteractiveCodingChallenge
            challenge={challenge}
            initialCode={initialCode}
            onComplete={handleChallengeComplete}
          />
        </Container>
      </Box>
    </DashboardLayout>
  );
}

export default ChallengeDetail;