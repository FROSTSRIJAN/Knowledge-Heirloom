import { Bot, Clock, Brain, Cpu, Zap, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const TypingIndicator = () => {
  const neuralStatuses = [
    { icon: Brain, text: "Neural processing...", color: "text-electric" },
    { icon: Cpu, text: "Computing intelligence...", color: "text-primary" },
    { icon: Zap, text: "Analyzing patterns...", color: "text-accent" },
    { icon: Activity, text: "Synthesizing response...", color: "text-success" }
  ];

  const currentStatus = neuralStatuses[Math.floor(Date.now() / 2000) % neuralStatuses.length];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="p-4 animate-fade-in">
      <Card className="card-premium border-l-4 border-l-electric neural-glow">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-electric/30">
              <AvatarFallback className="bg-gradient-neural text-white">
                <Bot className="h-5 w-5 neural-pulse" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold gradient-text">Knowledge Heirloom AI</span>
                <Badge className="bg-electric/10 text-electric border-electric/30">
                  <StatusIcon className="h-3 w-3 mr-1 neural-pulse" />
                  Neural Engine
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <StatusIcon className={`h-4 w-4 ${currentStatus.color} neural-pulse`} />
                <span className="text-sm text-muted-foreground animate-pulse">
                  {currentStatus.text}
                </span>
              </div>
              
              {/* Neural Network Visualization */}
              <div className="mt-3 flex items-center gap-1">
                <div className="flex space-x-1">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-2 w-2 bg-electric/60 rounded-full neural-pulse animate-bounce"
                      style={{
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: '1s'
                      }}
                    />
                  ))}
                </div>
                <div className="ml-2 text-xs text-muted-foreground">
                  Neural pathways active
                </div>
              </div>

              {/* Advanced Processing Indicators */}
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 bg-success rounded-full neural-pulse"></div>
                  <span className="text-muted-foreground">Context</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full neural-pulse" 
                       style={{ animationDelay: '0.5s' }}></div>
                  <span className="text-muted-foreground">Analysis</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 bg-accent rounded-full neural-pulse" 
                       style={{ animationDelay: '1s' }}></div>
                  <span className="text-muted-foreground">Synthesis</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TypingIndicator;