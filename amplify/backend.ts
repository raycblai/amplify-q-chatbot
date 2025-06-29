import { defineBackend } from '@aws-amplify/backend';
import { defineFunction } from '@aws-amplify/backend';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

// Define the Bedrock function (replaces your local proxy server)
const bedrockFunction = defineFunction({
  name: 'bedrock-chat',
  entry: './functions/bedrock-chat/handler.ts',
  environment: {
    BEDROCK_REGION: 'us-west-2'
  }
});

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  bedrockFunction
});

// Grant Bedrock permissions to the function
backend.bedrockFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      'bedrock:InvokeModel',
      'bedrock:InvokeModelWithResponseStream'
    ],
    resources: [
      'arn:aws:bedrock:us-west-2::foundation-model/anthropic.claude-3-5-haiku-20241022-v1:0'
    ]
  })
);
