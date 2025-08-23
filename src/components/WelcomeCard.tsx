import { Bot, FileText, Users, Zap, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const WelcomeCard = () => {
  return (
    <Card className="p-6 bg-gradient-card border-primary/20 shadow-medium">
      <div className="text-center mb-6">
        <div className="h-16 w-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
          <Bot className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Welcome to InternalDocs AI</h1>
        <p className="text-muted-foreground">
          Your retiring developer's final gift — an AI that makes company knowledge accessible forever
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 rounded-lg bg-background/50">
          <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
          <h3 className="font-semibold mb-1">Smart Search</h3>
          <p className="text-sm text-muted-foreground">
            Find any policy, process, or document instantly
          </p>
        </div>
        
        <div className="text-center p-4 rounded-lg bg-background/50">
          <Users className="h-8 w-8 text-accent mx-auto mb-2" />
          <h3 className="font-semibold mb-1">Context Aware</h3>
          <p className="text-sm text-muted-foreground">
            Answers tailored to your role and department
          </p>
        </div>
        
        <div className="text-center p-4 rounded-lg bg-background/50">
          <Zap className="h-8 w-8 text-warning mx-auto mb-2" />
          <h3 className="font-semibold mb-1">Proactive Help</h3>
          <p className="text-sm text-muted-foreground">
            Get suggestions and guidance before you ask
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="font-semibold text-center mb-3">Try asking me about:</h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            "HR Policies",
            "Design Guidelines", 
            "Tech Documentation",
            "Expense Claims",
            "PTO Requests",
            "Equipment Setup"
          ].map((topic) => (
            <Badge key={topic} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              {topic}
            </Badge>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 text-center">
        <Button className="bg-gradient-primary shadow-glow">
          Start Exploring <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
};

export default WelcomeCard;