# Contributing to Amplify Q Chatbot

Thank you for your interest in contributing to the Amplify Q Chatbot project! This document provides guidelines for contributing.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature/fix
4. Make your changes
5. Test your changes
6. Submit a pull request

## 📋 Development Setup

### Prerequisites
- Node.js 18+
- AWS CLI configured
- AWS account with Bedrock access

### Local Development
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/amplify-q-chatbot.git
cd amplify-q-chatbot

# Install dependencies
npm install
cd amplify && npm install && cd ..

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Start development servers
npm run server  # Terminal 1
npm start       # Terminal 2
```

## 🔧 Code Style

- Use ES6+ features
- Follow React best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure TypeScript compatibility

## 🧪 Testing

Before submitting a PR:
- Test the React frontend locally
- Test API endpoints
- Verify AWS deployment works
- Check for console errors
- Test responsive design

## 📝 Pull Request Process

1. **Branch Naming**: Use descriptive names
   - `feature/add-new-model-support`
   - `fix/cors-issue`
   - `docs/update-readme`

2. **Commit Messages**: Use clear, descriptive messages
   ```
   feat: add support for Claude 3 Opus model
   fix: resolve CORS issue in API Gateway
   docs: update deployment instructions
   ```

3. **PR Description**: Include
   - What changes were made
   - Why the changes were needed
   - How to test the changes
   - Screenshots if UI changes

## 🐛 Bug Reports

When reporting bugs, include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (Node version, AWS region, etc.)
- Console logs/error messages
- Screenshots if applicable

## 💡 Feature Requests

For new features:
- Describe the feature and use case
- Explain why it would be valuable
- Consider implementation complexity
- Discuss potential alternatives

## 🔒 Security

- Never commit AWS credentials or API keys
- Use environment variables for sensitive data
- Follow AWS security best practices
- Report security issues privately

## 📚 Documentation

Help improve documentation by:
- Fixing typos and grammar
- Adding missing information
- Updating outdated content
- Adding examples and tutorials

## 🎯 Areas for Contribution

- **Frontend**: React components, UI/UX improvements
- **Backend**: Lambda functions, API enhancements
- **Infrastructure**: AWS resource optimization
- **Documentation**: Guides, tutorials, API docs
- **Testing**: Unit tests, integration tests
- **Performance**: Optimization and monitoring

## 📞 Getting Help

- Check existing issues and discussions
- Review documentation
- Ask questions in issues (use "question" label)

## 🙏 Recognition

Contributors will be recognized in:
- README.md acknowledgments
- Release notes
- Project documentation

Thank you for contributing to make this project better! 🚀
