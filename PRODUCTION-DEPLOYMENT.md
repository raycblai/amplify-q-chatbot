# 🚀 Production Deployment Guide

## Overview
Deploy your Bedrock Chat application to AWS for production use with scalability, security, and reliability.

## 🏗️ Production Architecture

```
Internet → CloudFront → S3 (React App) → API Gateway → Lambda → Amazon Bedrock
                                                                      ↓
                                                               Claude 3.5 Haiku
```

## 📋 Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** configured with `bedrockuser` profile
3. **Node.js** 18+ installed
4. **Bedrock Model Access** enabled for Claude 3.5 Haiku

## 🚀 Deployment Methods

### Method 1: Amplify Gen 2 (Recommended)

#### Step 1: Deploy Backend
```bash
cd amplify-gen2-app
./deploy-production.sh
```

Or manually:
```bash
export AWS_PROFILE=bedrockuser
npx ampx sandbox --once --profile bedrockuser
```

#### Step 2: Deploy Frontend
```bash
# Build for production
npm run build

# Deploy to Amplify Hosting
npx ampx deploy --branch main --profile bedrockuser
```

### Method 2: Manual AWS Services Setup

#### Backend (Lambda + API Gateway)

1. **Create Lambda Function:**
```bash
# Package the function
cd amplify/functions/bedrock-chat
zip -r bedrock-function.zip .

# Create Lambda function via AWS CLI
aws lambda create-function \
  --function-name bedrock-chat-prod \
  --runtime nodejs20.x \
  --role arn:aws:iam::YOUR-ACCOUNT:role/lambda-bedrock-role \
  --handler handler.handler \
  --zip-file fileb://bedrock-function.zip \
  --profile bedrockuser
```

2. **Create API Gateway:**
```bash
# Create REST API
aws apigateway create-rest-api \
  --name bedrock-chat-api \
  --profile bedrockuser
```

3. **Set up IAM Role:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": [
        "arn:aws:bedrock:us-west-2::foundation-model/anthropic.claude-3-5-haiku-20241022-v1:0"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

#### Frontend (S3 + CloudFront)

1. **Create S3 Bucket:**
```bash
aws s3 mb s3://bedrock-chat-frontend-prod --profile bedrockuser
```

2. **Upload Build Files:**
```bash
npm run build
aws s3 sync build/ s3://bedrock-chat-frontend-prod --profile bedrockuser
```

3. **Create CloudFront Distribution:**
```bash
# Use AWS Console or CLI to create CloudFront distribution
# pointing to your S3 bucket
```

### Method 3: Container Deployment (ECS/Fargate)

#### Create Dockerfile
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Deploy to ECS
```bash
# Build and push to ECR
aws ecr create-repository --repository-name bedrock-chat --profile bedrockuser
docker build -t bedrock-chat .
docker tag bedrock-chat:latest YOUR-ACCOUNT.dkr.ecr.us-west-2.amazonaws.com/bedrock-chat:latest
docker push YOUR-ACCOUNT.dkr.ecr.us-west-2.amazonaws.com/bedrock-chat:latest

# Create ECS service
aws ecs create-service --cluster default --service-name bedrock-chat --task-definition bedrock-chat-task --desired-count 2 --profile bedrockuser
```

## 🔧 Configuration

### Environment Variables
Create `.env.production`:
```bash
REACT_APP_API_URL=https://your-api-gateway-url.amazonaws.com/prod
REACT_APP_BEDROCK_REGION=us-west-2
REACT_APP_BEDROCK_MODEL_ID=anthropic.claude-3-5-haiku-20241022-v1:0
```

### Build Configuration
Update `package.json`:
```json
{
  "scripts": {
    "build:prod": "REACT_APP_ENV=production npm run build",
    "deploy": "./deploy-production.sh"
  }
}
```

## 🔒 Security Considerations

### 1. API Security
- Enable API Gateway authentication
- Use AWS WAF for DDoS protection
- Implement rate limiting

### 2. CORS Configuration
```javascript
cors: {
  allowOrigin: ['https://your-domain.com'],
  allowHeaders: ['content-type', 'authorization'],
  allowMethods: ['POST', 'OPTIONS']
}
```

### 3. IAM Permissions
- Use least privilege principle
- Separate roles for different environments
- Enable CloudTrail for auditing

## 📊 Monitoring & Logging

### CloudWatch Setup
```bash
# Create log groups
aws logs create-log-group --log-group-name /aws/lambda/bedrock-chat-prod --profile bedrockuser
aws logs create-log-group --log-group-name /aws/apigateway/bedrock-chat-api --profile bedrockuser
```

### Metrics to Monitor
- Lambda invocation count and duration
- API Gateway request count and latency
- Bedrock token usage and costs
- CloudFront cache hit ratio

## 💰 Cost Optimization

### 1. Lambda Optimization
- Right-size memory allocation
- Use provisioned concurrency for consistent performance
- Enable X-Ray tracing selectively

### 2. API Gateway
- Use caching for repeated requests
- Implement request/response compression

### 3. CloudFront
- Configure appropriate cache behaviors
- Use origin request policies

### 4. Bedrock Usage
- Implement response caching
- Use prompt optimization
- Monitor token usage

## 🧪 Testing Production Deployment

### 1. Health Checks
```bash
# Test API endpoint
curl -X POST https://your-api-url/bedrock-chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'

# Test frontend
curl -I https://your-frontend-url
```

### 2. Load Testing
```bash
# Install artillery
npm install -g artillery

# Create load test config
artillery quick --count 10 --num 5 https://your-api-url/bedrock-chat
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to AWS
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npx ampx deploy --branch main
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## 📈 Scaling Considerations

### Auto Scaling
- Lambda: Automatic scaling up to 1000 concurrent executions
- API Gateway: Handles up to 10,000 requests per second
- CloudFront: Global edge locations for low latency

### Performance Optimization
- Enable Lambda response streaming for large responses
- Use API Gateway caching
- Implement client-side caching

## 🆘 Troubleshooting

### Common Issues
1. **CORS Errors**: Check API Gateway CORS configuration
2. **Lambda Timeouts**: Increase timeout or optimize code
3. **Bedrock Access Denied**: Verify IAM permissions
4. **High Costs**: Monitor and optimize token usage

### Debugging Tools
- CloudWatch Logs for Lambda and API Gateway
- X-Ray for distributed tracing
- AWS Cost Explorer for cost analysis

## 📞 Support

For deployment issues:
1. Check CloudWatch logs
2. Verify IAM permissions
3. Test individual components
4. Review AWS service limits

## 🎯 Production Checklist

- [ ] Backend deployed and tested
- [ ] Frontend built and deployed
- [ ] Environment variables configured
- [ ] Security policies applied
- [ ] Monitoring enabled
- [ ] Cost alerts configured
- [ ] Load testing completed
- [ ] Documentation updated
