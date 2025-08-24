import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Download, 
  Brain, 
  BookOpen, 
  MessageSquare, 
  Code,
  Zap,
  CheckCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';

interface Dataset {
  name: string;
  splits: string[];
  description: string;
  category: string;
  useCase: string;
}

interface DatasetIntegrationProps {
  onIntegrationComplete?: (count: number) => void;
}

const DatasetIntegration: React.FC<DatasetIntegrationProps> = ({ onIntegrationComplete }) => {
  const [loading, setLoading] = useState(false);
  const [integratedDatasets, setIntegratedDatasets] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>('');

  // Recommended datasets based on user's requirements
  const recommendedDatasets: Dataset[] = [
    {
      name: "nyu-mll/glue",
      splits: ["cola", "mnli", "ax"],
      description: "General Language Understanding Evaluation (GLUE) benchmark - excellent for NLP tasks",
      category: "NLP",
      useCase: "Language understanding, text classification, sentiment analysis"
    },
    {
      name: "squad",
      splits: ["train", "validation"],
      description: "Stanford Question Answering Dataset - perfect for Q&A systems",
      category: "Question Answering",
      useCase: "Building chatbots and Q&A systems like Knowledge Heirloom"
    },
    {
      name: "wikipedia",
      splits: ["20220301.en"],
      description: "Wikipedia articles - vast knowledge base",
      category: "Knowledge Base",
      useCase: "General knowledge, fact-checking, information retrieval"
    },
    {
      name: "eli5",
      splits: ["train_asks", "validation_asks"],
      description: "Explain Like I'm 5 - complex topics explained simply",
      category: "Educational",
      useCase: "Making complex topics accessible to beginners"
    },
    {
      name: "natural_questions",
      splits: ["train", "validation"],
      description: "Real questions from Google search with Wikipedia answers",
      category: "Question Answering",
      useCase: "Natural language Q&A systems"
    },
    {
      name: "commonsense_qa",
      splits: ["train", "validation"],
      description: "Common sense reasoning questions",
      category: "Reasoning",
      useCase: "Building AI that understands common sense"
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'NLP': return <Brain className="h-4 w-4" />;
      case 'Question Answering': return <MessageSquare className="h-4 w-4" />;
      case 'Knowledge Base': return <BookOpen className="h-4 w-4" />;
      case 'Educational': return <BookOpen className="h-4 w-4" />;
      case 'Programming': return <Code className="h-4 w-4" />;
      case 'Reasoning': return <Brain className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'NLP': return 'bg-blue-500';
      case 'Question Answering': return 'bg-green-500';
      case 'Knowledge Base': return 'bg-purple-500';
      case 'Educational': return 'bg-orange-500';
      case 'Programming': return 'bg-gray-500';
      case 'Reasoning': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const handleQuickSetup = async () => {
    setLoading(true);
    setProgress(0);
    setStatus('Initializing quick setup with recommended datasets...');

    try {
      const response = await fetch('http://localhost:8081/api/datasets/quick-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result = await response.json();
        setProgress(100);
        setStatus(`✅ Quick setup completed! Integrated ${result.totalIntegrated} knowledge entries`);
        setIntegratedDatasets(prev => [...prev, 'Quick Setup Collection']);
        onIntegrationComplete?.(result.totalIntegrated);
      } else {
        setStatus('❌ Quick setup failed. Please try again.');
      }
    } catch (error) {
      setStatus('❌ Error during quick setup. Make sure the backend is running.');
      console.error('Quick setup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDatasetIntegration = async (dataset: Dataset, split: string) => {
    setLoading(true);
    setStatus(`Loading ${dataset.name}/${split}...`);

    try {
      const response = await fetch('http://localhost:8081/api/datasets/huggingface/load', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          datasetName: dataset.name,
          split: split,
          limit: 50,
          integrate: true
        })
      });

      if (response.ok) {
        const result = await response.json();
        setStatus(`✅ Integrated ${result.data.sampleCount} entries from ${dataset.name}/${split}`);
        setIntegratedDatasets(prev => [...prev, `${dataset.name}/${split}`]);
        onIntegrationComplete?.(result.data.sampleCount);
      } else {
        setStatus(`❌ Failed to integrate ${dataset.name}/${split}`);
      }
    } catch (error) {
      setStatus('❌ Integration error. Check backend connection.');
      console.error('Integration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">HuggingFace Dataset Integration</h2>
        <p className="text-muted-foreground">
          Enhance Knowledge Heirloom with curated datasets from HuggingFace Hub
        </p>
      </div>

      {/* Quick Setup Section */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Quick Setup
          </CardTitle>
          <CardDescription>
            Get started instantly with a curated collection of the best datasets for Knowledge Heirloom
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">What's included in Quick Setup:</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• GLUE benchmark for NLP understanding</li>
                <li>• SQuAD for question-answering capabilities</li>
                <li>• Wikipedia knowledge articles</li>
                <li>• ELI5 for simple explanations</li>
                <li>• ~100 high-quality knowledge entries</li>
              </ul>
            </div>
            
            {progress > 0 && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground">{status}</p>
              </div>
            )}
            
            <Button 
              onClick={handleQuickSetup}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up datasets...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Start Quick Setup
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Individual Datasets */}
      <Tabs defaultValue="recommended" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recommended">Recommended Datasets</TabsTrigger>
          <TabsTrigger value="integrated">Integrated ({integratedDatasets.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recommended" className="space-y-4">
          <div className="grid gap-4">
            {recommendedDatasets.map((dataset) => (
              <Card key={dataset.name} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getCategoryColor(dataset.category)}`} />
                      <CardTitle className="text-lg">{dataset.name}</CardTitle>
                      <Badge variant="outline" className="ml-2">
                        {getCategoryIcon(dataset.category)}
                        <span className="ml-1">{dataset.category}</span>
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`https://huggingface.co/datasets/${dataset.name}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription className="mt-2">
                    {dataset.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Use Case:</p>
                      <p className="text-sm text-gray-600">{dataset.useCase}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Available Splits:</p>
                      <div className="flex flex-wrap gap-2">
                        {dataset.splits.map((split) => (
                          <Button
                            key={split}
                            variant="outline"
                            size="sm"
                            onClick={() => handleDatasetIntegration(dataset, split)}
                            disabled={loading || integratedDatasets.includes(`${dataset.name}/${split}`)}
                            className="text-xs"
                          >
                            {integratedDatasets.includes(`${dataset.name}/${split}`) ? (
                              <>
                                <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                                {split}
                              </>
                            ) : loading ? (
                              <>
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                {split}
                              </>
                            ) : (
                              <>
                                <Download className="mr-1 h-3 w-3" />
                                {split}
                              </>
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="integrated" className="space-y-4">
          {integratedDatasets.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Database className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-center">
                  No datasets integrated yet.<br />
                  Use Quick Setup or integrate individual datasets to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {integratedDatasets.map((dataset, index) => (
                <Card key={index} className="bg-green-50 border-green-200">
                  <CardContent className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium">{dataset}</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Integrated
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {status && (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm">{status}</p>
        </div>
      )}
    </div>
  );
};

export default DatasetIntegration;
