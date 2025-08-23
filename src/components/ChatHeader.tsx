import { Hash, Star, Users, Settings, Info, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ChatHeaderProps {
  channelName: string;
  memberCount?: number;
  isOnline?: boolean;
}

const ChatHeader = ({ channelName, memberCount = 42, isOnline = true }: ChatHeaderProps) => {
  return (
    <div className="bg-background border-b border-border p-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">{channelName}</h2>
            {isOnline && (
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 bg-accent rounded-full" />
                <span className="text-sm text-muted-foreground">AI Active</span>
              </div>
            )}
          </div>
          
          <Badge variant="secondary" className="text-xs">
            <Users className="h-3 w-3 mr-1" />
            {memberCount}
          </Badge>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search in channel..."
              className="pl-9 w-64"
            />
          </div>

          <Button variant="ghost" size="sm">
            <Star className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Info className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Channel description */}
      <div className="mt-2 text-sm text-muted-foreground">
        Your intelligent AI assistant for company knowledge and documentation. 
        Ask questions, get instant answers, and discover resources you didn't know existed.
      </div>
    </div>
  );
};

export default ChatHeader;