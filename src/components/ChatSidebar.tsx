import { Plus, MessageSquare, LogOut, Bot, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConversations } from "@/hooks/useAPI";
import { User } from "@/services/api";
interface ChatSidebarProps {
  user?: User;
  onLogout: () => void;
  onConversationSelect: (id: string) => void;
  currentConversationId: string | null;
}
const ChatSidebar = ({ user, onLogout, onConversationSelect, currentConversationId }: ChatSidebarProps) => {
  const { conversations, isLoading: conversationsLoading, startConversation, startConversationLoading } = useConversations();
  const handleStartNewConversation = () => {
    startConversation({ 
      title: "New Chat",
      initialMessage: "Hello! I'm ready to help with any questions you have."
    });
  };
  return (
    <div className="w-80 bg-gradient-to-b from-gray-900 to-black text-white flex flex-col h-full border-r border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <img 
            src="/autobot-from-transformers-logo-png-transparent.png" 
            alt="Knowledge Heirloom Logo" 
            className="h-6 w-6"
          />
          <span className="font-bold text-lg">Knowledge Heirloom</span>
        </div>
        <p className="text-xs text-gray-400">AI-powered knowledge companion</p>
      </div>
      {/* New Chat Button */}
      <div className="p-4">
        <Button 
          onClick={handleStartNewConversation}
          disabled={startConversationLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          {startConversationLoading ? 'Starting...' : 'New Chat'}
        </Button>
      </div>
      {/* Conversations */}
      <div className="flex-1 px-4 overflow-y-auto">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Recent Chats</h3>
        {conversationsLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 bg-gray-800 animate-pulse rounded"></div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No conversations yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onConversationSelect(conversation.id)}
                className={`p-3 rounded cursor-pointer transition-colors ${
                  currentConversationId === conversation.id 
                    ? 'bg-blue-600/20 border border-blue-500' 
                    : 'hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{conversation.title}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {conversation.messageCount} messages
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* User Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium">{user?.name || 'User'}</div>
              <div className="text-xs text-gray-400">Online</div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onLogout}
            className="text-gray-400 hover:text-white hover:bg-red-600"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
