// API configuration
const API_BASE_URL = 'http://localhost:8081/api';

// Types for API responses
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'EMPLOYEE' | 'ADMIN' | 'SENIOR_DEV';
  profileImage?: string;
  lastLogin?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  content: string;
  type: 'user' | 'bot' | 'system';
  createdAt: string;
  tokensUsed?: number;
  responseTime?: number;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  messageCount: number;
  updatedAt: string;
  createdAt: string;
  messages?: Message[];
}

export interface LegacyMessage {
  id: string;
  title: string;
  content: string;
  category: string;
  isSpecial: boolean;
  createdAt: string;
  author: {
    name: string;
    profileImage?: string;
  };
}

export interface APIResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Auth token management
let authToken: string | null = localStorage.getItem('auth_token');

export const setAuthToken = (token: string) => {
  authToken = token;
  localStorage.setItem('auth_token', token);
};

export const removeAuthToken = () => {
  authToken = null;
  localStorage.removeItem('auth_token');
};

export const getAuthToken = () => authToken;

// Base API function with error handling
async function apiCall<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error);
    throw error;
  }
}

// Authentication API
export const authAPI = {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    try {
      const response = await apiCall<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      if (response.token) {
        setAuthToken(response.token);
      }
      
      return response;
    } catch (error) {
      // Fallback to hackathon auth if main auth fails
      try {
        const response = await apiCall<{ token: string; user: User }>('/hackathon/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        
        if (response.token) {
          setAuthToken(response.token);
        }
        
        return response;
      } catch (fallbackError) {
        throw error; // Throw original error
      }
    }
  },

  async register(name: string, email: string, password: string, role: string = 'EMPLOYEE'): Promise<{ user: User }> {
    return apiCall<{ user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  },

  async getMe(): Promise<{ user: User }> {
    return apiCall<{ user: User }>('/auth/me');
  },

  logout() {
    removeAuthToken();
  }
};

// Conversations API
export const conversationsAPI = {
  async getConversations(): Promise<{ conversations: Conversation[] }> {
    return apiCall<{ conversations: Conversation[] }>('/conversations');
  },

  async getConversation(id: string): Promise<{ conversation: Conversation }> {
    return apiCall<{ conversation: Conversation }>(`/conversations/${id}`);
  },

  async startConversation(title?: string, initialMessage?: string): Promise<{
    conversation: Conversation;
    aiResponse?: Message;
  }> {
    return apiCall<{
      conversation: Conversation;
      aiResponse?: Message;
    }>('/conversations/start', {
      method: 'POST',
      body: JSON.stringify({ title, initialMessage }),
    });
  },

  async sendMessage(conversationId: string, content: string): Promise<{
    userMessage: Message;
    aiResponse: Message;
  }> {
    return apiCall<{
      userMessage: Message;
      aiResponse: Message;
    }>(`/conversations/${conversationId}/message`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  async deleteConversation(id: string): Promise<void> {
    await apiCall(`/conversations/${id}`, {
      method: 'DELETE',
    });
  }
};

// Legacy Messages API
export const legacyAPI = {
  async getLegacyMessages(): Promise<{ messages: LegacyMessage[]; totalCount: number }> {
    return apiCall<{ messages: LegacyMessage[]; totalCount: number }>('/legacy');
  },

  async getDailyWisdom(): Promise<{ message: LegacyMessage }> {
    return apiCall<{ message: LegacyMessage }>('/legacy/daily-wisdom');
  },

  async createLegacyMessage(data: {
    title: string;
    content?: string;
    category?: string;
    isPublic?: boolean;
    isSpecial?: boolean;
    generateWithAI?: boolean;
    aiPrompt?: string;
  }): Promise<{ legacyMessage: LegacyMessage }> {
    return apiCall<{ legacyMessage: LegacyMessage }>('/legacy', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};

// Analytics API
export const analyticsAPI = {
  async getDashboard(): Promise<{
    analytics: {
      overview: {
        totalQueries?: number;
        totalTokens?: number;
        averageResponseTime?: number;
        totalConversations?: number;
        totalUsers?: number;
        totalMessages?: number;
        totalLegacyMessages?: number;
      };
      dailyActivity?: Array<{
        date: string;
        queries: number;
        tokens: number;
        responseTime?: number;
      }>;
      recentActivity?: Array<{
        date: string;
        queries: number;
        tokens: number;
      }>;
    };
  }> {
    return apiCall<any>('/analytics/dashboard');
  }
};

// Knowledge Base API
export const knowledgeAPI = {
  async searchKnowledge(params: {
    search?: string;
    category?: string;
    tags?: string[];
    limit?: number;
  } = {}): Promise<{
    knowledge: Array<{
      id: string;
      title: string;
      content: string;
      category: string;
      tags: string[];
      updatedAt: string;
    }>;
    totalCount: number;
  }> {
    const searchParams = new URLSearchParams();
    
    if (params.search) searchParams.append('search', params.search);
    if (params.category) searchParams.append('category', params.category);
    if (params.tags) params.tags.forEach(tag => searchParams.append('tags', tag));
    if (params.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/knowledge?${queryString}` : '/knowledge';
    
    return apiCall<{
      knowledge: Array<{
        id: string;
        title: string;
        content: string;
        category: string;
        tags: string[];
        updatedAt: string;
      }>;
      totalCount: number;
    }>(endpoint);
  }
};

// Health check API
export const healthAPI = {
  async checkBackend(): Promise<{ status: string; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
      return await response.json();
    } catch (error) {
      throw new Error('Backend is not accessible. Make sure it\'s running on http://localhost:8081');
    }
  }
};
