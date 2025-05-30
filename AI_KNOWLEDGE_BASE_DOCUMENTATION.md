# EHB AI Knowledge Base Documentation

This document provides guidelines for AI developers working on the EHB system.

## AI Integration Architecture

The EHB system uses a centralized AI services approach through the EHB-AI-Marketplace module. This provides:

1. **Unified API**: All AI services are accessed through a standardized API
2. **Model Management**: Centralized management of AI models
3. **Shared Context**: User and system context is shared across AI features
4. **Consistent Responses**: Standardized formatting and style for AI responses
5. **Performance Monitoring**: Centralized tracking of AI performance metrics

## Supported AI Models

### OpenAI Models

- **GPT-4o**: Latest general-purpose model, used for most text-based tasks
- **GPT-4 Vision**: Used for image analysis and multimodal inputs
- **DALL-E 3**: Used for image generation
- **Whisper**: Used for speech-to-text transcription

### Anthropic Models

- **Claude 3.7 Sonnet**: Latest general-purpose model, used for extended context tasks
- **Claude 3.5 Opus**: Used for highest-quality, complex reasoning tasks
- **Claude 3 Haiku**: Used for quick, less complex responses

## AI Feature Implementation Guidelines

### Context Management

All AI features should maintain context in user interactions:

```javascript
// Example of maintaining conversation context
const conversationContext = [];

async function handleUserQuery(userId, query) {
  // Retrieve existing conversation for this user
  const userConversation = await getConversationContext(userId);
  
  // Add the new query
  userConversation.push({ role: 'user', content: query });
  
  // Generate AI response with full conversation context
  const aiResponse = await generateAIResponse(userConversation);
  
  // Add the AI response to the conversation
  userConversation.push({ role: 'assistant', content: aiResponse });
  
  // Save the updated conversation
  await saveConversationContext(userId, userConversation);
  
  return aiResponse;
}
```

### Prompt Engineering Standards

Follow these guidelines for consistent AI interactions:

1. **System Instructions**: Always include clear system instructions
2. **Few-Shot Examples**: Provide examples for complex tasks
3. **Structured Outputs**: Request specific output formats for parsing
4. **Context Limitation**: Be mindful of token limits in prompts
5. **Error Handling**: Include fallback mechanisms for AI failures

Example system instruction template:

```javascript
const systemInstructions = `
You are an AI assistant for the EHB system. Please follow these guidelines:
1. Provide concise, accurate information about ${context}
2. Maintain a helpful, professional tone
3. If you're unsure about something, acknowledge the limitations
4. Format your response according to these guidelines: ${formatGuidelines}
5. The user's role is: ${userRole}, adjust your response accordingly
`;
```

### Feedback Collection

All AI interactions should include feedback collection:

```javascript
// Example of collecting feedback on AI responses
async function collectAIFeedback(userId, queryId, feedbackRating, feedbackText) {
  await supabase
    .from('ai_feedback')
    .insert({
      user_id: userId,
      query_id: queryId,
      rating: feedbackRating,
      feedback_text: feedbackText,
      created_at: new Date()
    });
    
  // Use feedback to improve future responses
  await updateAIModel(feedbackRating, feedbackText);
}
```

### Response Formatting

AI responses should follow consistent formatting:

```javascript
// Example of formatting AI responses
function formatAIResponse(rawResponse, format = 'standard') {
  switch (format) {
    case 'json':
      // Parse and validate JSON
      try {
        return JSON.parse(rawResponse);
      } catch (error) {
        console.error('Invalid JSON response from AI', error);
        return { error: 'Failed to parse AI response' };
      }
      
    case 'markdown':
      // Return markdown with proper escaping
      return sanitizeMarkdown(rawResponse);
      
    case 'html':
      // Convert markdown to sanitized HTML
      return convertMarkdownToSafeHTML(rawResponse);
      
    case 'standard':
    default:
      // Basic text formatting
      return rawResponse.trim();
  }
}
```

## AI Module Integration

Each EHB module can integrate AI features through the AI Marketplace:

### GoSellr-Ecommerce

- Product description generation
- Customer service chatbot
- Personalized product recommendations
- Image-based product search

### JPS-Job-Providing-Service

- Resume analysis and scoring
- Job description improvement
- Candidate-job matching
- Interview question generation

### EHB-Franchise

- Performance prediction
- Territory analysis
- Business strategy recommendations
- Market trend analysis

### HPS-Education-Service

- Personalized learning paths
- Content summarization
- Question answering
- Knowledge assessment

## Best Practices

1. **Privacy First**: Never store sensitive user data in prompts
2. **Efficiency**: Optimize prompts to reduce token usage
3. **Fallbacks**: Always implement fallbacks for AI service failures
4. **Continuous Improvement**: Use feedback to improve prompts
5. **Transparency**: Be clear to users when they are interacting with AI
6. **Human Review**: Implement human review for critical AI outputs
7. **Bias Mitigation**: Regularly test and mitigate bias in AI responses

## Troubleshooting Common Issues

### Hallucination Management

When AI provides incorrect information:

1. Use tightly constrained prompts
2. Implement fact-checking against trusted data sources
3. Add disclaimers for generative content
4. Provide feedback mechanism for users to report inaccuracies

### Context Window Limitations

When dealing with large amounts of context:

1. Implement context summarization techniques
2. Prioritize recent/relevant information
3. Use chunking strategies for large documents
4. Consider specialized models for larger context windows

### Response Consistency

To maintain consistent AI behavior:

1. Use standardized system prompts across features
2. Implement prompt templates with standardized parameters
3. Store and version successful prompts
4. A/B test prompt changes before full deployment

## Roman Urdu Instructions

- AI integration EHB-AI-Marketplace k through kiya jata hai
- Har module apne requirements k mutabiq AI features implement kar sakta hai
- OpenAI aur Claude models support kiye jate hain
- AI responses ka format standardized hona chahiye
- User feedback har AI interaction k baad collect kiya jata hai
- Privacy aur security har AI implementation mein priority honi chahiye