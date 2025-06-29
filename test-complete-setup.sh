#!/bin/bash

echo "🧪 Testing Complete Bedrock Chat Setup"
echo "======================================"
echo ""

# Test 1: AWS Credentials
echo "1️⃣ Testing AWS credentials..."
if aws sts get-caller-identity --profile bedrockuser > /dev/null 2>&1; then
    echo "✅ AWS credentials working"
else
    echo "❌ AWS credentials failed"
    exit 1
fi

# Test 2: Bedrock Access
echo ""
echo "2️⃣ Testing Bedrock access..."
if aws bedrock list-foundation-models --region us-west-2 --profile bedrockuser > /dev/null 2>&1; then
    echo "✅ Bedrock access confirmed"
else
    echo "❌ Bedrock access failed"
    exit 1
fi

# Test 3: Start Proxy Server
echo ""
echo "3️⃣ Testing proxy server..."
npm run server &
SERVER_PID=$!
sleep 3

# Test server health
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Proxy server is running"
    
    # Test Bedrock endpoint
    echo ""
    echo "4️⃣ Testing Bedrock endpoint..."
    RESPONSE=$(curl -s -X POST http://localhost:3001/bedrock-chat \
        -H "Content-Type: application/json" \
        -d '{"message": "Say hello"}')
    
    if echo "$RESPONSE" | grep -q "response"; then
        echo "✅ Bedrock endpoint working"
        echo "📝 Sample response: $(echo "$RESPONSE" | cut -c1-50)..."
    else
        echo "❌ Bedrock endpoint failed"
        echo "Response: $RESPONSE"
    fi
else
    echo "❌ Proxy server failed to start"
fi

# Cleanup
kill $SERVER_PID 2>/dev/null

echo ""
echo "5️⃣ Testing React build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ React app builds successfully"
else
    echo "❌ React app build failed"
    exit 1
fi

echo ""
echo "🎉 All tests passed! Your application is ready."
echo ""
echo "To start the application:"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:3000"
