import axios from 'axios';

class AstroRagService {
  constructor() {
    this.baseURL = process.env.ASTRO_API_URL || 'https://astrolozee-ai.onrender.com';
    this.apiKey = process.env.ASTRO_API_KEY || 'supersecret@123A$trolzee';
    
    if (!this.apiKey) {
      throw new Error('ASTRO_API_KEY is not defined in environment variables');
    }
  }

  async askQuestion(question, context = '', ragWithContext = false) {
    try {
      const response = await axios.post(
        `${this.baseURL}/astro/ask/`,
        {
          question,
          context,
          rag_with_context: ragWithContext
        },
        {
          headers: {
            'accept': 'application/json',
            'x-api-key': this.apiKey,
            'Content-Type': 'application/json'
          },
          // timeout: 30000 // 30 seconds timeout
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error calling Astro RAG API:', error.message);
      
      if (error.response) {
        // API returned an error response
        return {
          success: false,
          error: error.response.data,
          statusCode: error.response.status
        };
      } else if (error.request) {
        // Request was made but no response received
        return {
          success: false,
          error: 'No response from Astro API. Please try again later.',
          statusCode: 503
        };
      } else {
        // Error in setting up the request
        return {
          success: false,
          error: error.message,
          statusCode: 500
        };
      }
    }
  }
}

export default new AstroRagService();
