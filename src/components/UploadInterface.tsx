import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Link, CheckCircle, AlertCircle, X, Plus } from "lucide-react";

type UploadedFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'processed' | 'error';
  progress: number;
  error?: string;
  metadata?: {
    title?: string;
    authors?: string[];
    abstract?: string;
    citations?: number;
  };
};

export const UploadInterface = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [arxivUrl, setArxivUrl] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const validateFile = (file: File): string | null => {
    console.log('Validating file:', file.name, file.type, file.size);
    
    // Check file type
    if (file.type !== "application/pdf") {
      return "Please upload a PDF file.";
    }
    
    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return "File size must be less than 50MB.";
    }
    
    // Check if file has content
    if (file.size === 0) {
      return "File appears to be empty.";
    }
    
    return null;
  };

  const extractPDFMetadata = async (file: File): Promise<Partial<UploadedFile['metadata']>> => {
    // This is a placeholder for real PDF metadata extraction
    // In a real implementation, you'd use a library like pdf-lib or pdf2pic
    console.log('Extracting metadata from:', file.name);
    
    // Simulate metadata extraction
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      title: file.name.replace('.pdf', ''),
      authors: ['Author 1', 'Author 2'],
      abstract: 'This is a placeholder abstract extracted from the PDF...',
      citations: Math.floor(Math.random() * 10000),
    };
  };

  const processFile = async (file: File): Promise<void> => {
    const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    const uploadedFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: 'PDF',
      status: 'uploading',
      progress: 0,
    };

    setUploadedFiles(prev => [uploadedFile, ...prev]);
    console.log('Starting upload for:', file.name);

    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress } : f
        ));
      }

      // Update to processing status
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'processing', progress: 100 } : f
      ));

      // Extract metadata
      const metadata = await extractPDFMetadata(file);

      // Complete processing
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'processed', metadata } : f
      ));

      toast({
        title: "Upload successful",
        description: `${file.name} has been processed and added to your research graph.`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Upload failed'
        } : f
      ));

      toast({
        title: "Upload failed",
        description: `Failed to process ${file.name}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleFiles = async (files: FileList) => {
    console.log('Handling files:', files.length);
    setUploading(true);

    const validFiles: File[] = [];
    const errors: string[] = [];

    // Validate all files first
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    }

    // Show validation errors
    if (errors.length > 0) {
      toast({
        title: "Some files couldn't be uploaded",
        description: errors.join('\n'),
        variant: "destructive",
      });
    }

    // Process valid files
    try {
      await Promise.all(validFiles.map(file => processFile(file)));
    } finally {
      setUploading(false);
    }
  };

  const validateArxivUrl = (url: string): boolean => {
    const arxivPattern = /^https?:\/\/(arxiv\.org\/abs\/|arxiv\.org\/pdf\/|www\.arxiv\.org\/abs\/|www\.arxiv\.org\/pdf\/)\d{4}\.\d{4,5}(v\d+)?$/;
    const bioRxivPattern = /^https?:\/\/(www\.)?biorxiv\.org\/content\/\d{4}\/\d{2}\/\d{2}\/[\d\.\-]+v\d+$/;
    
    return arxivPattern.test(url) || bioRxivPattern.test(url);
  };

  const processArxivPaper = async (url: string): Promise<void> => {
    const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    const uploadedFile: UploadedFile = {
      id: fileId,
      name: 'arXiv Paper',
      size: 0,
      type: 'arXiv',
      status: 'uploading',
      progress: 0,
    };

    setUploadedFiles(prev => [uploadedFile, ...prev]);
    console.log('Processing arXiv URL:', url);

    try {
      // Simulate download and processing
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress } : f
        ));
      }

      // Simulate metadata extraction from arXiv
      const metadata = {
        title: 'Research Paper from arXiv',
        authors: ['Researcher A', 'Researcher B'],
        abstract: 'Abstract extracted from arXiv metadata...',
        citations: Math.floor(Math.random() * 5000),
      };

      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          status: 'processed', 
          metadata,
          name: metadata.title
        } : f
      ));

      toast({
        title: "arXiv import successful",
        description: `Paper has been imported and added to your research graph.`,
      });

    } catch (error) {
      console.error('arXiv processing error:', error);
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          status: 'error', 
          error: 'Failed to import from arXiv'
        } : f
      ));

      toast({
        title: "Import failed",
        description: "Failed to import paper from arXiv. Please check the URL and try again.",
        variant: "destructive",
      });
    }
  };

  const handleArxivUpload = async () => {
    if (!arxivUrl.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a valid arXiv or bioRxiv URL.",
        variant: "destructive",
      });
      return;
    }

    if (!validateArxivUrl(arxivUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid arXiv or bioRxiv URL (e.g., https://arxiv.org/abs/2301.12345).",
        variant: "destructive",
      });
      return;
    }
    
    setUploading(true);
    try {
      await processArxivPaper(arxivUrl);
      setArxivUrl("");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    toast({
      title: "File removed",
      description: "File has been removed from your uploads.",
    });
  };

  const retryUpload = async (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file) return;

    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: 'uploading', progress: 0, error: undefined } : f
    ));

    // For demonstration, we'll just simulate a retry
    // In a real app, you'd re-process the original file
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'processed', progress: 100 } : f
      ));
      
      toast({
        title: "Retry successful",
        description: "File has been processed successfully.",
      });
    } catch (error) {
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'error', error: 'Retry failed' } : f
      ));
    }
  };

  const recentUploads = [
    { name: "Attention Is All You Need", type: "PDF", status: "processed", citations: 45123 },
    { name: "BERT: Pre-training Deep Bidirectional Transformers", type: "arXiv", status: "processing", citations: 32456 },
    { name: "GPT-3: Language Models are Few-Shot Learners", type: "PDF", status: "processed", citations: 28934 },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Upload Research Papers</h1>
          <p className="text-xl text-muted-foreground">
            Add PDFs or arXiv papers to build your knowledge graph
          </p>
        </div>

        {/* Upload Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PDF Upload */}
          <Card className="p-8">
            <div className="text-center space-y-6">
              <div
                className={`border-2 border-dashed rounded-lg p-12 transition-all duration-300 ${
                  dragActive 
                    ? "border-primary bg-primary/5" 
                    : "border-muted-foreground/25 hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Drop PDF files here</h3>
                <p className="text-muted-foreground mb-4">
                  Or click to browse and select files
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Supports PDF files up to 50MB. Multiple files can be selected.
              </p>
            </div>
          </Card>

          {/* arXiv URL */}
          <Card className="p-8">
            <div className="space-y-6">
              <div className="text-center">
                <Link className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Import from arXiv</h3>
                <p className="text-muted-foreground">
                  Paste an arXiv URL to automatically import and analyze
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="arxiv-url">arXiv URL</Label>
                  <Input
                    id="arxiv-url"
                    placeholder="https://arxiv.org/abs/..."
                    value={arxivUrl}
                    onChange={(e) => setArxivUrl(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleArxivUpload}
                  disabled={!arxivUrl || uploading}
                  className="w-full"
                >
                  Import Paper
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Supports arXiv, bioRxiv, and other preprint servers
              </div>
            </div>
          </Card>
        </div>

        {/* Active Uploads */}
        {uploadedFiles.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Your Uploads</h3>
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <FileText className="w-8 h-8 text-primary mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium truncate">{file.name}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="ml-2 h-8 w-8 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                          <span>{file.type}</span>
                          {file.size > 0 && (
                            <>
                              <span>•</span>
                              <span>{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                            </>
                          )}
                          {file.metadata?.citations && (
                            <>
                              <span>•</span>
                              <span>{file.metadata.citations.toLocaleString()} citations</span>
                            </>
                          )}
                        </div>
                        
                        {file.status === 'uploading' && (
                          <div className="space-y-1">
                            <Progress value={file.progress} className="w-full h-2" />
                            <p className="text-xs text-muted-foreground">
                              Uploading... {file.progress}%
                            </p>
                          </div>
                        )}
                        
                        {file.status === 'processing' && (
                          <div className="space-y-1">
                            <Progress value={100} className="w-full h-2" />
                            <p className="text-xs text-muted-foreground">
                              Processing and extracting content...
                            </p>
                          </div>
                        )}
                        
                        {file.error && (
                          <div className="space-y-2">
                            <p className="text-xs text-destructive">{file.error}</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => retryUpload(file.id)}
                              className="h-8"
                            >
                              Retry
                            </Button>
                          </div>
                        )}
                        
                        {file.metadata?.abstract && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                            {file.metadata.abstract}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {file.status === "processed" && (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <Badge variant="secondary">Processed</Badge>
                        </>
                      )}
                      {file.status === "processing" && (
                        <>
                          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <Badge variant="outline">Processing</Badge>
                        </>
                      )}
                      {file.status === "uploading" && (
                        <>
                          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <Badge variant="outline">Uploading</Badge>
                        </>
                      )}
                      {file.status === "error" && (
                        <>
                          <AlertCircle className="w-5 h-5 text-destructive" />
                          <Badge variant="destructive">Error</Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Processing Info */}
        <Card className="p-6 bg-gradient-card">
          <h3 className="text-lg font-semibold mb-4">What happens next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-primary">1</span>
              </div>
              <h4 className="font-medium mb-2">Extract Content</h4>
              <p className="text-sm text-muted-foreground">
                AI analyzes text, figures, and references
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-primary">2</span>
              </div>
              <h4 className="font-medium mb-2">Build Connections</h4>
              <p className="text-sm text-muted-foreground">
                Links to existing papers and topics
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-primary">3</span>
              </div>
              <h4 className="font-medium mb-2">Generate Insights</h4>
              <p className="text-sm text-muted-foreground">
                Identifies gaps and opportunities
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};