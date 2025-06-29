# Deployment Instructions for Bedrock-Powered Chat App

## Prerequisites
1. AWS CLI configured with bedrockuser profile
2. Node.js 18+ installed
3. Amplify CLI installed: `npm install -g @aws-amplify/cli`

## Deployment Steps

### 1. Deploy the Backend
```bash
cd amplify-gen2-app
npx ampx sandbox --profile bedrockuser
```

### 2. Configure the Frontend
After deployment, copy the generated `amplify_outputs.json` to your src folder and uncomment the Amplify configuration in App.js:

```javascript
import outputs from './amplify_outputs.json';
Amplify.configure(outputs);
```

### 3. Test Locally
```bash
npm start
```

### 4. Deploy to Production
```bash
npx ampx deploy --branch main --profile bedrockuser
```

## AWS Resources Used

### Core Services:
- **Amazon Bedrock** - Claude 3.5 Haiku LLM
- **AWS Lambda** - Serverless function to call Bedrock
- **Amazon API Gateway** - HTTP API for frontend-backend communication
- **AWS Amplify** - Hosting and deployment
- **Amazon CloudFront** - CDN for global delivery
- **Amazon S3** - Static website hosting

### Supporting Services:
- **AWS IAM** - Permissions and roles
- **Amazon CloudWatch** - Logging and monitoring
- **AWS CloudFormation** - Infrastructure as code

## Estimated Monthly Costs

### Bedrock Usage:
- **Claude 3.5 Haiku**: $0.25 per 1M input tokens, $1.25 per 1M output tokens
- **Example**: 10,000 conversations/month ≈ $5-15/month

### Other Services:
- **Lambda**: $0.20 per 1M requests + compute time ≈ $1-3/month
- **API Gateway**: $3.50 per 1M requests ≈ $0.35/month for 100K requests
- **Amplify Hosting**: $1-5/month
- **CloudFront**: Pay-per-use, typically $1-3/month for small apps

**Total Estimated Cost**: $8-26/month for moderate usage

## Security Notes
- Function has minimal Bedrock permissions (only Claude 3.5 Haiku model)
- CORS configured for web access
- No user authentication (add Cognito for production use)
