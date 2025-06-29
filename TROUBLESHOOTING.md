# Troubleshooting Guide

## Common Issues and Solutions

### 1. "Failed to get AI response" Error

**Possible Causes:**
- AWS credentials not configured
- Bedrock access not enabled
- Model not available in region
- Network connectivity issues

**Solutions:**

#### Check AWS Credentials
```bash
# Verify your AWS profile is configured
aws configure list --profile bedrockuser

# Test AWS access
aws sts get-caller-identity --profile bedrockuser
```

#### Enable Bedrock Model Access
1. Go to AWS Console → Amazon Bedrock
2. Navigate to "Model access" in the left sidebar
3. Click "Enable specific models"
4. Find "Claude 3.5 Haiku" and request access
5. Wait for approval (usually instant for Claude models)

#### Verify Model Availability
```bash
# Check available models in your region
aws bedrock list-foundation-models --region us-west-2 --profile bedrockuser
```

### 2. "Access Denied" Error

**Solution:**
Ensure your AWS user/role has the following permissions:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel",
                "bedrock:InvokeModelWithResponseStream"
            ],
            "Resource": [
                "arn:aws:bedrock:us-west-2::foundation-model/anthropic.claude-3-5-haiku-20241022-v1:0"
            ]
        }
    ]
}
```

### 3. "Region Configuration Issue"

**Solution:**
- Ensure Claude 3.5 Haiku is available in us-west-2
- Check if you need to use a different region
- Update the region in `aws-config.js` if needed

### 4. CORS Issues (if using deployed version)

**Solution:**
- Ensure proper CORS configuration in API Gateway
- Check browser console for CORS errors
- Verify the API endpoint is accessible

## Testing Steps

### 1. Test AWS CLI Access
```bash
# Set the profile
export AWS_PROFILE=bedrockuser

# Test basic AWS access
aws sts get-caller-identity

# Test Bedrock access
aws bedrock list-foundation-models --region us-west-2
```

### 2. Test Bedrock Model Directly
```bash
# Create a test request file
echo '{
    "anthropic_version": "bedrock-2023-05-31",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Hello"}]
}' > test-request.json

# Test the model
aws bedrock-runtime invoke-model \
    --model-id anthropic.claude-3-5-haiku-20241022-v1:0 \
    --body file://test-request.json \
    --cli-binary-format raw-in-base64-out \
    --region us-west-2 \
    --profile bedrockuser \
    response.json

# Check the response
cat response.json
```

### 3. Check Browser Console
1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for error messages when clicking Send
4. Check Network tab for failed requests

## Environment Setup

### Option 1: Using AWS Profile (Recommended)
```bash
# Set environment variable
export AWS_PROFILE=bedrockuser

# Start the app
npm start
```

### Option 2: Using Environment Variables
Create a `.env` file:
```
AWS_PROFILE=bedrockuser
REACT_APP_BEDROCK_REGION=us-west-2
REACT_APP_BEDROCK_MODEL_ID=anthropic.claude-3-5-haiku-20241022-v1:0
```

## Getting Help

If you're still having issues:

1. **Check AWS Console**: Go to Bedrock console and verify model access
2. **Check CloudWatch Logs**: Look for Lambda function logs if using backend
3. **Verify Permissions**: Ensure your AWS user has Bedrock permissions
4. **Test CLI**: Use AWS CLI to test Bedrock access directly
5. **Check Region**: Ensure you're using the correct AWS region

## Contact Information

For AWS-specific issues:
- AWS Support Console
- AWS Documentation: https://docs.aws.amazon.com/bedrock/
- AWS Forums: https://forums.aws.amazon.com/
