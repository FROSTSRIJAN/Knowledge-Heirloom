import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Bot, 
  User, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  Share, 
  MoreHorizontal,
  Sparkles,
  Brain,
  Zap,
  BookOpen,
  ExternalLink,
  Volume2,
  VolumeX,
  Download,
  MessageSquare,
  Star,
  Clock,
  CheckCircle,
  FileText
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface KnowledgeCard {
  title: string;
  steps?: string[];
  links?: { title: string; url: string }[];
  category: string;
  confidence?: number;
  source?: string;
}

interface ChatMessageProps {
  type: 'user' | 'bot' | 'system' | 'ai';
  content: string;
  timestamp: string;
  author?: string;
  knowledgeCard?: KnowledgeCard;
  isWelcome?: boolean;
  attachments?: any[];
}

const ChatMessage = ({ 
  type, 
  content, 
  timestamp, 
  author, 
  knowledgeCard, 
  isWelcome = false,
  attachments = []
}: ChatMessageProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // 🎵 Text-to-Speech functionality
  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(content);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => {
          setIsPlaying(false);
          toast({
            title: "Speech synthesis failed",
            description: "Unable to play audio",
            variant: "destructive",
          });
        };
        
        window.speechSynthesis.speak(utterance);
      }
    } else {
      toast({
        title: "Text-to-speech not supported",
        description: "Your browser doesn't support speech synthesis",
        variant: "destructive",
      });
    }
  };

  // 📋 Copy functionality
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "✅ Copied to clipboard",
        description: "Message content copied successfully",
      });
    } catch (error) {
      toast({
        title: "❌ Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  // 👍👎 Feedback functionality
  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(feedback === type ? null : type);
    toast({
      title: `Feedback ${type === 'up' ? '👍' : '👎'}`,
      description: `Thank you for your ${type === 'up' ? 'positive' : 'negative'} feedback!`,
    });
  };

  // 🔗 Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Knowledge Heirloom Chat',
          text: content,
          url: window.location.href,
        });
      } catch (error) {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const getAvatar = () => {
    switch (type) {
      case 'user':
        return (
          <div className="h-10 w-10 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110">
            <User className="h-5 w-5 text-white" />
          </div>
        );
      case 'bot':
        return (
          <div className="h-10 w-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow neural-pulse">
            <Bot className="h-5 w-5 text-white" />
          </div>
        );
      case 'ai':
        return (
          <div className="h-10 w-10 bg-gradient-neural rounded-lg flex items-center justify-center shadow-glow neural-pulse">
            <Brain className="h-5 w-5 text-white" />
          </div>
        );
      case 'system':
        return (
          <div className="h-10 w-10 bg-warning rounded-lg flex items-center justify-center animate-pulse">
            <CheckCircle className="h-5 w-5 text-warning-foreground" />
          </div>
        );
      default:
        return null;
    }
  };

  const getMessageBgColor = () => {
    if (isWelcome) return 'bg-gradient-primary text-white shadow-glow neural-pulse';
    
    switch (type) {
      case 'user':
        return 'message-user';
      case 'bot':
        return 'message-bot';
      case 'ai':
        return 'message-ai';
      case 'system':
        return 'border border-warning/30 bg-warning/10';
      default:
        return 'bg-muted';
    }
  };

  const shouldShowActions = type === 'bot' || type === 'ai';

  return (
    <div 
      className={`p-4 animate-fade-in group hover:bg-muted/30 transition-all duration-300 ${
        type === 'system' ? 'border-l-4 border-warning' : ''
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 animate-scale-in">
          {getAvatar()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold gradient-text">
              {type === 'bot' ? 'DocsBot AI' : 
               type === 'ai' ? 'AI Assistant' :
               type === 'system' ? 'System' : 
               author || 'You'}
            </span>
            {(type === 'bot' || type === 'ai') && (
              <Badge variant="secondary" className="text-xs neural-pulse">AI Assistant</Badge>
            )}
            {knowledgeCard?.confidence && (
              <Badge variant="outline" className="text-xs">
                {Math.round(knowledgeCard.confidence * 100)}% confident
              </Badge>
            )}
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timestamp}
            </span>
          </div>

          {/* Welcome message special styling */}
          {isWelcome && (
            <Card className="p-4 mb-3 bg-gradient-glow border-primary/20 card-premium animate-scale-in transition-all duration-500 hover:shadow-glow floating">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-medium neural-pulse">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <h3 className="font-semibold text-lg mb-2 gradient-text">Welcome to Knowledge Heirloom! 🎁</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {content}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge className="bg-primary/10 text-primary border-primary/30">AI-Powered</Badge>
                    <Badge className="bg-accent/10 text-accent border-accent/30">Voice Recognition</Badge>
                    <Badge className="bg-secondary/10 text-secondary border-secondary/30">Smart Search</Badge>
                    <Badge className="bg-neural/10 text-white border-neural/30">Neural Processing</Badge>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Regular message content */}
          {!isWelcome && (
            <div className={`${getMessageBgColor()} rounded-lg px-4 py-3 inline-block max-w-full card-premium transition-all duration-300 hover:shadow-soft animate-slide-in-left`}>
              <div className={`prose prose-sm max-w-none ${
                content.length > 300 && !isExpanded ? 'line-clamp-6' : ''
              }`}>
                <p className="text-foreground whitespace-pre-wrap break-words leading-relaxed">
                  {content}
                </p>
              </div>

              {/* Expand/Collapse for long messages */}
              {content.length > 300 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 text-xs hover:bg-background/20"
                >
                  {isExpanded ? 'Show less' : 'Show more'}
                </Button>
              )}

              {/* Attachments */}
              {attachments && attachments.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {attachments.map((attachment, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-secondary/80 transition-colors">
                      <Download className="h-3 w-3 mr-1" />
                      {attachment.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Knowledge Card */}
          {knowledgeCard && (
            <Card className="mt-3 p-4 border-primary/20 bg-gradient-card shadow-soft card-premium transition-all duration-500 hover:shadow-glow animate-scale-in" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-2 mb-3 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <BookOpen className="h-5 w-5 text-primary floating" />
                <h4 className="font-semibold gradient-text">{knowledgeCard.title}</h4>
                <Badge variant="outline" className="text-xs animate-slide-in-right">{knowledgeCard.category}</Badge>
              </div>

              {knowledgeCard.steps && (
                <div className="space-y-2 mb-4">
                  {knowledgeCard.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${0.7 + index * 0.1}s` }}>
                      <div className="h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium mt-0.5 neural-glow transition-all duration-300 hover:scale-110">
                        {index + 1}
                      </div>
                      <p className="text-foreground flex-1">{step}</p>
                    </div>
                  ))}
                </div>
              )}

              {knowledgeCard.links && knowledgeCard.links.length > 0 && (
                <div className="space-y-2 animate-fade-in" style={{ animationDelay: '1s' }}>
                  <h5 className="text-sm font-medium text-muted-foreground">Related Resources:</h5>
                  {knowledgeCard.links.map((link, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="h-auto p-2 justify-start w-full text-left btn-innovation transition-all duration-300 hover:scale-[1.02] group animate-slide-in-left"
                      style={{ animationDelay: `${1.1 + index * 0.1}s` }}
                      onClick={() => window.open(link.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                      <span className="truncate">{link.title}</span>
                    </Button>
                  ))}
                </div>
              )}
              
              {knowledgeCard.source && (
                <div className="mt-3 text-xs text-muted-foreground">
                  Source: {knowledgeCard.source}
                </div>
              )}
            </Card>
          )}

          {/* Action Buttons */}
          {shouldShowActions && (
            <div className={`flex items-center gap-1 mt-2 transition-all duration-300 ${
              showActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}>
              {/* Copy */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 w-8 p-0 hover:bg-primary/10 neural-glow transition-all duration-300 hover:scale-110"
              >
                <Copy className="h-3 w-3" />
              </Button>

              {/* Text-to-Speech */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTextToSpeech}
                className="h-8 w-8 p-0 hover:bg-primary/10 neural-glow transition-all duration-300 hover:scale-110"
              >
                {isPlaying ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
              </Button>

              {/* Feedback */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFeedback('up')}
                className={`h-8 w-8 p-0 hover:bg-success/10 transition-all duration-300 hover:scale-110 ${
                  feedback === 'up' ? 'bg-success/20 text-success neural-glow' : ''
                }`}
              >
                <ThumbsUp className="h-3 w-3" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFeedback('down')}
                className={`h-8 w-8 p-0 hover:bg-destructive/10 transition-all duration-300 hover:scale-110 ${
                  feedback === 'down' ? 'bg-destructive/20 text-destructive neural-glow' : ''
                }`}
              >
                <ThumbsDown className="h-3 w-3" />
              </Button>

              {/* Share */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="h-8 w-8 p-0 hover:bg-primary/10 neural-glow transition-all duration-300 hover:scale-110"
              >
                <Share className="h-3 w-3" />
              </Button>

              {/* More actions */}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-primary/10 neural-glow transition-all duration-300 hover:scale-110"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;