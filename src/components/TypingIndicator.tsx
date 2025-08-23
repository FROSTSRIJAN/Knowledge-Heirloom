import { Bot, Clock } from "lucide-react";

const TypingIndicator = () => {
  return (
    <div className="p-4 animate-fade-in">
      <div className="flex gap-3">
        {/* Bot Avatar */}
        <div className="flex-shrink-0">
          <div className="h-10 w-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow animate-pulse-glow">
            <Bot className="h-5 w-5 text-white" />
          </div>
        </div>

        {/* Typing content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-foreground">DocsBot AI</span>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>typing...</span>
            </div>
          </div>

          {/* Typing animation */}
          <div className="bg-chat-message-bot rounded-lg px-4 py-3 inline-block">
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;