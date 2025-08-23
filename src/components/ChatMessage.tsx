import { Bot, User, Clock, CheckCircle, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ChatMessageProps {
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

const ChatMessage = ({ type, content, timestamp, author, knowledgeCard, isWelcome }: ChatMessageProps) => {
  const bgColor = type === 'user' ? 'bg-chat-message-user' : 
                  type === 'bot' ? 'bg-chat-message-bot' : 
                  'bg-chat-message-system';

  return (
    <div className={`p-4 ${type === 'system' ? 'border-l-4 border-warning' : ''}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {type === 'bot' ? (
            <div className="h-10 w-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <Bot className="h-5 w-5 text-white" />
            </div>
          ) : type === 'user' ? (
            <div className="h-10 w-10 bg-secondary rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-secondary-foreground" />
            </div>
          ) : (
            <div className="h-10 w-10 bg-warning rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-warning-foreground" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-foreground">
              {type === 'bot' ? 'DocsBot AI' : type === 'system' ? 'System' : author || 'You'}
            </span>
            {type === 'bot' && (
              <Badge variant="secondary" className="text-xs">AI Assistant</Badge>
            )}
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timestamp}
            </span>
          </div>

          {/* Welcome message special styling */}
          {isWelcome && (
            <Card className="p-4 mb-3 bg-gradient-glow border-primary/20">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-medium">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Welcome to your AI Knowledge Assistant! 🎁</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    I was created as a parting gift by a retiring senior developer who wanted company knowledge to live on forever. 
                    Ask me about policies, processes, or anything work-related — I'm here to help you find what you need instantly.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Regular message content */}
          <div className={`${bgColor} rounded-lg px-4 py-3 inline-block max-w-full`}>
            <p className="text-foreground whitespace-pre-wrap">{content}</p>
          </div>

          {/* Knowledge Card */}
          {knowledgeCard && (
            <Card className="mt-3 p-4 border-primary/20 bg-gradient-card shadow-soft">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-foreground">{knowledgeCard.title}</h4>
                <Badge variant="outline" className="text-xs">{knowledgeCard.category}</Badge>
              </div>

              {knowledgeCard.steps && (
                <div className="space-y-2 mb-4">
                  {knowledgeCard.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-foreground flex-1">{step}</p>
                    </div>
                  ))}
                </div>
              )}

              {knowledgeCard.links && knowledgeCard.links.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-muted-foreground">Related Resources:</h5>
                  {knowledgeCard.links.map((link, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="h-auto p-2 justify-start w-full text-left"
                    >
                      <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{link.title}</span>
                    </Button>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;