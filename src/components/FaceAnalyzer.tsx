import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Camera, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FaceAnalysis {
  faceShape: string;
  confidence: number;
  features: {
    jawline: string;
    cheekbones: string;
    forehead: string;
  };
}

interface FaceAnalyzerProps {
  onAnalysisComplete: (analysis: FaceAnalysis) => void;
}

export const FaceAnalyzer = ({ onAnalysisComplete }: FaceAnalyzerProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageUrl = e.target?.result as string;
      setPreviewImage(imageUrl);
      await analyzeFace(imageUrl, file);
    };
    reader.readAsDataURL(file);
  };

  const analyzeFace = async (imageUrl: string, file: File) => {
    setIsAnalyzing(true);
    
    try {
      // Simulate AI face analysis - in real implementation, this would use computer vision
      // For demo purposes, we'll use a simplified approach
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis based on image dimensions as a placeholder
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        let faceShape = 'oval';
        
        if (aspectRatio > 1.1) faceShape = 'round';
        else if (aspectRatio < 0.9) faceShape = 'oblong';
        else if (Math.random() > 0.5) faceShape = 'square';
        
        const analysis: FaceAnalysis = {
          faceShape,
          confidence: 0.85 + Math.random() * 0.1,
          features: {
            jawline: faceShape === 'square' ? 'angular' : 'soft',
            cheekbones: faceShape === 'round' ? 'full' : 'defined',
            forehead: faceShape === 'oblong' ? 'high' : 'proportional'
          }
        };
        
        onAnalysisComplete(analysis);
        toast({
          title: "Analysis complete!",
          description: `Detected ${faceShape} face shape with ${Math.round(analysis.confidence * 100)}% confidence`,
        });
      };
      img.src = imageUrl;
      
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Please try again with a clearer image",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-card border-border/50 shadow-card">
      <div className="absolute inset-0 bg-gradient-primary opacity-5" />
      
      <div className="relative p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Face Shape Analysis</h2>
          <p className="text-muted-foreground">
            Upload your photo for personalized style recommendations
          </p>
        </div>

        {!previewImage ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-border/50 rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Drop your photo here</p>
            <p className="text-muted-foreground mb-4">or click to browse</p>
            <Button variant="secondary">
              <Camera className="w-4 h-4 mr-2" />
              Choose Photo
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative max-w-md mx-auto">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-auto rounded-lg shadow-luxury"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-sm font-medium">Analyzing face shape...</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button
                variant="secondary"
                onClick={() => {
                  setPreviewImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                disabled={isAnalyzing}
              >
                Try Another Photo
              </Button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </Card>
  );
};