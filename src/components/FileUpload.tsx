import React, { useState, useCallback } from 'react';
import { Upload, File, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import knowledgeService from '../services/knowledgeService';

interface FileUploadProps {
  onUploadSuccess?: (result: any) => void;
  onUploadError?: (error: string) => void;
}

interface UploadedFile {
  file: File;
  status: 'uploading' | 'success' | 'error';
  result?: any;
  error?: string;
  progress?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess, onUploadError }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const acceptedTypes = {
    'application/pdf': '.pdf',
    'text/plain': '.txt',
    'text/markdown': '.md',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx'
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    // Filter accepted file types
    const validFiles = fileArray.filter(file => 
      Object.keys(acceptedTypes).includes(file.type) || 
      Object.values(acceptedTypes).some(ext => file.name.endsWith(ext))
    );

    if (validFiles.length !== fileArray.length) {
      onUploadError?.('Some files were rejected. Only PDF, TXT, MD, and DOCX files are allowed.');
    }

    // Add files to upload queue
    const newFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      status: 'uploading' as const,
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Upload each file
    for (let i = 0; i < newFiles.length; i++) {
      const uploadedFile = newFiles[i];
      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadedFiles(prev => prev.map(f => 
            f.file === uploadedFile.file 
              ? { ...f, progress: Math.min((f.progress || 0) + 10, 90) }
              : f
          ));
        }, 200);

        const result = await knowledgeService.uploadDocument(uploadedFile.file);
        
        clearInterval(progressInterval);
        
        setUploadedFiles(prev => prev.map(f => 
          f.file === uploadedFile.file 
            ? { ...f, status: 'success', result, progress: 100 }
            : f
        ));

        onUploadSuccess?.(result);
      } catch (error) {
        setUploadedFiles(prev => prev.map(f => 
          f.file === uploadedFile.file 
            ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Upload failed' }
            : f
        ));

        onUploadError?.(error instanceof Error ? error.message : 'Upload failed');
      }
    }
  }, [onUploadSuccess, onUploadError]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles(prev => prev.filter(f => f.file !== fileToRemove));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card className={`border-2 border-dashed transition-colors ${
        dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
      }`}>
        <CardContent className="p-8">
          <div
            className="text-center cursor-pointer"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <Upload className={`mx-auto h-12 w-12 mb-4 ${
              dragActive ? 'text-blue-500' : 'text-gray-400'
            }`} />
            <h3 className="text-lg font-semibold mb-2">
              {dragActive ? 'Drop files here' : 'Upload Documents'}
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop files here, or click to select files
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {Object.values(acceptedTypes).map(ext => (
                <Badge key={ext} variant="secondary" className="text-xs">
                  {ext.toUpperCase()}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              Maximum file size: 10MB per file
            </p>
          </div>
          
          <input
            id="file-input"
            type="file"
            multiple
            accept={Object.keys(acceptedTypes).join(',')}
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </CardContent>
      </Card>

      {/* Upload Queue */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="h-5 w-5" />
              Upload Queue ({uploadedFiles.length})
            </CardTitle>
            <CardDescription>
              Track your document upload progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {uploadedFiles.map((uploadedFile, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {uploadedFile.status === 'success' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {uploadedFile.status === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  {uploadedFile.status === 'uploading' && (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                  )}
                </div>
                
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{uploadedFile.file.name}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(uploadedFile.file)}
                      className="p-1 h-6 w-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{formatFileSize(uploadedFile.file.size)}</span>
                    <span>•</span>
                    <span>{uploadedFile.file.type || 'Unknown type'}</span>
                  </div>
                  
                  {uploadedFile.status === 'uploading' && uploadedFile.progress !== undefined && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadedFile.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {uploadedFile.progress}% uploaded
                      </p>
                    </div>
                  )}
                  
                  {uploadedFile.status === 'success' && uploadedFile.result && (
                    <Alert className="mt-2 bg-green-50 border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        {uploadedFile.result.message}
                        {uploadedFile.result.data?.summary && (
                          <div className="mt-1 text-sm">
                            <strong>Summary:</strong> {uploadedFile.result.data.summary}
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {uploadedFile.status === 'error' && (
                    <Alert className="mt-2 bg-red-50 border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        {uploadedFile.error || 'Upload failed'}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Upload Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <File className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">
                How Document Processing Works
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• PDF files: Text is extracted and processed automatically</li>
                <li>• Text files: Content is analyzed and categorized</li>
                <li>• Documents are added to the knowledge base for AI queries</li>
                <li>• Automatic keyword extraction and summary generation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUpload;
