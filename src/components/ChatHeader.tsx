import { Gift, Database, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "@/services/api";
import { Link } from "react-router-dom";
interface ChatHeaderProps {
  channelName: string;
  user?: User;
}
const ChatHeader = ({ channelName, user }: ChatHeaderProps) => {
  return (
    <div className="bg-background border-b border-border p-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center p-1">
              <img 
                src="/autobot-from-transformers-logo-png-transparent.png" 
                alt="Knowledge Heirloom Logo" 
                className="h-5 w-5"
              />
            </div>
            <h2 className="text-lg font-semibold text-white">{channelName}</h2>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-green-400">AI Ready</span>
            </div>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-white text-sm">{user.name}</span>
              <Badge variant="outline" className="text-xs border-blue-400 text-blue-400">
                {user.role === 'SENIOR_DEV' ? 'Senior Dev' : user.role === 'ADMIN' ? 'Admin' : 'Employee'}
              </Badge>
            </div>
          )}
          <Link to="/knowledge">
            <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
              <Database className="h-4 w-4 mr-2" />
              Knowledge Base
            </Button>
          </Link>
        </div>
      </div>
      {/* Simple description */}
      <div className="mt-2 text-sm text-gray-400">
        {user ? 
          `Welcome ${user.name}! Your intelligent AI assistant powered by Gemini AI. Ask anything!` : 
          "Your intelligent AI assistant for company knowledge and documentation."
        }
      </div>
    </div>
  );
};

export default ChatHeader;
