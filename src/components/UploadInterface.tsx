import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Link, CheckCircle, AlertCircle } from "lucide-react";

export const UploadInterface = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [arxivUrl, setArxivUrl] = useState("");
  const { toast } = useToast();

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

  const handleFiles = (files: FileList) => {
    const file = files[0];
    if (file.type === "application/pdf") {
      simulateUpload(file.name);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
    }
  };

  const simulateUpload = (fileName: string) => {
    setUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          toast({
            title: "Upload successful",
            description: `${fileName} has been processed and added to your research graph.`,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleArxivUpload = () => {
    if (!arxivUrl) return;
    
    simulateUpload("arXiv Paper");
    setArxivUrl("");
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
                  type="file"
                  accept=".pdf"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer">
                    Choose Files
                  </Button>
                </Label>
              </div>
              
              {uploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    Processing... {uploadProgress}%
                  </p>
                </div>
              )}
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

        {/* Recent Uploads */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Recent Uploads</h3>
          <div className="space-y-4">
            {recentUploads.map((upload, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-4">
                  <FileText className="w-8 h-8 text-primary" />
                  <div>
                    <h4 className="font-medium">{upload.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{upload.type}</span>
                      <span>•</span>
                      <span>{upload.citations.toLocaleString()} citations</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {upload.status === "processed" ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-research-green" />
                      <Badge variant="secondary">Processed</Badge>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-research-orange" />
                      <Badge variant="outline">Processing</Badge>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

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