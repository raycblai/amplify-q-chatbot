// Configuration for different environments

const config = {
  development: {
    apiUrl: 'http://localhost:3001',
    useLocalProxy: true
  },
  production: {
    apiUrl: '', // Will be set from amplify_outputs.json
    useLocalProxy: false
  }
};

// Determine current environment
const environment = process.env.NODE_ENV || 'development';

export const API_CONFIG = config[environment];

export const getApiUrl = (amplifyOutputs = null) => {
  if (API_CONFIG.useLocalProxy) {
    return API_CONFIG.apiUrl;
  }
  
  // In production, use Amplify API Gateway URL
  if (amplifyOutputs?.custom?.bedrockApi?.url) {
    return amplifyOutputs.custom.bedrockApi.url;
  }
  
  // Fallback - this should be replaced with actual API Gateway URL
  return process.env.REACT_APP_API_URL || API_CONFIG.apiUrl;
};
