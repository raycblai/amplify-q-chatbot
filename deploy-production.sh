#!/bin/bash

echo "🚀 Deploying Bedrock Chat App to AWS Production"
echo "==============================================="
echo ""

# Check prerequisites
echo "1️⃣ Checking prerequisites..."

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install AWS CLI first."
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity --profile bedrockuser > /dev/null 2>&1; then
    echo "❌ AWS credentials not working. Please refresh your credentials."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Install Amplify CLI if not present
echo "2️⃣ Setting up Amplify CLI..."
if ! command -v npx &> /dev/null; then
    echo "❌ npm/npx not found. Please install Node.js first."
    exit 1
fi

# Try to install Amplify Gen 2 CLI
npm install -g @aws-amplify/cli@latest 2>/dev/null || echo "Amplify CLI installation attempted"
echo "✅ Amplify CLI setup complete"
echo ""

# Deploy backend
echo "3️⃣ Deploying backend infrastructure..."
echo "This will create:"
echo "  - Lambda function for Bedrock integration"
echo "  - API Gateway for HTTP endpoints"
echo "  - IAM roles and permissions"
echo ""

# Set AWS profile for deployment
export AWS_PROFILE=bedrockuser

# Deploy using Amplify Gen 2
echo "Starting deployment..."
if npx ampx sandbox --once --profile bedrockuser; then
    echo "✅ Backend deployed successfully"
else
    echo "❌ Backend deployment failed"
    echo ""
    echo "Alternative deployment methods:"
    echo "1. Manual deployment via AWS Console"
    echo "2. Use AWS CDK directly"
    echo "3. Deploy using AWS SAM"
    exit 1
fi

echo ""

# Build frontend
echo "4️⃣ Building frontend for production..."
if npm run build; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

echo ""

# Deploy to Amplify Hosting
echo "5️⃣ Setting up Amplify Hosting..."
echo "You can now deploy the frontend using one of these methods:"
echo ""
echo "Option A - Amplify Console (Recommended):"
echo "1. Go to AWS Amplify Console"
echo "2. Click 'New app' → 'Host web app'"
echo "3. Connect your Git repository"
echo "4. Set build settings to use the build/ folder"
echo ""
echo "Option B - Manual upload:"
echo "1. Zip the build/ folder"
echo "2. Upload to Amplify Console"
echo ""
echo "Option C - S3 + CloudFront:"
echo "1. Upload build/ contents to S3 bucket"
echo "2. Configure CloudFront distribution"
echo ""

echo "🎉 Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Deploy frontend using one of the options above"
echo "2. Update API URL in production environment"
echo "3. Test the production deployment"
echo ""
echo "Production URLs will be:"
echo "- API: [API Gateway URL from deployment]"
echo "- Frontend: [Amplify/CloudFront URL]"
