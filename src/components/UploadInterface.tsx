import { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, AlertCircle, CheckCircle, X, Link2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadInterfaceProps {
  onPaperUploaded: (paperData: any) => void;
}

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'uploading' | 'processing' | 'success' | 'error';
  error?: string;
  paperData?: any;
}

export const UploadInterface = ({ onPaperUploaded }: UploadInterfaceProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [arXivUrl, setArXivUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Simulate paper analysis with realistic data
  const analyzePaper = async (file: File): Promise<any> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const paperTitles = [
      "Deep Learning Approaches for Climate Change Prediction",
      "Quantum Computing Applications in Cryptography",
      "CRISPR Gene Editing: Recent Advances and Ethical Considerations",
      "Sustainable Urban Development Through Smart City Technologies",
      "Machine Learning for Drug Discovery and Development",
      "Renewable Energy Integration in Smart Grids",
      "Artificial Intelligence in Medical Diagnosis",
      "Blockchain Technology for Supply Chain Management"
    ];

    const authors = [
      ["Smith, J.", "Johnson, A.", "Brown, M."],
      ["Davis, R.", "Wilson, K.", "Taylor, S.", "Anderson, L."],
      ["Garcia, M.", "Martinez, C.", "Rodriguez, A."],
      ["Lee, H.", "Kim, S.", "Park, J.", "Choi, M."],
      ["Thompson, E.", "White, D.", "Harris, N."]
    ];

    const categories = [
      "Machine Learning", "Climate Science", "Quantum Physics", 
      "Biotechnology", "Urban Planning", "Renewable Energy",
      "Computer Science", "Medical Research", "Blockchain"
    ];

    const randomTitle = paperTitles[Math.floor(Math.random() * paperTitles.length)];
    const randomAuthors = authors[Math.floor(Math.random() * authors.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    return {
      id: crypto.randomUUID(),
      title: randomTitle,
      authors: randomAuthors,
      year: 2020 + Math.floor(Math.random() * 4),
      category: randomCategory,
      pageCount: 8 + Math.floor(Math.random() * 20),
      abstract: `This paper presents novel approaches to ${randomTitle.toLowerCase()}. Our methodology demonstrates significant improvements over existing techniques, with implications for future research in this domain.`,
      keywords: ["artificial intelligence", "research", "innovation", "methodology"],
      citations: Math.floor(Math.random() * 100) + 10,
      researchGaps: [
        "Limited exploration of edge cases in the proposed methodology",
        "Need for larger scale validation studies",
        "Integration challenges with existing systems"
      ],
      keyInsights: [
        "Novel algorithmic approach shows 25% improvement over baseline",
        "Strong correlation identified between variables X and Y",
        "Proposed framework demonstrates scalability across domains"
      ],
      methodology: "Experimental study with comparative analysis",
      contribution: "Introduces new framework for solving complex optimization problems",
      limitations: "Study limited to specific domain, requires broader validation",
      fileName: file.name,
      fileSize: file.size,
      uploadDate: new Date().toISOString()
    };
  };

  const processFile = async (uploadFile: UploadFile) => {
    try {
      // Update progress during upload simulation
      setUploadFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, progress: 30, status: 'uploading' }
          : f
      ));

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Processing phase
      setUploadFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, progress: 60, status: 'processing' }
          : f
      ));

      const paperData = await analyzePaper(uploadFile.file);

      // Complete
      setUploadFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, progress: 100, status: 'success', paperData }
          : f
      ));

      onPaperUploaded(paperData);

    } catch (error) {
      setUploadFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'error', error: 'Failed to process file' }
          : f
      ));
      
      toast({
        title: "Upload Failed",
        description: `Failed to process ${uploadFile.file.name}`,
        variant: "destructive",
      });
    }
  };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter(file => {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not a PDF file`,
          variant: "destructive",
        });
        return false;
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds 50MB limit`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    const newUploadFiles: UploadFile[] = validFiles.map(file => ({
      file,
      id: crypto.randomUUID(),
      progress: 0,
      status: 'uploading'
    }));

    setUploadFiles(prev => [...prev, ...newUploadFiles]);

    // Start processing each file
    newUploadFiles.forEach(uploadFile => {
      processFile(uploadFile);
    });
  }, [onPaperUploaded, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleArXivUpload = async () => {
    if (!arXivUrl.trim()) return;

    // Basic arXiv URL validation
    const arXivPattern = /arxiv\.org\/(?:abs|pdf)\/(\d{4}\.\d{4,5})/;
    if (!arXivPattern.test(arXivUrl)) {
      toast({
        title: "Invalid arXiv URL",
        description: "Please enter a valid arXiv paper URL",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate arXiv paper fetch and analysis
      const mockArXivPaper = {
        id: crypto.randomUUID(),
        title: "Attention Is All You Need: Transformer Architecture Analysis",
        authors: ["Vaswani, A.", "Shazeer, N.", "Parmar, N.", "Uszkoreit, J."],
        year: 2017,
        category: "Machine Learning",
        pageCount: 15,
        abstract: "We propose a new simple network architecture, the Transformer, based solely on attention mechanisms...",
        keywords: ["transformer", "attention", "neural networks", "nlp"],
        citations: 45000,
        researchGaps: [
          "Limited analysis on computational efficiency",
          "Need for better understanding of attention patterns"
        ],
        keyInsights: [
          "Self-attention can replace recurrence and convolutions",
          "Parallel computation leads to significant speedup",
          "Transfer learning capabilities across domains"
        ],
        methodology: "Theoretical analysis with empirical validation",
        contribution: "Revolutionary architecture for sequence modeling",
        limitations: "May require large amounts of training data",
        fileName: "arxiv_paper.pdf",
        source: "arXiv",
        arXivId: arXivUrl.match(arXivPattern)?.[1],
        uploadDate: new Date().toISOString()
      };

      onPaperUploaded(mockArXivPaper);
      setArXivUrl("");
      
      toast({
        title: "arXiv Paper Added",
        description: "Paper successfully imported from arXiv",
      });
    } catch (error) {
      toast({
        title: "Failed to Import",
        description: "Could not import paper from arXiv",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-muted hover:border-primary/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="text-center py-12">
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Upload Research Papers</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop PDF files here, or click to select files
          </p>
          <Button 
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Choose Files
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            PDF files only • Max 50MB per file
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,application/pdf"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* arXiv URL Input */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Import from arXiv</h3>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="https://arxiv.org/abs/1706.03762"
              value={arXivUrl}
              onChange={(e) => setArXivUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleArXivUpload} disabled={!arXivUrl.trim()}>
              Import
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadFiles.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Upload Progress</h3>
            <div className="space-y-4">
              {uploadFiles.map((uploadFile) => (
                <div key={uploadFile.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium truncate">
                        {uploadFile.file.name}
                      </span>
                      <div className="flex items-center gap-2">
                        {uploadFile.status === 'success' && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                        {uploadFile.status === 'error' && (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(uploadFile.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {uploadFile.status !== 'error' && (
                      <Progress value={uploadFile.progress} className="h-2" />
                    )}
                    
                    <div className="flex items-center justify-between mt-1">
                      <Badge 
                        variant={
                          uploadFile.status === 'success' ? 'default' :
                          uploadFile.status === 'error' ? 'destructive' :
                          'secondary'
                        }
                        className="text-xs"
                      >
                        {uploadFile.status === 'uploading' && 'Uploading...'}
                        {uploadFile.status === 'processing' && 'Analyzing...'}
                        {uploadFile.status === 'success' && 'Complete'}
                        {uploadFile.status === 'error' && 'Failed'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {(uploadFile.file.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                    
                    {uploadFile.error && (
                      <p className="text-xs text-destructive mt-1">
                        {uploadFile.error}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};