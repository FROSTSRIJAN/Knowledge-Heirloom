import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Database, Upload, BarChart3, FileText, 
  Tag, Calendar, User, Download, RefreshCw, Sparkles
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import FileUpload from './FileUpload';
import DatasetIntegration from './DatasetIntegration';
import knowledgeService, { KnowledgeEntry, DatasetStats } from '../services/knowledgeService';

const KnowledgeDashboard: React.FC = () => {
  const [knowledgeEntries, setKnowledgeEntries] = useState<KnowledgeEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DatasetStats | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [initializingDatasets, setInitializingDatasets] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string>('');
  
  const pageSize = 10;

  // Load knowledge entries
  const loadKnowledge = async () => {
    setLoading(true);
    try {
      const result = await knowledgeService.getKnowledge({
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
        source: selectedSource || undefined,
        page: currentPage,
        limit: pageSize
      });
      
      setKnowledgeEntries(result.knowledge);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error('Failed to load knowledge:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load statistics and metadata
  const loadStats = async () => {
    try {
      const [statsResult, metadataResult] = await Promise.all([
        knowledgeService.getDatasetStats(),
        knowledgeService.getMetadata()
      ]);
      setStats(statsResult);
      setMetadata(metadataResult);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  // Initialize datasets
  const initializeDatasets = async () => {
    setInitializingDatasets(true);
    try {
      const result = await knowledgeService.initializeDatasets();
      setUploadSuccess(result.message);
      await loadKnowledge();
      await loadStats();
    } catch (error) {
      console.error('Failed to initialize datasets:', error);
    } finally {
      setInitializingDatasets(false);
    }
  };

  useEffect(() => {
    loadKnowledge();
  }, [searchQuery, selectedCategory, selectedSource, currentPage]);

  useEffect(() => {
    loadStats();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleUploadSuccess = (result: any) => {
    setUploadSuccess(result.message);
    loadKnowledge();
    loadStats();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSourceBadgeColor = (source: string) => {
    const colors: Record<string, string> = {
      'synthetic': 'bg-purple-100 text-purple-800',
      'kaggle': 'bg-blue-100 text-blue-800',
      'huggingface': 'bg-yellow-100 text-yellow-800',
      'upload': 'bg-green-100 text-green-800',
      'web-scraping': 'bg-orange-100 text-orange-800',
      'manual': 'bg-gray-100 text-gray-800'
    };
    return colors[source] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground mt-1">
            Manage datasets, upload documents, and explore AI-powered knowledge
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={initializeDatasets} 
            disabled={initializingDatasets}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {initializingDatasets ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            {initializingDatasets ? 'Initializing...' : 'Initialize Datasets'}
          </Button>
          <Button variant="outline" onClick={() => window.open('http://localhost:8081/api/demo/knowledge', '_blank')}>
            <Database className="h-4 w-4 mr-2" />
            View API
          </Button>
        </div>
      </div>

      {/* Success Alert */}
      {uploadSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <Sparkles className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {uploadSuccess}
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Database className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-900">Total Entries</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalEntries}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Tag className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-900">Categories</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.categories.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Upload className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-900">Data Sources</p>
                  <p className="text-2xl font-bold text-green-600">{stats.sources.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-orange-900">Avg. Priority</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {(knowledgeEntries.reduce((sum, entry) => sum + entry.priority, 0) / knowledgeEntries.length || 0).toFixed(1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse">Browse Knowledge</TabsTrigger>
          <TabsTrigger value="datasets">HuggingFace Datasets</TabsTrigger>
          <TabsTrigger value="upload">Upload Documents</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Browse Knowledge Tab */}
        <TabsContent value="browse" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search knowledge base..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {metadata?.categories.map((cat: any) => (
                      <SelectItem key={cat.name} value={cat.name}>
                        {cat.name} ({cat.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedSource} onValueChange={setSelectedSource}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All Sources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Sources</SelectItem>
                    {metadata?.sources.map((source: any) => (
                      <SelectItem key={source.name} value={source.name}>
                        {source.name} ({source.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Knowledge Entries */}
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading knowledge entries...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {knowledgeEntries.map((entry) => (
                <Card key={entry.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{entry.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {entry.summary || entry.content.substring(0, 150) + '...'}
                        </p>
                      </div>
                      <Badge className={getSourceBadgeColor(entry.source)}>
                        {entry.source}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Tag className="h-4 w-4" />
                          <span>{entry.category}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(entry.createdAt)}</span>
                        </div>
                        {entry.uploadedBy && (
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{entry.uploadedBy}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {entry.keyWords.slice(0, 3).map((keyword) => (
                          <Badge key={keyword} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalCount > pageSize && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4">
                  Page {currentPage} of {Math.ceil(totalCount / pageSize)}
                </span>
                <Button 
                  variant="outline"
                  disabled={currentPage >= Math.ceil(totalCount / pageSize)}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* HuggingFace Datasets Tab */}
        <TabsContent value="datasets">
          <DatasetIntegration 
            onIntegrationComplete={(count) => {
              setUploadSuccess(`Successfully integrated ${count} knowledge entries from HuggingFace datasets!`);
              loadKnowledge(); // Refresh the knowledge list
              loadStats(); // Refresh the stats
              setTimeout(() => setUploadSuccess(''), 5000);
            }}
          />
        </TabsContent>

        {/* Upload Tab */}
        <TabsContent value="upload">
          <FileUpload 
            onUploadSuccess={handleUploadSuccess}
            onUploadError={(error) => console.error('Upload error:', error)}
          />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {stats && (
            <>
              {/* Source Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Source Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of knowledge entries by data source
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.sources.map((source) => {
                      const percentage = (source.count / stats.totalEntries) * 100;
                      return (
                        <div key={source.source} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium capitalize">{source.source}</span>
                            <span>{source.count} entries ({percentage.toFixed(1)}%)</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                  <CardDescription>
                    Knowledge entries organized by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {stats.categories.map((category) => (
                      <div key={category.category} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{category.count}</div>
                        <div className="text-sm text-gray-600 capitalize">{category.category}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KnowledgeDashboard;
