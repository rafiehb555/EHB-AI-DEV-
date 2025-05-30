import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Checkbox,
  CheckboxGroup,
  Stack,
  Button,
  Card,
  CardBody,
  SimpleGrid,
  Flex,
  Divider,
  useToast,
  Radio,
  RadioGroup
} from '@chakra-ui/react';
import { 
  DownloadIcon, 
  EmailIcon, 
  RepeatIcon 
} from '@chakra-ui/icons';

const ReportGenerator = () => {
  const toast = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportFormat, setReportFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState('30d');
  const [reportName, setReportName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  
  // Selected report sections
  const [selectedSections, setSelectedSections] = useState([
    'overview',
    'system_performance',
    'user_stats',
    'api_usage'
  ]);
  
  const handleGenerateReport = () => {
    // Validate
    if (!reportName.trim()) {
      toast({
        title: 'Report name is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Generate report
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: 'Report Generated',
        description: `${reportName} has been generated successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }, 2500);
  };
  
  const handleDownloadReport = () => {
    toast({
      title: 'Report Downloaded',
      description: `${reportName}.${reportFormat} has been downloaded.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  const handleEmailReport = () => {
    if (!recipientEmail.trim() || !recipientEmail.includes('@')) {
      toast({
        title: 'Valid email is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    toast({
      title: 'Report Emailed',
      description: `${reportName} has been sent to ${recipientEmail}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  return (
    <Box>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        <Box>
          <Card shadow="md" bg="white">
            <CardBody>
              <Heading size="md" mb={4}>Report Configuration</Heading>
              
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Report Name</FormLabel>
                  <Input 
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    placeholder="EHB System Performance Report"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Date Range</FormLabel>
                  <Select 
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="6m">Last 6 Months</option>
                    <option value="1y">Last Year</option>
                    <option value="custom">Custom Range</option>
                  </Select>
                </FormControl>
                
                {dateRange === 'custom' && (
                  <Flex gap={4}>
                    <FormControl>
                      <FormLabel>Start Date</FormLabel>
                      <Input type="date" />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>End Date</FormLabel>
                      <Input type="date" />
                    </FormControl>
                  </Flex>
                )}
                
                <FormControl>
                  <FormLabel>Report Format</FormLabel>
                  <RadioGroup value={reportFormat} onChange={setReportFormat}>
                    <Stack direction="row" spacing={5}>
                      <Radio value="pdf">PDF</Radio>
                      <Radio value="xlsx">Excel</Radio>
                      <Radio value="csv">CSV</Radio>
                      <Radio value="json">JSON</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
                
                <Divider />
                
                <FormControl>
                  <FormLabel>Include Sections</FormLabel>
                  <CheckboxGroup 
                    colorScheme="blue"
                    value={selectedSections}
                    onChange={setSelectedSections}
                  >
                    <Stack spacing={2}>
                      <Checkbox value="overview">System Overview</Checkbox>
                      <Checkbox value="system_performance">Performance Metrics</Checkbox>
                      <Checkbox value="user_stats">User Statistics</Checkbox>
                      <Checkbox value="api_usage">API Usage</Checkbox>
                      <Checkbox value="ai_usage">AI Service Usage</Checkbox>
                      <Checkbox value="cost_analysis">Cost Analysis</Checkbox>
                      <Checkbox value="data_storage">Data Storage Statistics</Checkbox>
                      <Checkbox value="recommendations">System Recommendations</Checkbox>
                    </Stack>
                  </CheckboxGroup>
                </FormControl>
                
                <Divider />
                
                <Button
                  leftIcon={<RepeatIcon />}
                  colorScheme="blue"
                  isLoading={isGenerating}
                  loadingText="Generating..."
                  onClick={handleGenerateReport}
                >
                  Generate Report
                </Button>
              </Stack>
            </CardBody>
          </Card>
        </Box>
        
        <Box>
          <Card shadow="md" bg="white" mb={6}>
            <CardBody>
              <Heading size="md" mb={4}>Report Distribution</Heading>
              
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel>Email Report To</FormLabel>
                  <Input 
                    type="email" 
                    placeholder="recipient@example.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                  />
                </FormControl>
                
                <Button
                  leftIcon={<EmailIcon />}
                  colorScheme="blue"
                  variant="outline"
                  disabled={isGenerating || !reportName}
                  onClick={handleEmailReport}
                >
                  Email Report
                </Button>
                
                <Button
                  leftIcon={<DownloadIcon />}
                  colorScheme="blue"
                  variant="outline"
                  disabled={isGenerating || !reportName}
                  onClick={handleDownloadReport}
                >
                  Download Report
                </Button>
              </Stack>
            </CardBody>
          </Card>
          
          <Card shadow="md" bg="white">
            <CardBody>
              <Heading size="md" mb={4}>Scheduled Reports</Heading>
              <Text mb={4}>Configure automated reports that are generated and distributed on a regular schedule.</Text>
              
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel>Schedule Frequency</FormLabel>
                  <Select defaultValue="never">
                    <option value="never">Not Scheduled</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </Select>
                </FormControl>
                
                <Button
                  colorScheme="blue"
                  variant="outline"
                  disabled={isGenerating || !reportName}
                >
                  Save Schedule
                </Button>
              </Stack>
            </CardBody>
          </Card>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default ReportGenerator;