import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  Image, 
  FileText, 
  X,
  Sparkles,
  Brain,
  Zap,
  Upload,
  Smile
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

const ChatInput = ({ onSendMessage, disabled = false, placeholder = "Ask me anything about company policies, processes, or docs..." }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // 🎤 Voice Recording Functionality
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        // Create attachment from audio
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioAttachment: FileAttachment = {
          id: Date.now().toString(),
          name: `voice-message-${Date.now()}.wav`,
          size: audioBlob.size,
          type: 'audio/wav',
          url: audioUrl
        };

        setAttachments(prev => [...prev, audioAttachment]);
        
        toast({
          title: "🎤 Voice message recorded!",
          description: "Voice recording captured successfully",
        });
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "🎤 Recording started",
        description: "Speak your message...",
      });
    } catch (error) {
      toast({
        title: "❌ Recording failed",
        description: "Please check microphone permissions",
        variant: "destructive",
      });
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

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

      // Generate preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAttachments(prev => 
            prev.map(att => 
              att.id === attachment.id 
                ? { ...att, preview: e.target?.result as string }
                : att
            )
          );
        };
        reader.readAsDataURL(file);
      }

      setAttachments(prev => [...prev, attachment]);

      // If it's a PDF, upload and process it immediately
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        toast({
          title: "� Processing PDF...",
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
              description: `Extracted ${result.document.wordCount} words from ${file.name}`,
            });

            // Auto-send the extracted content as a message
            onSendMessage(`I've uploaded and processed a PDF document: "${result.document.title}"\n\nHere's a summary:\n${result.document.summary}\n\nPlease analyze this document and help me understand its content.`, [attachment]);
            
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
        // For non-PDF files, just show the normal attachment toast
        toast({
          title: "📎 Files attached",
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
      setIsExpanded(false);
      
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
    } else if (e.key === 'Enter' && e.shiftKey) {
      setIsExpanded(true);
    }
  }, [handleSend]);

  // 🎨 Smart Suggestions
  const smartSuggestions = [
    "What's our refund policy?",
    "How do I request design assets?", 
    "PTO request process",
    "Expense claim guidelines"
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="border-t bg-background p-4 glass">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {attachments.map((attachment) => (
              <Card key={attachment.id} className="card-premium p-2 min-w-[200px] relative group">
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110"
                >
                  <X className="h-3 w-3" />
                </button>
                
                <div className="flex items-center gap-2">
                  {attachment.type.startsWith('image/') ? (
                    <div className="relative">
                      <Image className="h-8 w-8 text-accent" />
                      {attachment.preview && (
                        <img 
                          src={attachment.preview} 
                          alt="Preview" 
                          className="absolute inset-0 h-8 w-8 object-cover rounded opacity-80" 
                        />
                      )}
                    </div>
                  ) : attachment.type.startsWith('audio/') ? (
                    <Mic className="h-8 w-8 text-primary neural-pulse" />
                  ) : (
                    <FileText className="h-8 w-8 text-secondary" />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{attachment.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Attachment button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 flex-shrink-0 neural-glow transition-all duration-300 hover:scale-110"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        >
          <Paperclip className="h-4 w-4 transition-transform duration-300 hover:rotate-12" />
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt,.md"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Input field */}
        <div className="flex-1 relative">
          {isExpanded ? (
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={placeholder}
              onKeyDown={handleKeyPress}
              disabled={disabled}
              className="input-neural resize-none min-h-[100px] transition-all duration-300"
              rows={4}
            />
          ) : (
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={() => message.length > 50 && setIsExpanded(true)}
              placeholder={placeholder}
              disabled={disabled}
              className="input-neural pr-20 transition-all duration-300 focus:shadow-glow focus:scale-[1.01]"
            />
          )}
          
          {/* Input actions */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 transition-all duration-300 hover:scale-110"
            >
              <Smile className="h-4 w-4 transition-transform duration-300 hover:rotate-12" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-6 w-6 p-0 transition-all duration-300 ${
                isRecording 
                  ? 'text-destructive animate-pulse' 
                  : 'hover:scale-110'
              }`}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={disabled}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>

          {/* AI Processing Indicator */}
          {disabled && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <div className="flex items-center gap-2">
                <div className="neural-pulse">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">AI thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={disabled || (!message.trim() && attachments.length === 0)}
          className="btn-neural h-10 w-10 p-0 group shadow-glow transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:scale-100"
        >
          <Send className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-300" />
        </Button>
      </div>

      {/* Expand/Collapse Toggle */}
      {isExpanded && (
        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
          <span>Shift + Enter for new line</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="text-xs hover:text-primary"
          >
            Collapse
          </Button>
        </div>
      )}

      {/* Quick suggestions */}
      {!message && !attachments.length && (
        <div className="mt-3 flex flex-wrap gap-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {smartSuggestions.map((suggestion, index) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              onClick={() => setMessage(suggestion)}
              className="text-xs btn-innovation transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatInput;