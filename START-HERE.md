# 🚀 Bedrock Chat Application - Start Guide

## The Problem We Fixed
The "Credential is missing" error occurs because browsers can't access AWS CLI credentials directly for security reasons. We've solved this by creating a local proxy server that handles AWS authentication.

## 🏗️ Architecture
```
Browser (React App) → Local Proxy Server → Amazon Bedrock → Claude 3.5 Haiku
     Port 3000              Port 3001           AWS Cloud
```

## 🚀 Quick Start (2 Options)

### Option 1: Run Both Together (Recommended)
```bash
cd amplify-gen2-app
npm run dev
```
This starts both the proxy server (port 3001) and React app (port 3000) simultaneously.

### Option 2: Run Separately
**Terminal 1 - Start Proxy Server:**
```bash
cd amplify-gen2-app
npm run server
```

**Terminal 2 - Start React App:**
```bash
cd amplify-gen2-app
npm start
```

## 🌐 Access the Application
- Open your browser to: **http://localhost:3000**
- The app will show connection status in the upper section
- Green badge = Connected and ready to use
- Red badge = Proxy server not running

## 🧪 Test the Application
Try asking Claude:
- "Explain quantum computing in simple terms"
- "Write a haiku about programming"
- "What are the benefits of cloud computing?"
- "How does machine learning work?"

## 🔧 Troubleshooting

### If you see "Proxy server not running":
1. Make sure the proxy server is running on port 3001
2. Check Terminal 1 for any error messages
3. Verify AWS credentials: `aws sts get-caller-identity --profile bedrockuser`

### If you get AWS credential errors in the server:
```bash
# Refresh your AWS credentials
aws sts get-caller-identity --profile bedrockuser

# If expired, get new credentials from AWS Console
# Go to AWS Console → Your Username → Command line access
```

### If port 3001 is already in use:
```bash
# Find what's using port 3001
lsof -i :3001

# Kill the process if needed
kill -9 <PID>
```

## 📁 Project Structure
```
amplify-gen2-app/
├── src/
│   ├── App.js          # React frontend
│   └── App.css         # Styling
├── server.js           # Proxy server (handles AWS auth)
├── package.json        # Dependencies and scripts
└── .env               # Environment configuration
```

## 🔒 Security Notes
- The proxy server runs locally and uses your AWS CLI credentials
- No credentials are exposed to the browser
- Server only accepts requests from localhost
- All AWS calls are made server-side

## 💰 Cost Information
- **Claude 3.5 Haiku**: $0.25 per 1M input tokens, $1.25 per 1M output tokens
- **Typical conversation**: ~$0.001-0.01 per exchange
- **No other AWS services** used in this setup

## 🆘 Need Help?
1. Check both terminal windows for error messages
2. Verify AWS credentials are not expired
3. Ensure ports 3000 and 3001 are available
4. Check the browser console for any errors

## 🎉 Success Indicators
- ✅ Proxy server shows "running on http://localhost:3001"
- ✅ React app shows "Connected to proxy server" (green badge)
- ✅ You can ask Claude questions and get responses
- ✅ No "Credential is missing" errors
