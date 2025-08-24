import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  authAPI, 
  conversationsAPI, 
  legacyAPI, 
  analyticsAPI, 
  healthAPI,
  User,
  Conversation,
  Message,
  LegacyMessage
} from '../services/api';
import { useToast } from './use-toast';

// Auth hooks
export const useAuth = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => 
      authAPI.login(email, password),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      toast({
        title: "Welcome back! 👋",
        description: `Hello ${data.user.name}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ name, email, password, role }: { 
      name: string; 
      email: string; 
      password: string; 
      role?: string;
    }) => authAPI.register(name, email, password, role),
    onSuccess: () => {
      toast({
        title: "Welcome to Knowledge Heirloom! 🎁",
        description: "Your account has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => authAPI.getMe().then(res => res.user),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const logout = () => {
    authAPI.logout();
    queryClient.clear();
    window.location.reload();
  };

  return {
    user,
    userLoading,
    login: loginMutation.mutate,
    loginLoading: loginMutation.isPending,
    register: registerMutation.mutate,
    registerLoading: registerMutation.isPending,
    logout,
  };
};

// Conversations hooks
export const useConversations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => conversationsAPI.getConversations().then(res => res.conversations),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const startConversationMutation = useMutation({
    mutationFn: ({ title, initialMessage }: { title?: string; initialMessage?: string }) =>
      conversationsAPI.startConversation(title, initialMessage),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast({
        title: "New conversation started! 💬",
        description: "Ready to help you with your questions.",
      });
      return data; // Return the data for use in components
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to start conversation",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    conversations: conversations || [],
    isLoading,
    startConversation: startConversationMutation.mutate,
    startConversationAsync: startConversationMutation.mutateAsync,
    startConversationLoading: startConversationMutation.isPending,
  };
};

export const useConversation = (conversationId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: conversation, isLoading } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => conversationId 
      ? conversationsAPI.getConversation(conversationId).then(res => res.conversation)
      : null,
    enabled: !!conversationId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({ content }: { content: string }) => {
      if (!conversationId) throw new Error('No conversation selected');
      return conversationsAPI.sendMessage(conversationId, content);
    },
    onSuccess: (data) => {
      // Update the conversation with new messages
      queryClient.setQueryData(['conversation', conversationId], (old: Conversation | undefined) => {
        if (!old) return old;
        return {
          ...old,
          messages: [
            ...(old.messages || []),
            data.userMessage,
            data.aiResponse,
          ],
        };
      });
      // Refresh conversations list to update last message
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    conversation,
    isLoading,
    messages: conversation?.messages || [],
    sendMessage: sendMessageMutation.mutate,
    sendMessageLoading: sendMessageMutation.isPending,
  };
};

// Legacy messages hooks
export const useLegacyMessages = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['legacyMessages'],
    queryFn: () => legacyAPI.getLegacyMessages(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  return {
    messages: data?.messages || [],
    totalCount: data?.totalCount || 0,
    isLoading,
  };
};

export const useDailyWisdom = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dailyWisdom'],
    queryFn: () => legacyAPI.getDailyWisdom(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return {
    wisdom: data?.message,
    isLoading,
  };
};

export const useCreateLegacyMessage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: {
      title: string;
      content?: string;
      category?: string;
      isPublic?: boolean;
      isSpecial?: boolean;
      generateWithAI?: boolean;
      aiPrompt?: string;
    }) => legacyAPI.createLegacyMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legacyMessages'] });
      toast({
        title: "Legacy message created! 🎁",
        description: "Your wisdom has been preserved for the next generation.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create legacy message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    createLegacyMessage: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
};

// Analytics hooks
export const useAnalytics = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => analyticsAPI.getDashboard(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    analytics: data?.analytics,
    isLoading,
  };
};

// Health check hook
export const useBackendHealth = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['backendHealth'],
    queryFn: () => healthAPI.checkBackend(),
    retry: 3,
    retryDelay: 1000,
    staleTime: 1000 * 30, // 30 seconds
  });

  return {
    isHealthy: !!data?.status,
    healthStatus: data,
    isLoading,
    error,
  };
};
