import { useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { FaceAnalyzer } from '@/components/FaceAnalyzer';
import { StyleRecommendations } from '@/components/StyleRecommendations';
import { TechnicalSpecs } from '@/components/TechnicalSpecs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface FaceAnalysis {
  faceShape: string;
  confidence: number;
  features: {
    jawline: string;
    cheekbones: string;
    forehead: string;
  };
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'hero' | 'analyze' | 'results'>('hero');
  const [analysis, setAnalysis] = useState<FaceAnalysis | null>(null);

  const handleGetStarted = () => {
    setCurrentStep('analyze');
  };

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

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Navigation */}
      {currentStep !== 'hero' && (
        <div className="fixed top-6 left-6 z-50">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleBack}
            className="rounded-full shadow-luxury"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      )}

      {/* Main Content */}
      {currentStep === 'hero' && (
        <>
          <HeroSection onGetStarted={handleGetStarted} />
          <TechnicalSpecs />
        </>
      )}

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
                Based on your {analysis.faceShape} face shape analysis
              </p>
            </div>
            <StyleRecommendations analysis={analysis} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
