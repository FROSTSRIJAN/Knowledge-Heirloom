import React, { useState, useEffect } from 'react';
import { 
  Search, Database, Upload, FileText, 
  Calendar, User, RefreshCw, Sparkles, ArrowLeft
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from '../hooks/useAPI';
import { Link } from 'react-router-dom';

interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  summary?: string;
  category: string;
  source: string;
  fileType?: string;
  fileSize?: number;
  uploadedBy?: string;
  createdAt: string;
}

const SimpleKnowledgeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [knowledgeEntries, setKnowledgeEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string>('');

  // Mock knowledge entries for demo
  const loadMockKnowledge = () => {
    setLoading(true);
    setTimeout(() => {
      const mockEntries: KnowledgeEntry[] = [
        {
          id: '1',
          title: 'Company Handbook',
          content: 'Our comprehensive guide to working at Knowledge Heirloom...',
          summary: 'Guidelines for employees including policies, procedures, and benefits information.',
          category: 'documentation',
          source: 'upload',
          fileType: 'application/pdf',
          fileSize: 2048576,
          uploadedBy: 'Admin',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Development Best Practices',
          content: 'A collection of coding standards and best practices for our development team...',
          summary: 'Coding standards, git workflows, testing guidelines, and deployment procedures.',
          category: 'development',
          source: 'manual',
          uploadedBy: 'Senior Developer',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          title: 'API Documentation',
          content: 'Complete API reference for the Knowledge Heirloom platform...',
          summary: 'REST API endpoints, authentication, request/response formats, and examples.',
          category: 'technical',
          source: 'generated',
          uploadedBy: 'System',
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      setKnowledgeEntries(mockEntries);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    loadMockKnowledge();
  }, []);

  const filteredEntries = knowledgeEntries.filter(entry =>
    searchQuery === '' || 
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSourceBadgeColor = (source: string) => {
    const colors: Record<string, string> = {
      'upload': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'manual': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'generated': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'imported': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    };
    return colors[source] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / 1048576) + ' MB';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chat
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                <Database className="h-10 w-10 text-blue-400" />
                Knowledge Base
              </h1>
              <p className="text-gray-300 mt-2 text-lg">
                Explore company knowledge, documents, and development wisdom
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={loadMockKnowledge}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
            
            <Link to="/">
              <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                <Upload className="h-4 w-4 mr-2" />
                Upload Documents
              </Button>
            </Link>
          </div>
        </div>

        {/* Success Alert */}
        {uploadSuccess && (
          <Alert className="bg-green-900/50 border-green-500/50 backdrop-blur">
            <Sparkles className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-300">
              {uploadSuccess}
            </AlertDescription>
          </Alert>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-900/80 to-cyan-900/80 border-blue-500/30 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Database className="h-8 w-8 text-blue-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-200">Total Entries</p>
                  <p className="text-2xl font-bold text-blue-400">{knowledgeEntries.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-purple-500/30 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-purple-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-200">Documents</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {knowledgeEntries.filter(e => e.fileType).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-900/80 to-emerald-900/80 border-green-500/30 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-green-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-200">Contributors</p>
                  <p className="text-2xl font-bold text-green-400">
                    {new Set(knowledgeEntries.map(e => e.uploadedBy)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="bg-gray-800/80 border-gray-600/50 backdrop-blur">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search knowledge base..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Knowledge Entries */}
        {loading ? (
          <div className="text-center py-16">
            <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-400" />
            <p className="text-white text-lg">Loading knowledge entries...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredEntries.map((entry) => (
              <Card 
                key={entry.id} 
                className="bg-gray-800/80 border-gray-600/50 backdrop-blur hover:bg-gray-700/80 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-3 text-white flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-400" />
                        {entry.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {entry.summary || entry.content.substring(0, 150) + '...'}
                      </p>
                    </div>
                    <Badge className={getSourceBadgeColor(entry.source)}>
                      {entry.source}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-6">
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
                      {entry.fileSize && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>{formatFileSize(entry.fileSize)}</span>
                        </div>
                      )}
                    </div>
                    
                    <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">
                      {entry.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredEntries.length === 0 && !loading && (
              <Card className="bg-gray-800/80 border-gray-600/50 backdrop-blur">
                <CardContent className="p-12 text-center">
                  <Database className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                  <h3 className="text-xl font-semibold text-white mb-2">No knowledge entries found</h3>
                  <p className="text-gray-400 mb-6">
                    {searchQuery ? 'Try adjusting your search terms' : 'Upload documents or add knowledge to get started'}
                  </p>
                  <Link to="/">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Documents
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleKnowledgeDashboard;
