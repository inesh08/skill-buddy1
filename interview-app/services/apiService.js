// services/apiService.js

// Get the correct base URL based on environment
const getApiBaseUrl = () => {
  // Replace with your actual computer IP address
  const COMPUTER_IP = '172.20.10.7'; // Your current IP from the error log
  
  // Development URLs
  const LOCAL_URL = `http://${COMPUTER_IP}:5000/api`;
  
  // Production URL (when you deploy)
  const PRODUCTION_URL = 'https://your-backend-domain.com/api';
  
  // Use production URL if in production, otherwise use local
  if (__DEV__) {
    return LOCAL_URL;
  } else {
    return PRODUCTION_URL;
  }
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
    
    // Log the API URL for debugging
    console.log('API Base URL:', this.baseURL);
  }

  setAuthToken(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      console.log('Making API request to:', url);
      
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      console.log('API response received:', data);
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      
      // Provide more specific error messages
      if (error.message === 'Network request failed') {
        throw new Error(`Cannot connect to server. Make sure backend is running on ${this.baseURL}`);
      }
      
      throw error;
    }
  }

  // Test connection method
  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/`);
      const data = await response.json();
      console.log('Backend connection test successful:', data);
      return true;
    } catch (error) {
      console.error('Backend connection test failed:', error);
      return false;
    }
  }

  // Auth methods
  async register(email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async login(email, password) {
    // Send email and password instead of token for development
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(idToken) {
    return this.request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken }),
    });
  }

  // Interview methods
  async getQuestions(careerPath, count = null) {
    const params = count ? `?count=${count}` : '';
    return this.request(`/interview/questions/${careerPath}${params}`);
  }

  async startInterview(userId, careerPath) {
    return this.request('/interview/start', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, career_path: careerPath }),
    });
  }

  async submitResponse(sessionId, questionId, response) {
    return this.request('/interview/response', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        question_id: questionId,
        response: response,
      }),
    });
  }

  async endInterview(sessionId) {
    return this.request('/interview/end', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId }),
    });
  }

  async getSession(sessionId) {
    return this.request(`/interview/session/${sessionId}`);
  }

  // User methods
  async getUserProfile(userId) {
    return this.request(`/user/profile/${userId}`);
  }

  async getUserSessions(userId) {
    return this.request(`/user/sessions/${userId}`);
  }

  async updateUserProfile(userId, data) {
    return this.request(`/user/update/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Feedback methods
  async submitFeedback(userId, sessionId, rating, comments = null) {
    return this.request('/feedback/submit', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        session_id: sessionId,
        rating: rating,
        comments: comments,
      }),
    });
  }

  async getSessionFeedback(sessionId) {
    return this.request(`/feedback/session/${sessionId}`);
  }

  async getUserFeedback(userId) {
    return this.request(`/feedback/user/${userId}`);
  }

  async getAverageRating() {
    return this.request('/feedback/average-rating');
  }
}

export default new ApiService();