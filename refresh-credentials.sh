#!/bin/bash

echo "🔄 AWS Credentials Refresh Helper"
echo "================================="
echo ""

echo "Your AWS credentials have expired. Here are your options:"
echo ""

echo "1️⃣  AWS Console Method (Recommended):"
echo "   - Go to AWS Console"
echo "   - Click your username (top right)"
echo "   - Select 'Command line or programmatic access'"
echo "   - Copy the credentials for your operating system"
echo "   - Run the export commands in your terminal"
echo ""

echo "2️⃣  AWS Identity Center / SSO:"
echo "   - If you use AWS SSO, run: aws sso login"
echo "   - Then configure the profile: aws configure sso --profile bedrockuser"
echo ""

echo "3️⃣  Long-term Access Keys (if you have them):"
echo "   - Run: aws configure --profile bedrockuser"
echo "   - Enter your permanent access key and secret key"
echo ""

echo "4️⃣  Assume Role (if you know the role ARN):"
echo "   - Run: aws sts assume-role --role-arn YOUR_ROLE_ARN --role-session-name bedrock-session"
echo "   - Use the returned credentials"
echo ""

echo "After refreshing credentials, test with:"
echo "aws sts get-caller-identity --profile bedrockuser"
echo ""

# Check if we can detect the credential source
echo "🔍 Checking current credential configuration..."
if grep -q "sso_" ~/.aws/config 2>/dev/null; then
    echo "✅ SSO configuration detected in ~/.aws/config"
    echo "Try: aws sso login --profile bedrockuser"
elif grep -q "role_arn" ~/.aws/config 2>/dev/null; then
    echo "✅ Role assumption detected in ~/.aws/config"
    echo "Your credentials should refresh automatically"
else
    echo "⚠️  Manual credential refresh needed"
    echo "Use AWS Console method above"
fi
