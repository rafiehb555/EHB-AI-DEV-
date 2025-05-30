import React, { useState } from 'react';
import {
  Box,
  Text,
  SimpleGrid,
  Button,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  Card,
  CardBody,
  Divider,
  useColorModeValue,
  Alert,
  AlertIcon,
  Badge
} from '@chakra-ui/react';

/**
 * Quiz component for learning challenges
 */
const ChallengeQuiz = ({ quiz, onAnswer, onSubmit, answers = [], isSubmitted = false }) => {
  const handleOptionSelect = (questionId, value) => {
    if (onAnswer) {
      onAnswer(questionId, value);
    }
  };
  
  // Calculate score if quiz is submitted
  const calculateScore = () => {
    if (!isSubmitted || !quiz || !quiz.questions) return null;
    
    const totalQuestions = quiz.questions.length;
    const correctAnswers = quiz.questions.filter(question => {
      const userAnswer = answers.find(a => a.questionId === question.id);
      return userAnswer && userAnswer.selectedOption === question.correctOption;
    }).length;
    
    return {
      correct: correctAnswers,
      total: totalQuestions,
      percentage: Math.round((correctAnswers / totalQuestions) * 100)
    };
  };
  
  const score = calculateScore();
  const cardBg = useColorModeValue('white', 'gray.700');
  
  return (
    <Box>
      {isSubmitted && score && (
        <Alert 
          status={score.percentage >= 70 ? "success" : "warning"} 
          mb={4} 
          borderRadius="md"
        >
          <AlertIcon />
          <Flex width="100%" justify="space-between" align="center">
            <Text>
              You scored {score.correct} out of {score.total} ({score.percentage}%)
            </Text>
            <Badge 
              colorScheme={score.percentage >= 70 ? "green" : "orange"}
              fontSize="sm"
              px={2}
              py={1}
            >
              {score.percentage >= 90 ? 'Excellent' : 
               score.percentage >= 70 ? 'Passed' : 'Try Again'}
            </Badge>
          </Flex>
        </Alert>
      )}
      
      {quiz && quiz.questions && quiz.questions.map((question, index) => {
        const userAnswer = answers.find(a => a.questionId === question.id);
        
        return (
          <Card key={question.id} mb={4} bg={cardBg} shadow="md">
            <CardBody>
              <Text fontWeight="bold" mb={3}>
                {index + 1}. {question.text}
              </Text>
              
              <RadioGroup 
                onChange={(value) => handleOptionSelect(question.id, value)} 
                value={userAnswer ? userAnswer.selectedOption : undefined}
                isDisabled={isSubmitted}
              >
                <Stack spacing={3}>
                  {question.options.map(option => {
                    const isSelected = userAnswer && userAnswer.selectedOption === option.id;
                    const isCorrect = isSubmitted && option.id === question.correctOption;
                    const isIncorrect = isSubmitted && isSelected && option.id !== question.correctOption;
                    
                    return (
                      <Flex 
                        key={option.id} 
                        p={2} 
                        borderWidth="1px" 
                        borderRadius="md"
                        borderColor={
                          isCorrect ? 'green.400' :
                          isIncorrect ? 'red.400' :
                          isSelected ? 'blue.400' : 'gray.200'
                        }
                        bg={
                          isCorrect ? 'green.50' :
                          isIncorrect ? 'red.50' :
                          isSelected ? 'blue.50' : 'transparent'
                        }
                      >
                        <Radio 
                          value={option.id} 
                          colorScheme={
                            isCorrect ? 'green' :
                            isIncorrect ? 'red' : 'blue'
                          }
                        >
                          {option.text}
                        </Radio>
                      </Flex>
                    );
                  })}
                </Stack>
              </RadioGroup>
            </CardBody>
          </Card>
        );
      })}
      
      {!isSubmitted && (
        <Button 
          mt={4} 
          colorScheme="blue"
          onClick={onSubmit}
          isDisabled={answers.length !== quiz?.questions?.length}
        >
          Submit Quiz
        </Button>
      )}
    </Box>
  );
};

export default ChallengeQuiz;