import { 
  Bot, 
  Sparkles, 
  MessageSquare, 
  Upload,
  FileText,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "@/services/api";

interface WelcomeCardProps {
  user?: User;
  onStartConversation?: (prompt: string) => void;
}

const WelcomeCard = ({ user, onStartConversation }: WelcomeCardProps) => {
  const quickPrompts = [
    {
      icon: MessageSquare,
      title: "Ask a Question",
      prompt: "Hello! I'm ready to explore your AI capabilities.",
      description: "Start a conversation with your AI assistant"
    },
    {
      icon: Upload,
      title: "Upload Document",
      prompt: "I'd like to upload a document for analysis",
      description: "Upload PDFs, docs, or text files for AI analysis"
    },
    {
      icon: FileText,
      title: "Get Help",
      prompt: "Can you help me understand how to use this system?",
      description: "Learn about features and capabilities"
    }
  ];

  const handleQuickStart = (prompt: string) => {
    if (onStartConversation) {
      onStartConversation(prompt);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Main Welcome Header */}
      <Card className="bg-gradient-to-r from-blue-900/90 to-purple-900/90 border-blue-500/30 backdrop-blur text-white">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center p-2">
              <img 
                src="/autobot-from-transformers-logo-png-transparent.png" 
                alt="Knowledge Heirloom Logo" 
                className="h-10 w-10"
              />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold mb-2">
            Welcome to Knowledge Heirloom
          </CardTitle>
          <p className="text-blue-200 text-lg">
            {user ? `Hello ${user.name}! ` : ''}Your intelligent AI assistant powered by Gemini AI
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-300 mb-6">
            Ask questions, upload documents, explore knowledge, and get instant AI-powered insights.
          </p>
          <Button 
            onClick={() => handleQuickStart("Hello! I'm ready to explore your AI capabilities.")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Start Chatting
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        {quickPrompts.map((prompt, index) => (
          <Card 
            key={index}
            className="bg-gray-800/80 border-gray-600/50 backdrop-blur hover:bg-gray-700/80 transition-all duration-300 cursor-pointer group"
            onClick={() => handleQuickStart(prompt.prompt)}
          >
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <prompt.icon className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <h3 className="font-semibold text-white mb-2">{prompt.title}</h3>
              <p className="text-gray-400 text-sm">{prompt.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Simple Stats */}
      <Card className="bg-gray-800/50 border-gray-600/30 backdrop-blur">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">24/7</div>
              <div className="text-gray-400 text-sm">Available</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">100%</div>
              <div className="text-gray-400 text-sm">Secure</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">∞</div>
              <div className="text-gray-400 text-sm">Possibilities</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeCard;
