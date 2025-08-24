import { useState, useRef, useEffect } from "react";
import ChatSidebar from "@/components/ChatSidebar";
import ChatHeader from "@/components/ChatHeader";
import ChatMessage from "@/components/ChatMessage";
import ChatInputSimple from "@/components/ChatInputSimple";
import WelcomeCard from "@/components/WelcomeCard";
import TypingIndicator from "@/components/TypingIndicator";
import { useAuth, useConversation, useConversations } from "@/hooks/useAPI";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const { user, userLoading, login, loginLoading, register, registerLoading, logout } = useAuth();
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const { conversation, messages, sendMessage, sendMessageLoading } = useConversation(currentConversationId);
  const { startConversationAsync, startConversationLoading } = useConversations();
  
  // Auth form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', role: 'EMPLOYEE' });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sendMessageLoading]);

  // If not authenticated, show login/register
  if (!user && !userLoading) {
    return (
      <div className="min-h-screen login-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md card-premium backdrop-blur-lg border-0 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/autobot-from-transformers-logo-png-transparent.png" 
                alt="Knowledge Heirloom Logo" 
                className="h-16 w-16 mr-3"
              />
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Knowledge Heirloom
                </CardTitle>
              </div>
            </div>
            <CardDescription className="text-gray-300 text-lg">
              A gift from a senior developer to the next generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => login(loginForm)}
                  disabled={loginLoading}
                >
                  {loginLoading ? 'Signing in...' : 'Sign In'}
                </Button>
                
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  <p className="font-medium">Demo accounts:</p>
                  <p>Employee: junior@knowledgeheirloom.com</p>
                  <p>Senior Dev: senior@knowledgeheirloom.com</p>
                  <p>Admin: admin@knowledgeheirloom.com</p>
                  <p>Password: password123</p>
                </div>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Name</Label>
                  <Input
                    id="register-name"
                    placeholder="Your name"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your@email.com"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => register(registerForm)}
                  disabled={registerLoading}
                >
                  {registerLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (userLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Loading Knowledge Heirloom...</p>
        </div>
      </div>
    );
  }

  const handleSendMessage = async (content: string, attachments?: any[]) => {
    if (!currentConversationId) {
      // Auto-create a conversation when first message is sent
      try {
        const response = await startConversationAsync({ 
          title: content.length > 50 ? content.substring(0, 50) + '...' : content,
          initialMessage: content
        });
        if (response?.conversation) {
          setCurrentConversationId(response.conversation.id);
          // The startConversation already sends the initial message, so we return
          return;
        }
      } catch (error) {
        console.error('Failed to start conversation:', error);
        return;
      }
    } else {
      // Send message to existing conversation
      sendMessage({ content });
    }
  };

  // Convert backend messages to frontend format
  const formattedMessages: Message[] = messages.map(msg => ({
    id: msg.id,
    type: (msg.type as string) === 'BOT' ? 'bot' : (msg.type as string) === 'USER' ? 'user' : 'system',
    content: msg.content,
    timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    author: (msg.type as string) === 'USER' ? user?.name || 'You' : undefined,
  }));

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <ChatSidebar 
        user={user} 
        onLogout={logout}
        onConversationSelect={setCurrentConversationId}
        currentConversationId={currentConversationId}
      />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <ChatHeader 
          channelName={conversation?.title || "AI Assistant"} 
          user={user}
        />
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {!currentConversationId ? (
            <div className="p-6">
              <WelcomeCard 
                user={user} 
                onStartConversation={(prompt) => {
                  handleSendMessage(prompt, []);
                }} 
              />
            </div>
          ) : formattedMessages.length === 0 ? (
            <div className="p-6">
              <Card className="max-w-md mx-auto">
                <CardContent className="pt-6 text-center">
                  <p className="text-lg mb-2">👋 Ready to help!</p>
                  <p className="text-muted-foreground">
                    Ask me anything about development, processes, or team knowledge.
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            formattedMessages.map((message) => (
              <ChatMessage
                key={message.id}
                type={message.type}
                content={message.content}
                timestamp={message.timestamp}
                author={message.author}
                knowledgeCard={message.knowledgeCard}
                isWelcome={message.isWelcome}
              />
            ))
          )}
          
          {/* Typing Indicator */}
          {sendMessageLoading && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input */}
        <ChatInputSimple 
          onSendMessage={handleSendMessage} 
          disabled={sendMessageLoading}
          placeholder={
            !currentConversationId 
              ? "Type your message to start a new conversation..."
              : "Ask me anything..."
          }
        />
      </div>
    </div>
  );
};

export default Index;
