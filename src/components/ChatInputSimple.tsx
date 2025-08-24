import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { 
  Send, 
  Paperclip, 
  X,
} from "lucide-react";

interface ChatInputProps {
  onSendMessage: (content: string, attachments?: FileAttachment[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  preview?: string;
}

const ChatInput = ({ onSendMessage, disabled = false, placeholder = "Type your message..." }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 📎 File Attachment Functionality
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    for (const file of files) {
      const attachment: FileAttachment = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      };

      setAttachments(prev => [...prev, attachment]);

      // If it's a PDF, upload and process it immediately
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        toast({
          title: "📄 Processing PDF...",
          description: "Extracting text content for AI analysis",
        });

        try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('http://localhost:8081/api/upload/document', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            },
            body: formData
          });

          const result = await response.json();
          
          if (result.success) {
            toast({
              title: "✅ PDF processed successfully!",
              description: `Extracted content from ${file.name}`,
            });

            // Auto-send the extracted content as a message
            onSendMessage(`I've uploaded a PDF document: "${result.document.title}"\n\nPlease analyze this document and help me understand its content.`, [attachment]);
            
            // Clear the message input and attachments after auto-sending
            setMessage("");
            setAttachments([]);
          } else {
            toast({
              title: "❌ PDF processing failed",
              description: result.message || "Could not process the PDF file",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error('PDF upload error:', error);
          toast({
            title: "❌ Upload error",
            description: "Failed to upload and process PDF",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "📎 File attached",
          description: `${file.name} ready to send`,
        });
      }
    }

    // Clear the input
    if (event.target) {
      event.target.value = '';
    }
  }, [onSendMessage]);

  const removeAttachment = useCallback((id: string) => {
    setAttachments(prev => {
      const attachment = prev.find(att => att.id === id);
      if (attachment) {
        URL.revokeObjectURL(attachment.url);
      }
      return prev.filter(att => att.id !== id);
    });
  }, []);

  const handleSend = useCallback(() => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message.trim(), attachments);
      setMessage("");
      setAttachments([]);
      
      // Cleanup attachment URLs
      attachments.forEach(att => {
        URL.revokeObjectURL(att.url);
      });
    }
  }, [message, attachments, onSendMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className="border-t bg-background p-4">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="bg-gray-800 p-2 rounded-lg min-w-[200px] relative group">
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
                
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-white">{attachment.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-center gap-3">
        {/* Attachment button */}
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt,.md"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Text Input */}
        <div className="flex-1">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
          />
        </div>

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={disabled || (!message.trim() && attachments.length === 0)}
          className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
