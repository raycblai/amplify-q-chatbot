#!/bin/bash

echo "🚀 Setting up Bedrock Chat Application"
echo "======================================"

# Set AWS Profile
export AWS_PROFILE=bedrockuser
echo "✅ AWS Profile set to: $AWS_PROFILE"

# Check AWS credentials
echo "🔍 Checking AWS credentials..."
if aws sts get-caller-identity --profile bedrockuser > /dev/null 2>&1; then
    echo "✅ AWS credentials are configured"
    aws sts get-caller-identity --profile bedrockuser
else
    echo "❌ AWS credentials not found for profile 'bedrockuser'"
    echo "Please configure your AWS credentials first:"
    echo "aws configure --profile bedrockuser"
    exit 1
fi

# Check Bedrock access
echo ""
echo "🔍 Checking Bedrock model access..."
if aws bedrock list-foundation-models --region us-west-2 --profile bedrockuser > /dev/null 2>&1; then
    echo "✅ Bedrock access confirmed"
    
    # Check if Claude 3.5 Haiku is available
    if aws bedrock list-foundation-models --region us-west-2 --profile bedrockuser | grep -q "claude-3-5-haiku"; then
        echo "✅ Claude 3.5 Haiku model is available"
    else
        echo "⚠️  Claude 3.5 Haiku model may not be available or access not granted"
        echo "Please check AWS Bedrock console for model access"
    fi
else
    echo "❌ Cannot access Bedrock. Please check permissions"
    echo "Required permissions:"
    echo "- bedrock:InvokeModel"
    echo "- bedrock:ListFoundationModels"
    exit 1
fi

# Create .env file
echo ""
echo "📝 Creating environment configuration..."
cat > .env << EOF
AWS_PROFILE=bedrockuser
REACT_APP_BEDROCK_REGION=us-west-2
REACT_APP_BEDROCK_MODEL_ID=anthropic.claude-3-5-haiku-20241022-v1:0
EOF
echo "✅ .env file created"

echo ""
echo "🎉 Setup complete! You can now run the application:"
echo "npm start"
echo ""
echo "If you encounter issues, check TROUBLESHOOTING.md"
