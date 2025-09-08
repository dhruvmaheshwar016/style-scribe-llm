import { useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { FaceAnalyzer } from '@/components/FaceAnalyzer';
import { StyleRecommendations } from '@/components/StyleRecommendations';
import { TechnicalSpecs } from '@/components/TechnicalSpecs';
// Removed ApiKeySetup since API key is now from env
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings } from 'lucide-react';
import { GeminiService } from '@/services/GeminiService';

interface FaceAnalysis {
  faceShape: string;
  confidence: number;
  features: {
    jawline: string;
    cheekbones: string;
    forehead: string;
  };
  photoData?: string; // Base64 image data for Gemini analysis
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'hero' | 'analyze' | 'results'>('hero');
  const [analysis, setAnalysis] = useState<FaceAnalysis | null>(null);
  const [hasApiKey] = useState(!!GeminiService.getApiKey());

  const handleGetStarted = () => {
    setCurrentStep('analyze');
  };

  // Removed API key configuration flow

  const handleAnalysisComplete = (result: FaceAnalysis) => {
    setAnalysis(result);
    setCurrentStep('results');
  };

  const handleBack = () => {
    if (currentStep === 'results') {
      setCurrentStep('analyze');
    } else if (currentStep === 'analyze') {
      setCurrentStep('hero');
    }
  };

  // Removed API setup opener

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Navigation */}
      {currentStep !== 'hero' && (
        <div className="fixed top-6 left-6 z-50 flex gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleBack}
            className="rounded-full shadow-luxury"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          {/* Removed API Settings button */}
        </div>
      )}

      {/* Main Content */}
      {currentStep === 'hero' && (
        <>
          <HeroSection onGetStarted={handleGetStarted} />
          <TechnicalSpecs />
        </>
      )}

      {/* Removed API setup step */}

      {currentStep === 'analyze' && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-2xl">
            <FaceAnalyzer onAnalysisComplete={handleAnalysisComplete} />
          </div>
        </div>
      )}

      {currentStep === 'results' && analysis && (
        <div className="min-h-screen p-6 pt-20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Your Personalized Style Recommendations</h1>
              <p className="text-xl text-muted-foreground">
                {hasApiKey ? 'AI-enhanced analysis' : 'Basic analysis'} based on your {analysis.faceShape} face shape
              </p>
            </div>
            <StyleRecommendations analysis={analysis} useGemini={hasApiKey} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
