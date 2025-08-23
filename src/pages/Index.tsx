import { useState, useRef, useEffect } from "react";
import ChatSidebar from "@/components/ChatSidebar";
import ChatHeader from "@/components/ChatHeader";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import WelcomeCard from "@/components/WelcomeCard";

interface Message {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: string;
  author?: string;
  knowledgeCard?: {
    title: string;
    steps?: string[];
    links?: { title: string; url: string }[];
    category: string;
  };
  isWelcome?: boolean;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your AI knowledge assistant.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isWelcome: true
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      author: 'You'
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(content);
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const generateBotResponse = (userQuery: string): Message => {
    const query = userQuery.toLowerCase();
    
    if (query.includes('refund') || query.includes('return')) {
      return {
        id: Date.now().toString() + '_bot',
        type: 'bot',
        content: 'Here\'s our refund policy information:',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        knowledgeCard: {
          title: 'Refund Policy Process',
          category: 'Customer Service',
          steps: [
            'Customer must request refund within 30 days of purchase',
            'Submit refund request through customer portal or email support',
            'Include original order number and reason for return',
            'Refund processed within 5-7 business days after approval'
          ],
          links: [
            { title: 'Customer Portal - Refund Requests', url: '#' },
            { title: 'Full Refund Policy Document', url: '#' }
          ]
        }
      };
    }
    
    if (query.includes('design') || query.includes('asset')) {
      return {
        id: Date.now().toString() + '_bot',
        type: 'bot',
        content: 'Here\'s how to request design assets:',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        knowledgeCard: {
          title: 'Design Asset Request Process',
          category: 'Creative Services',
          steps: [
            'Submit request via design team Slack channel #design-requests',
            'Include project details, deadline, and asset specifications',
            'Design team reviews within 24 hours during business days',
            'Assets delivered through shared Google Drive folder'
          ],
          links: [
            { title: 'Brand Guidelines', url: '#' },
            { title: 'Asset Request Template', url: '#' },
            { title: 'Design Team Contacts', url: '#' }
          ]
        }
      };
    }
    
    if (query.includes('pto') || query.includes('vacation') || query.includes('leave')) {
      return {
        id: Date.now().toString() + '_bot',
        type: 'bot',
        content: 'Here\'s the PTO request process:',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        knowledgeCard: {
          title: 'PTO Request Guidelines',
          category: 'Human Resources',
          steps: [
            'Submit PTO request at least 2 weeks in advance',
            'Use HR portal or email your manager directly',
            'Ensure project coverage is arranged with teammates',
            'Receive approval confirmation before booking travel'
          ],
          links: [
            { title: 'HR Portal - PTO Requests', url: '#' },
            { title: 'PTO Policy Full Document', url: '#' }
          ]
        }
      };
    }
    
    if (query.includes('expense') || query.includes('receipt')) {
      return {
        id: Date.now().toString() + '_bot',
        type: 'bot',
        content: 'Here\'s how to submit expense claims:',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        knowledgeCard: {
          title: 'Expense Claim Process',
          category: 'Finance',
          steps: [
            'Take clear photos of all receipts immediately',
            'Submit expenses within 30 days via expense portal',
            'Include business justification for each expense',
            'Reimbursement processed within 10 business days'
          ],
          links: [
            { title: 'Expense Portal Login', url: '#' },
            { title: 'Expense Policy Guidelines', url: '#' }
          ]
        }
      };
    }

    // Default response
    return {
      id: Date.now().toString() + '_bot',
      type: 'bot',
      content: `I'd be happy to help you with "${userQuery}". Let me search through our knowledge base for the most relevant information. In the meantime, you can try asking about specific policies, processes, or department guidelines.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <ChatSidebar />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <ChatHeader channelName="ai-assistant" />
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 1 && (
            <div className="p-6">
              <WelcomeCard />
            </div>
          )}
          
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              type={message.type}
              content={message.content}
              timestamp={message.timestamp}
              author={message.author}
              knowledgeCard={message.knowledgeCard}
              isWelcome={message.isWelcome}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input */}
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default Index;
