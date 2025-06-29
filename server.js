const express = require('express');
const cors = require('cors');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { fromIni } = require('@aws-sdk/credential-providers');

const app = express();
const port = 3001;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Create Bedrock client with AWS profile
const bedrockClient = new BedrockRuntimeClient({
  region: 'us-west-2',
  credentials: fromIni({ profile: 'bedrockuser' })
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bedrock proxy server is running' });
});

// Bedrock chat endpoint
app.post('/bedrock-chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Received message:', message);

    const requestBody = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: message
        }
      ]
    };

    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-3-5-haiku-20241022-v1:0',
      body: JSON.stringify(requestBody),
      contentType: 'application/json',
      accept: 'application/json'
    });

    console.log('Calling Bedrock...');
    const response = await bedrockClient.send(command);
    
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const aiResponse = responseBody.content[0].text;

    console.log('Bedrock response received');
    res.json({ 
      response: aiResponse,
      model: 'Claude 3.5 Haiku'
    });

  } catch (error) {
    console.error('Error calling Bedrock:', error);
    
    let errorMessage = 'Failed to get AI response';
    if (error.name === 'AccessDeniedException') {
      errorMessage = 'Access denied. Check AWS permissions.';
    } else if (error.name === 'ValidationException') {
      errorMessage = 'Invalid request format.';
    } else if (error.name === 'ThrottlingException') {
      errorMessage = 'Request throttled. Try again later.';
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Bedrock proxy server running on http://localhost:${port}`);
  console.log(`📋 Health check: http://localhost:${port}/health`);
  console.log(`💬 Chat endpoint: http://localhost:${port}/bedrock-chat`);
});
