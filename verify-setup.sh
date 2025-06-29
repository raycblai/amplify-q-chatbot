#!/bin/bash

echo "🔍 Verifying Bedrock Chat Application Setup"
echo "==========================================="
echo ""

# Check AWS credentials
echo "1️⃣ Checking AWS credentials..."
if aws sts get-caller-identity --profile bedrockuser > /dev/null 2>&1; then
    echo "✅ AWS credentials are valid"
    aws sts get-caller-identity --profile bedrockuser | grep -E "(UserId|Account|Arn)"
else
    echo "❌ AWS credentials failed"
    exit 1
fi

echo ""

# Check Bedrock access
echo "2️⃣ Checking Bedrock access..."
if aws bedrock list-foundation-models --region us-west-2 --profile bedrockuser > /dev/null 2>&1; then
    echo "✅ Bedrock access confirmed"
else
    echo "❌ Bedrock access failed"
    exit 1
fi

echo ""

# Check Claude 3.5 Haiku availability
echo "3️⃣ Checking Claude 3.5 Haiku model..."
if aws bedrock list-foundation-models --region us-west-2 --profile bedrockuser --query 'modelSummaries[?contains(modelId, `claude-3-5-haiku`)]' --output text | grep -q "claude-3-5-haiku"; then
    echo "✅ Claude 3.5 Haiku is available"
else
    echo "❌ Claude 3.5 Haiku not available"
    exit 1
fi

echo ""

# Test model invocation
echo "4️⃣ Testing model invocation..."
echo '{"anthropic_version": "bedrock-2023-05-31", "max_tokens": 10, "messages": [{"role": "user", "content": "Hi"}]}' > test.json
if aws bedrock-runtime invoke-model \
    --model-id anthropic.claude-3-5-haiku-20241022-v1:0 \
    --body file://test.json \
    --cli-binary-format raw-in-base64-out \
    --region us-west-2 \
    --profile bedrockuser \
    response.json > /dev/null 2>&1; then
    echo "✅ Model invocation successful"
    rm -f test.json response.json
else
    echo "❌ Model invocation failed"
    rm -f test.json response.json
    exit 1
fi

echo ""

# Check environment file
echo "5️⃣ Checking environment configuration..."
if [ -f ".env" ]; then
    echo "✅ .env file exists"
    cat .env
else
    echo "⚠️ .env file missing, creating it..."
    cat > .env << 'EOF'
AWS_PROFILE=bedrockuser
REACT_APP_BEDROCK_REGION=us-west-2
REACT_APP_BEDROCK_MODEL_ID=anthropic.claude-3-5-haiku-20241022-v1:0
EOF
    echo "✅ .env file created"
fi

echo ""

# Check application build
echo "6️⃣ Testing application build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Application builds successfully"
else
    echo "❌ Application build failed"
    exit 1
fi

echo ""
echo "🎉 All checks passed! Your application is ready to run."
echo ""
echo "To start the application:"
echo "  npm start"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo "Try asking Claude: 'Explain quantum computing in simple terms'"
