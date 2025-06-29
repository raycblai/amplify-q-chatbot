# 🤖 Amplify Q Chatbot

A production-ready React chatbot application powered by Amazon Bedrock's Claude 3.5 Haiku model, deployed on AWS with enterprise-grade security.

## 🌟 Features

- **AI-Powered Chat**: Integration with Amazon Bedrock Claude 3.5 Haiku
- **Modern React UI**: Clean, responsive chat interface
- **AWS Amplify Gen2**: Serverless backend architecture
- **Enterprise Security**: Private S3 + CloudFront with Origin Access Control
- **Production Ready**: Deployed with HTTPS, CORS, and proper error handling

## 🏗️ Architecture

```
Internet → CloudFront → Private S3 Bucket (React App)
Internet → API Gateway → Lambda → Amazon Bedrock (Claude 3.5 Haiku)
```

### AWS Services Used
- **Frontend**: S3 + CloudFront
- **Backend**: Lambda + API Gateway
- **AI**: Amazon Bedrock (Claude 3.5 Haiku)
- **Security**: IAM + Origin Access Control
- **Monitoring**: CloudWatch

## 🚀 Live Demo

- **Frontend**: https://dj47x93x5c19.cloudfront.net
- **API Endpoint**: https://mc54cs2ya8.execute-api.us-west-2.amazonaws.com/prod/bedrock-chat

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

1. **Deploy Backend**
```bash
cd amplify
npm run build
```

2. **Build Frontend**
```bash
npm run build
```

3. **Deploy to AWS**
- Lambda function with Bedrock permissions
- API Gateway with CORS
- S3 bucket (private)
- CloudFront distribution with OAC

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
curl -X POST https://your-api-gateway-url/prod/bedrock-chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'
```

### Test Frontend
```bash
curl -I https://your-cloudfront-url
```

## 🔒 Security Features

- **Private S3 Bucket**: No public access allowed
- **Origin Access Control**: CloudFront-only access to S3
- **HTTPS Enforced**: All traffic encrypted
- **CORS Configured**: Secure cross-origin requests
- **IAM Least Privilege**: Minimal required permissions

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
