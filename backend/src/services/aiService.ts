import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class AIService {
  private model: string;

  constructor() {
    this.model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  }

  async generateResponse(
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [],
    userRole: string = 'EMPLOYEE',
    legacyContext: string = ''
  ): Promise<{
    content: string;
    tokensUsed: number;
    responseTime: number;
  }> {
    const startTime = Date.now();

    // For demo purposes, provide mock responses until Gemini is properly configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key-here') {
      const mockResponses = [
        `I understand your question: "${userMessage}". As a Knowledge Heirloom AI assistant, I'm here to help with development queries, best practices, and team knowledge sharing. How can I assist you further?`,
        `Great question! Based on your role as ${userRole}, I can provide tailored assistance with coding, documentation, or process guidance. What specific area would you like to explore?`,
        `I'm ready to help with that! While I'm currently running in demo mode, I can still assist with general development questions and team processes. What would you like to know more about?`,
        `Hello! I'm your AI Knowledge Heirloom assistant. I can help with coding questions, best practices, documentation, and team knowledge. How can I support your work today?`
      ];
      
      const responseTime = Date.now() - startTime + Math.random() * 200; // Simulate realistic response time
      const content = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      return {
        content,
        tokensUsed: Math.floor(content.length / 4), // Rough token estimate
        responseTime: Math.floor(responseTime)
      };
    }

    try {
      // Build system prompt based on user role
      const systemPrompt = this.buildSystemPrompt(userRole, legacyContext);

      // Format conversation history for Gemini
      const conversationText = conversationHistory.map(msg => 
        `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`
      ).join('\n\n');

      // Combine system prompt, conversation history, and new message
      const fullPrompt = `${systemPrompt}\n\n${conversationText}\n\nHuman: ${userMessage}\n\nAssistant:`;

      // Call Gemini API
      const model = genAI.getGenerativeModel({ model: this.model });
      
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const content = response.text();

      const responseTime = Date.now() - startTime;
      const tokensUsed = Math.floor((fullPrompt.length + content.length) / 4); // Rough token estimate

      logger.info(`AI response generated in ${responseTime}ms using ${tokensUsed} tokens`);

      return {
        content,
        tokensUsed,
        responseTime
      };

    } catch (error) {
      logger.error('Error generating AI response:', error);
      
      // Return a friendly fallback response
      return {
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment! 🤖',
        tokensUsed: 0,
        responseTime: Date.now() - startTime
      };
    }
  }

  private buildSystemPrompt(userRole: string, legacyContext: string): string {
    const basePrompt = `You are an intelligent AI assistant for "Knowledge Heirloom" - a special gift from a retiring senior developer to the next generation of developers.

Your personality:
- Wise but approachable, like a mentor
- Professional yet warm
- Sometimes includes subtle references to "lessons learned over the years"
- Occasionally adds appropriate emojis for friendliness
- Focus on being helpful and educational

Your capabilities:
- Answer technical questions about software development
- Provide coding guidance and best practices
- Help with project management and workflow questions
- Share insights about team collaboration
- Offer career advice for developers

Always format your responses clearly and provide actionable advice when possible.`;

    if (userRole === 'SENIOR_DEV') {
      return `${basePrompt}

SPECIAL MODE: You're speaking to the retiring senior developer who created this system. Be respectful and acknowledge their experience. Help them document their wisdom for the team.`;
    }

    if (userRole === 'ADMIN') {
      return `${basePrompt}

You're speaking to an admin user. You can provide administrative insights, team management advice, and system-level guidance.`;
    }

    // Regular employee
    let employeePrompt = `${basePrompt}

You're helping a team member. Be encouraging and supportive, especially for junior developers.`;

    // Add legacy context if available
    if (legacyContext) {
      employeePrompt += `\n\nRelevant wisdom from the senior developer:\n${legacyContext}\n\nUse this context when relevant to provide more personalized advice.`;
    }

    return employeePrompt;
  }

  async generateLegacyMessage(prompt: string, category: string): Promise<string> {
    try {
      const systemPrompt = `You are helping a retiring senior developer create meaningful messages for their team. 

The message should be:
- Personal and heartfelt
- Professional but warm
- Include practical wisdom or advice
- Category: ${category}
- Length: 2-3 paragraphs maximum

Write as if you're the senior developer sharing a final piece of wisdom with the team.

Prompt: ${prompt}`;

      const model = genAI.getGenerativeModel({ model: this.model });
      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      
      return response.text() || 'Unable to generate legacy message.';

    } catch (error) {
      logger.error('Error generating legacy message:', error);
      return 'Thank you for being part of this journey. Your dedication and curiosity inspire the next generation of developers. 🌟';
    }
  }

  async summarizeConversation(messages: string[]): Promise<string> {
    try {
      const conversation = messages.join('\n');
      const prompt = `Summarize this conversation in 1-2 sentences, focusing on the main topics discussed and key insights shared.\n\nConversation:\n${conversation}`;
      
      const model = genAI.getGenerativeModel({ model: this.model });
      const result = await model.generateContent(prompt);
      const response = await result.response;

      return response.text() || 'Conversation summary unavailable.';

    } catch (error) {
      logger.error('Error summarizing conversation:', error);
      return 'Technical discussion with helpful insights shared.';
    }
  }
}

export const aiService = new AIService();
