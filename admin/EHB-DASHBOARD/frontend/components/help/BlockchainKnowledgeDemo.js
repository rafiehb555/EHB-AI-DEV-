import React, { useState } from 'react';
import { Box, Button, Card, CardBody, CardHeader, Divider, Flex, Heading, Select, Spinner, Text, Textarea, useToast } from '@chakra-ui/react';

/**
 * BlockchainKnowledgeDemo Component
 * 
 * Demonstrates the enhanced AI knowledge base with blockchain-specific information
 * by allowing users to ask questions and see the AI's responses using domain knowledge.
 */
const BlockchainKnowledgeDemo = () => {
  const [topic, setTopic] = useState('');
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [queryType, setQueryType] = useState('help'); // 'help' or 'question'
  const toast = useToast();

  // Topics related to blockchain and wallets
  const blockchainTopics = [
    { value: 'wallet_security', label: 'Wallet Security' },
    { value: 'crypto_wallet', label: 'Cryptocurrency Wallet' },
    { value: 'blockchain_basics', label: 'Blockchain Basics' },
    { value: 'smart_contracts', label: 'Smart Contracts' },
    { value: 'private_key_management', label: 'Private Key Management' },
    { value: 'multi_signature', label: 'Multi-Signature Wallets' },
    { value: 'token_standards', label: 'Token Standards (ERC20/BEP20)' },
    { value: 'trusty_wallet', label: 'Trusty Wallet with Validator Locking' },
    { value: 'address_validation', label: 'Blockchain Address Validation' },
    { value: 'gas_optimization', label: 'Gas Fee Optimization' }
  ];

  // Example questions for blockchain topics
  const exampleQuestions = [
    "How do I securely manage private keys in my wallet application?",
    "What's the difference between standard wallet and trusty wallet?",
    "How do I validate ERC20 token addresses?",
    "What security considerations should I have for multi-chain wallets?",
    "How do I implement validator locking in a trusty wallet?",
    "What are the best practices for smart contract security audits?",
    "How can I optimize gas fees for my users?",
    "What's the difference between hot and cold storage for crypto wallets?",
    "How should I handle seed phrase backup and recovery?",
    "What regulatory compliance issues should I consider for my wallet app?"
  ];

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleQueryTypeChange = (e) => {
    setQueryType(e.target.value);
  };

  const handleSetExampleQuestion = (exampleQuestion) => {
    setQuestion(exampleQuestion);
    setQueryType('question');
  };

  const handleSubmit = async () => {
    if ((queryType === 'help' && !topic) || (queryType === 'question' && !question)) {
      toast({
        title: queryType === 'help' ? 'Please select a topic' : 'Please enter a question',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    setResponse(null);

    try {
      const endpoint = queryType === 'help' 
        ? `/api/contextual-help/topics/${encodeURIComponent(topic)}` 
        : '/api/contextual-help/question';
      
      const body = queryType === 'question' ? { question } : undefined;
      
      const response = await fetch(endpoint, {
        method: queryType === 'help' ? 'GET' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        ...(body && { body: JSON.stringify(body) }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      setResponse(data);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      toast({
        title: 'Error',
        description: 'Failed to get AI response. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card shadow="md" mb={8}></Card><CardHeader bg="blue.700"></CardHeader>e.700">
        <Heading size="md" color="white"></Heading>Blockchain Knowledge AI Demo</Heading>
      <CardBody></CardBody><CardBody></CardBody><CardBody></CardBody>
        <Text mb={4}></Text>
          Explore the AI assistant's enhanced knowledge about blockchain and wallet technologies. 
          Choose a topic or ask a specific question to see how the AI provides contextual informa<Box mb={4}></Box>  </T<Select value={queryType} onChange={handleQueryTypeChange} mb={4}></Select>hange={handleQueryTypeChange} mb={4}>
            <option value="help">Get Help on a Topic</option>
            <option value="question">Ask a Specific Question</option>
          </Select>

  <Select 
              placeholder="Select a blockchain topic" 
              value={topic} 
              onChange={handleTopicChange}
            ></Select>    onChange={handleTopicChange}
            >
              {(blockchainTopics || []).map((topic) => (
                <option key={topic.value} value={topic.value}>
                  {topic.label}
                </option>
              ))}
            <Textarea
                placeholder="Enter your blockchain or wallet related question..."
                value={question}
                onChange={handleQuestionChange}
                rows={3}
                mb={2}
              /></Textarea>    <Text fontSize="sm" color="gray.600" mb={4}></Text> <Text fontSize="sm" color="gray.600" mb={4}<Flex wrap="wrap" gap={2} mb={4}></Text>wrap" gap={2} mb={4}></Flex>ns:
        <Flex wrap="wrap" gap={2} mb={4}></Flex> wrap="wrap" gap={2} mb={4}>
    <Button 
                    key={index} 
                    size="sm" 
                    colorScheme="blue" 
                    variant="outline"
                    onClick={() =></Button>"blue" 
                    variant="outline"
                    onClick={() => handleSetExampleQuestion(q)}
                  >
                    {q.length > 30 ? q.substring(0, 30) + '...' : q}
                  </B<Button 
            mt={4} 
            colorScheme="blue" 
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText="Getting AI Response"
          ></Button>          isLoading={isLoading}
            loadingText="Getting AI Response"
          >
            {queryType === 'he<Flex justify="center" mt={8} mb={8}></Flex>mb={8}></<Spinner size="x<Flex justify="center" mt={8} mb={8}></Flex>mt={8} mb={8}></Spinner>{8} mb={8}></Flex>lex justify="center" mt={8} mb={8}><Box mt={4} p={4} bg="gray.50" borderRadius="md"></Box>/>
          </Flex>
        )}

        {response && (
          <Heading size="md" mb={2}></Heading>.50" borderRadius="md">
         <Text <Heading size="md" mb={2}></Heading>ing size="md<Text mb={4}></Text>a<Heading size="md<Text mb={4}></Heading>size="md<Text mb={4}></Text>ponse.ti<Text mb={4}></Text></Text>>
                <Text mb={4}>{response<Box key={index} mb={4}></Box>             
 <Heading size="sm" mb={2}></Heading>ections && (response.sections<Box key={index} mb={4}></Box>/Text>ndex) => <Heading size="sm" mb={2}></Heading>ey={index} mb={4}>
                   <Text></Text>ing size="sm" mb={2}>{section.h<Text></Text></Text>}</Heading>
                    <Text>{section<Box mt={4}></Box>ext>
          <Heading size="sm" mb={2}></Heading>     ))<Heading size="sm" m<Box mt={4}></Heading>/Box>    {response.t<Heading size="sm" m<Box mt={4}></Box>ing>h > 0 && (<Heading size="sm" mb={2}></Heading>></Heading>{4}>
                    <Heading size="sm" mb={2}>Quick Tips</Heading>
                    <ul>
               (response.tips || (ips || []).map((ips || []).map((tip, index) => (
                        <li key={index}<Heading size="md" mb={2}></Heading>        ))}
             <Text mb={4}></Text>                  </Box>
                )}
         <Divider my={4} /></Divider>   ) : (
             <Text m<Te<Text<Divider <Box mt={4}></Text>ext>}></Heading> s<Text mb={4}></Text>2}>Quest<Text<Divider <Box mt={4}></Divider>         <Divid<Divider <Box mt={4<Text mb={4}></Divider>der>n}</Text>
                
                <Divider <Box mt={4<Text mb={4}></Text>    <Te<Text></Text>ext><Heading size="sm" mb={2}><Heading size<Box mt={4}></Heading>>Answer</Heading>
          <Text></Te<Box mt={4}></Box>{4}>{response.a<Heading size<B<Box mt={4}></Box>Box>></Heading><Heading size="sm" mb={2}></Heading>{2}></Heading>.additionalInfo && (
                  <Box mt={4}>
                    <Heading size="sm" mb={2}>Additiona<Box mt={4}></Box>n</Heading>
   <Heading size="sm" mb={2}></Heading>sponse.additionalInfo}</Text>
     <Flex wrap="wrap" gap={2}></Flex>          )}
                
    <Heading size="sm" mb={2}></Heading>tedTopi<Heading size="sm" mb={2}></Heading>{2}></Heading>lex wrap="wrap" gap={2}></Flex>"xs" colorScheme="blue" variant="outline"></Button><Heading size="sm" mb={2}>Related Topics</Heading>
  <Button key={index} size="xs" colorScheme="blue" varia<Bu<Button key={index} size="xs" colorScheme="blue" variant="outline"></Button>utton>(cs || []).map((topic, index) => (
                        <Button key={index} size="xs" colorScheme="blue" variant="outline">
                          {topic}
                        </Button>
                      ))}
                    </Flex>
                  </Box>
                )}
              </>
            )}
          </Box>
        )}
      </CardBody>
    </Card>
  );
};

export default BlockchainKnowledgeDemo;