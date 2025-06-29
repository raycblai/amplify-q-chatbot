# 🤖 Amplify Q Chatbot

A production-ready React chatbot application powered by Amazon Bedrock's Claude 3.5 Haiku model, deployed on AWS with enterprise-grade security.

## 🌟 Features

- **AI-Powered Chat**: Integration with Amazon Bedrock Claude 3.5 Haiku
- **Modern React UI**: Clean, responsive chat interface
- **AWS Amplify Gen2**: Serverless backend architecture
- **Enterprise Security**: Private S3 + CloudFront with Origin Access Control
- **Production Ready**: Deployed with HTTPS, CORS, and proper error handling

## 🏗️ Production Architecture

```
Internet → CloudFront (dj47x93x5c19.cloudfront.net) → Private S3 Bucket (bedrock-chat-frontend-prod-2025)
Internet → API Gateway (mc54cs2ya8.execute-api.us-west-2.amazonaws.com) → Lambda (bedrock-chat-prod) → Amazon Bedrock (Claude 3.5 Haiku)
```

### AWS Services Deployed
- **Frontend**: S3 (Private) + CloudFront with Origin Access Control
- **Backend**: Lambda Function + API Gateway REST API
- **AI**: Amazon Bedrock (Claude 3.5 Haiku)
- **Security**: IAM Roles + Policies + Origin Access Control
- **Monitoring**: CloudWatch Logs

## 🚀 Live Demo

- **Frontend**: https://dj47x93x5c19.cloudfront.net
- **API Endpoint**: https://mc54cs2ya8.execute-api.us-west-2.amazonaws.com/prod/bedrock-chat

> **Status**: ✅ Production deployment active and tested

## 📋 Prerequisites

- AWS Account with Bedrock access
- Node.js 18+ 
- AWS CLI configured
- Amazon Bedrock Claude 3.5 Haiku model access enabled

## 🛠️ Local Development

### 1. Clone the Repository
```bash
git clone https://github.com/raycblai/amplify-q-chatbot.git
cd amplify-q-chatbot
```

### 2. Install Dependencies
```bash
npm install
cd amplify && npm install && cd ..
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env with your AWS configuration
```

### 4. Start Development Server
```bash
# Terminal 1: Start the proxy server
npm run server

# Terminal 2: Start React app
npm start
```

Visit `http://localhost:3000` to see the app.

## 🚀 Production Deployment

### Quick Deploy
```bash
chmod +x deploy-production.sh
./deploy-production.sh
```

### Manual Deployment Steps

The production deployment was completed using AWS CLI with the `bedrockuser` profile:

1. **Deploy Backend Infrastructure**
```bash
# Create IAM role and policies
aws iam create-role --role-name bedrock-chat-lambda-role --assume-role-policy-document file://trust-policy.json --profile bedrockuser

# Create Lambda function
aws lambda create-function --function-name bedrock-chat-prod --runtime nodejs20.x --role arn:aws:iam::280792572112:role/bedrock-chat-lambda-role --handler index.handler --zip-file fileb://bedrock-function.zip --profile bedrockuser

# Create API Gateway
aws apigateway create-rest-api --name bedrock-chat-api --profile bedrockuser
```

2. **Deploy Frontend**
```bash
# Build React app
npm run build

# Create S3 bucket (private)
aws s3 mb s3://bedrock-chat-frontend-prod-2025 --region us-west-2 --profile bedrockuser

# Upload to S3
aws s3 sync build/ s3://bedrock-chat-frontend-prod-2025 --profile bedrockuser

# Create CloudFront distribution with Origin Access Control
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json --profile bedrockuser
```

3. **Configure Security**
- S3 bucket configured with blocked public access
- CloudFront Origin Access Control for secure S3 access
- IAM roles with least privilege permissions

See [PRODUCTION-DEPLOYMENT-COMPLETE.md](./PRODUCTION-DEPLOYMENT-COMPLETE.md) for detailed deployment guide.

## 📁 Project Structure

```
amplify-q-chatbot/
├── public/                 # Static assets
├── src/                   # React source code
│   ├── App.js            # Main app component
│   ├── aws-config.js     # AWS configuration
│   └── config.js         # App configuration
├── amplify/              # AWS Amplify Gen2 backend
│   ├── backend.ts        # Backend definition
│   └── functions/        # Lambda functions
│       └── bedrock-chat/ # Bedrock integration
├── scripts/              # Deployment scripts
├── docs/                 # Documentation
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create `.env` file:
```bash
REACT_APP_API_URL=http://localhost:3001
REACT_APP_BEDROCK_REGION=us-west-2
REACT_APP_BEDROCK_MODEL_ID=anthropic.claude-3-5-haiku-20241022-v1:0
```

### Production Environment Variables

Production `.env.production`:
```bash
REACT_APP_API_URL=https://mc54cs2ya8.execute-api.us-west-2.amazonaws.com/prod
REACT_APP_BEDROCK_REGION=us-west-2
REACT_APP_BEDROCK_MODEL_ID=anthropic.claude-3-5-haiku-20241022-v1:0
```

### AWS Configuration

Ensure your AWS profile has permissions for:
- Amazon Bedrock (InvokeModel)
- Lambda (CreateFunction, UpdateFunctionCode)
- API Gateway (CreateRestApi, CreateDeployment)
- S3 (CreateBucket, PutObject)
- CloudFront (CreateDistribution)
- IAM (CreateRole, AttachRolePolicy)

## 🧪 Testing

### Test API Endpoint
```bash
curl -X POST https://mc54cs2ya8.execute-api.us-west-2.amazonaws.com/prod/bedrock-chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'
```

### Test Frontend
```bash
curl -I https://dj47x93x5c19.cloudfront.net
```

### Production Testing Results ✅

**API Test Response**:
```json
{
  "response": "I apologize, but I don't see any specific Bedrock API code or details in your message. Could you please provide:\n\n1. The specific API endpoint or method you want to test\n2. Any code you've already written\n3. The specific testing goals or scenarios you want to verify\n\nOnce you share those details, I'll be happy to help you test the Bedrock API effectively.",
  "model": "Claude 3.5 Haiku"
}
```

**Frontend Test Response**:
```
HTTP/2 200 
content-type: text/html
x-cache: Miss from cloudfront
via: 1.1 c7277fa2cc1c39f666ce10cae9afb6c0.cloudfront.net (CloudFront)
```

## 🔒 Security Features

- **Private S3 Bucket**: No public access allowed
- **Origin Access Control**: CloudFront-only access to S3
- **HTTPS Enforced**: All traffic encrypted
- **CORS Configured**: Secure cross-origin requests
- **IAM Least Privilege**: Minimal required permissions

## 📊 Production Resources

### Deployed AWS Resources

#### Lambda Function
- **Name**: `bedrock-chat-prod`
- **Runtime**: Node.js 20.x
- **Handler**: `index.handler`
- **Timeout**: 60 seconds
- **Memory**: 128 MB
- **Environment**: `BEDROCK_REGION=us-west-2`

#### API Gateway
- **API ID**: `mc54cs2ya8`
- **Name**: `bedrock-chat-api`
- **Stage**: `prod`
- **Endpoint**: `https://mc54cs2ya8.execute-api.us-west-2.amazonaws.com/prod/bedrock-chat`
- **Methods**: POST, OPTIONS (CORS enabled)

#### CloudFront Distribution
- **Distribution ID**: `EUVREE9I3UKUR`
- **Domain**: `dj47x93x5c19.cloudfront.net`
- **Origin**: Private S3 bucket via Origin Access Control
- **Status**: Deployed and active

#### S3 Bucket
- **Name**: `bedrock-chat-frontend-prod-2025`
- **Region**: `us-west-2`
- **Public Access**: Blocked (Enterprise Security Compliant)
- **Access**: CloudFront Origin Access Control only

#### IAM Resources
- **Lambda Role**: `bedrock-chat-lambda-role`
- **Bedrock Policy**: `bedrock-chat-policy`
- **Origin Access Control**: `bedrock-chat-oac`

## 📊 Cost Estimation

Monthly costs (estimated):
- Lambda: ~$0.20 (1M requests)
- API Gateway: ~$3.50 (1M requests)  
- CloudFront: ~$1.00 (10GB transfer)
- S3: ~$0.50 (storage + requests)
- Bedrock: Variable based on usage

**Total**: ~$5.20/month + Bedrock token usage

## 🐛 Troubleshooting

### Common Issues

1. **403 Forbidden on CloudFront**
   - Wait 15-20 minutes for distribution deployment
   - Check Origin Access Control configuration

2. **CORS Errors**
   - Verify API Gateway OPTIONS method
   - Check Lambda CORS headers

3. **Bedrock Access Denied**
   - Ensure model access is enabled in Bedrock console
   - Verify IAM permissions

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed solutions.

## 📚 Documentation

- [Production Deployment Guide](./PRODUCTION-DEPLOYMENT-COMPLETE.md)
- [Getting Started](./START-HERE.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Amazon Web Services for Bedrock and infrastructure services
- Anthropic for Claude 3.5 Haiku model
- React team for the amazing framework
- AWS Amplify team for the Gen2 platform

## 📞 Support

For issues and questions:
- Create an issue in this repository
- Check the troubleshooting guide
- Review AWS CloudWatch logs

---

Built with ❤️ using AWS Amplify Gen2 and Amazon Bedrock
