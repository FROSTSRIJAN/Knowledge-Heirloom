import { useState } from "react";
import { Send, Paperclip, Smile, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
}

const ChatInput = ({ onSendMessage, placeholder = "Ask me anything about company policies, processes, or docs..." }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t bg-background p-4 animate-slide-in-right">
      <div className="flex items-end gap-2">
        {/* Attachment button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 flex-shrink-0 transition-all duration-300 hover:scale-110 hover:bg-primary/10"
        >
          <Paperclip className="h-4 w-4 transition-transform duration-300 hover:rotate-12" />
        </Button>

        {/* Input field */}
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="pr-20 resize-none min-h-[40px] py-3 transition-all duration-300 focus:shadow-glow focus:scale-[1.01]"
          />
          
          {/* Input actions */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 transition-all duration-300 hover:scale-110 hover:bg-primary/10"
            >
              <Smile className="h-4 w-4 transition-transform duration-300 hover:rotate-12" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 transition-all duration-300 hover:scale-110 hover:bg-primary/10"
            >
              <Mic className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
            </Button>
          </div>
        </div>

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={!message.trim()}
          className="h-10 w-10 p-0 bg-gradient-primary hover:opacity-90 shadow-glow transition-all duration-300 hover:scale-110 hover:shadow-medium disabled:opacity-50 disabled:scale-100"
        >
          <Send className="h-4 w-4 transition-transform duration-300 hover:translate-x-0.5" />
        </Button>
      </div>

      {/* Quick suggestions */}
      <div className="mt-3 flex flex-wrap gap-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        {[
          "What's our refund policy?",
          "How do I request design assets?",
          "PTO request process",
          "Expense claim guidelines"
        ].map((suggestion, index) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            onClick={() => setMessage(suggestion)}
            className="text-xs transition-all duration-300 hover:scale-105 hover:shadow-soft hover:bg-primary/10 animate-fade-in"
            style={{ animationDelay: `${0.3 + index * 0.1}s` }}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ChatInput;