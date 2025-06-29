import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';

// AWS Configuration
const AWS_REGION = process.env.REACT_APP_BEDROCK_REGION || 'us-west-2';

// Create Bedrock client with default credential chain
export const createBedrockClient = () => {
  return new BedrockRuntimeClient({
    region: AWS_REGION,
    // Uses default credential chain which includes:
    // 1. Environment variables
    // 2. AWS credentials file
    // 3. IAM roles (if running on EC2)
    // 4. AWS SSO
  });
};

export const BEDROCK_CONFIG = {
  modelId: process.env.REACT_APP_BEDROCK_MODEL_ID || 'anthropic.claude-3-5-haiku-20241022-v1:0',
  region: AWS_REGION,
  maxTokens: 1000,
  anthropicVersion: "bedrock-2023-05-31"
};
