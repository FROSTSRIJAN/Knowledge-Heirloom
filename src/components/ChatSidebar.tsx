import { Bot, Hash, Plus, Settings, Users, FileText, HelpCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ChatSidebar = () => {
  const channels = [
    { name: "general-help", unread: 3, type: "public" },
    { name: "hr-policies", unread: 0, type: "public" },
    { name: "design-assets", unread: 1, type: "public" },
    { name: "tech-docs", unread: 0, type: "public" },
  ];

  const directMessages = [
    { name: "DocsBot AI", status: "online", unread: 2 },
    { name: "Sarah Chen (HR)", status: "away", unread: 0 },
    { name: "Mike Johnson (IT)", status: "offline", unread: 0 },
  ];

  return (
    <div className="w-64 bg-chat-sidebar text-chat-sidebar-foreground flex flex-col h-full animate-slide-in-left">
      {/* Header */}
      <div className="p-4 border-b border-chat-sidebar-hover animate-fade-in">
        <div className="flex items-center gap-2 mb-3 group">
          <Bot className="h-6 w-6 text-primary-glow animate-float transition-transform duration-300 group-hover:scale-110" />
          <span className="font-semibold text-lg">InternalDocs AI</span>
        </div>
        <div className="text-sm text-chat-sidebar-foreground/70 leading-relaxed">
          "Your retiring developer's final gift — knowledge that lives on."
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 space-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-chat-sidebar-foreground hover:bg-chat-sidebar-hover transition-all duration-300 hover:scale-[1.02] hover:shadow-medium group"
        >
          <Sparkles className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
          Ask AI Anything
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-chat-sidebar-foreground hover:bg-chat-sidebar-hover transition-all duration-300 hover:scale-[1.02] hover:shadow-medium group"
        >
          <FileText className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
          Browse Docs
        </Button>
      </div>

      {/* Channels */}
      <div className="px-4 py-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-chat-sidebar-foreground/70">Channels</span>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-chat-sidebar-hover transition-all duration-200 hover:scale-110">
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <div className="space-y-1">
          {channels.map((channel, index) => (
            <div
              key={channel.name}
              className="flex items-center justify-between p-2 hover:bg-chat-sidebar-hover rounded-md cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-soft animate-fade-in"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-chat-sidebar-foreground/50 transition-colors duration-300 group-hover:text-primary-glow" />
                <span className="text-sm">{channel.name}</span>
              </div>
              {channel.unread > 0 && (
                <Badge variant="destructive" className="h-4 text-xs px-1.5 animate-pulse">
                  {channel.unread}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Direct Messages */}
      <div className="px-4 py-2 flex-1 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-chat-sidebar-foreground/70">Direct Messages</span>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-chat-sidebar-hover transition-all duration-200 hover:scale-110">
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <div className="space-y-1">
          {directMessages.map((dm, index) => (
            <div
              key={dm.name}
              className="flex items-center justify-between p-2 hover:bg-chat-sidebar-hover rounded-md cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-soft animate-fade-in"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  dm.status === 'online' ? 'bg-accent animate-pulse' : 
                  dm.status === 'away' ? 'bg-warning' : 'bg-muted-foreground'
                }`} />
                <span className="text-sm">{dm.name}</span>
              </div>
              {dm.unread > 0 && (
                <Badge variant="destructive" className="h-4 text-xs px-1.5 animate-pulse">
                  {dm.unread}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-chat-sidebar-hover animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <div className="flex items-center gap-2 group">
          <div className="h-8 w-8 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow transition-all duration-300 group-hover:shadow-medium group-hover:scale-110">
            <Users className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">You</div>
            <div className="text-xs text-chat-sidebar-foreground/50">Active</div>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-chat-sidebar-hover transition-all duration-200 hover:scale-110 hover:rotate-12">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;