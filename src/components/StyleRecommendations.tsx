import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Scissors, Users, Star, Heart, Sparkles, MessageCircle, Loader2 } from 'lucide-react';
import { GeminiService } from '@/services/GeminiService';
import { useToast } from '@/hooks/use-toast';

interface FaceAnalysis {
  faceShape: string;
  confidence: number;
  features: {
    jawline: string;
    cheekbones: string;
    forehead: string;
  };
  photoData?: string;
}

interface StyleRecommendation {
  id: string;
  name: string;
  category: 'hair' | 'beard';
  description: string;
  suitability: number;
  tips: string[];
  reasoning?: string;
  maintenance?: string;
  styling_products?: string[];
}

interface StyleRecommendationsProps {
  analysis: FaceAnalysis;
  useGemini?: boolean;
}

export const StyleRecommendations = ({ analysis, useGemini = false }: StyleRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<StyleRecommendation[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<StyleRecommendation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [personalAdvice, setPersonalAdvice] = useState<{ advice: string; tips: string[] } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    generateRecommendations();
  }, [analysis, useGemini]);

  const generateRecommendations = async () => {
    setIsGenerating(true);
    
    try {
      if (useGemini && GeminiService.getApiKey()) {
        // Use Gemini Pro for enhanced recommendations
        const geminiRecommendations = await GeminiService.generateStyleRecommendations(
          analysis,
          analysis.photoData
        );
        
        if (geminiRecommendations.length > 0) {
          setRecommendations(geminiRecommendations);
          
          // Get personalized advice
          const advice = await GeminiService.enhanceWithPersonalAdvice(geminiRecommendations);
          setPersonalAdvice(advice);
          
          toast({
            title: "AI Analysis Complete!",
            description: "Generated personalized recommendations using Gemini Pro",
          });
        } else {
          // Fallback to basic recommendations
          generateBasicRecommendations();
        }
      } else {
        // Use basic recommendation logic
        generateBasicRecommendations();
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Using Basic Recommendations",
        description: "Enhanced AI features temporarily unavailable",
        variant: "destructive",
      });
      generateBasicRecommendations();
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBasicRecommendations = () => {
    const hairStyles = getHairRecommendations(analysis.faceShape);
    const beardStyles = getBeardRecommendations(analysis.faceShape);
    setRecommendations([...hairStyles, ...beardStyles]);
  };

  const getHairRecommendations = (faceShape: string): StyleRecommendation[] => {
    const baseStyles = {
      oval: [
        {
          id: 'oval-1',
          name: 'Classic Side Part',
          description: 'Timeless and versatile, works with any occasion',
          suitability: 95,
          tips: ['Use pomade for a polished look', 'Keep sides neat and trimmed'],
          imageUrl: '/api/placeholder/300/300'
        },
        {
          id: 'oval-2', 
          name: 'Textured Quiff',
          description: 'Modern style with volume and texture',
          suitability: 90,
          tips: ['Use texturizing clay', 'Blow dry upward for volume'],
          imageUrl: '/api/placeholder/300/300'
        }
      ],
      round: [
        {
          id: 'round-1',
          name: 'High Fade with Pompadour',
          description: 'Adds height and elongates the face',
          suitability: 88,
          tips: ['Keep sides very short', 'Style hair upward for height'],
          imageUrl: '/api/placeholder/300/300'
        },
        {
          id: 'round-2',
          name: 'Angular Fringe',
          description: 'Sharp angles to contrast round features',
          suitability: 85,
          tips: ['Cut fringe at an angle', 'Use matte styling product'],
          imageUrl: '/api/placeholder/300/300'
        }
      ],
      square: [
        {
          id: 'square-1',
          name: 'Soft Layers',
          description: 'Softens strong jawline with gentle curves',
          suitability: 92,
          tips: ['Ask for layered cut', 'Style with light product'],
          imageUrl: '/api/placeholder/300/300'
        },
        {
          id: 'square-2',
          name: 'Side-Swept Undercut',
          description: 'Modern cut that complements angular features',
          suitability: 87,
          tips: ['Keep one side longer', 'Use fiber for natural hold'],
          imageUrl: '/api/placeholder/300/300'
        }
      ],
      oblong: [
        {
          id: 'oblong-1',
          name: 'Medium Length Waves',
          description: 'Adds width and balances face proportions',
          suitability: 89,
          tips: ['Use sea salt spray', 'Scrunch for natural waves'],
          imageUrl: '/api/placeholder/300/300'
        }
      ]
    };

    return (baseStyles[faceShape as keyof typeof baseStyles] || baseStyles.oval).map(style => ({
      ...style,
      category: 'hair' as const
    }));
  };

  const getBeardRecommendations = (faceShape: string): StyleRecommendation[] => {
    const baseStyles = {
      oval: [
        {
          id: 'oval-beard-1',
          name: 'Full Beard',
          description: 'Classic full beard that maintains face balance',
          suitability: 93,
          tips: ['Trim regularly for shape', 'Use beard oil daily'],
          imageUrl: '/api/placeholder/300/300'
        }
      ],
      round: [
        {
          id: 'round-beard-1',
          name: 'Goatee',
          description: 'Lengthens face and adds definition',
          suitability: 88,
          tips: ['Keep chin hair longer', 'Trim sides shorter'],
          imageUrl: '/api/placeholder/300/300'
        }
      ],
      square: [
        {
          id: 'square-beard-1',
          name: 'Rounded Beard',
          description: 'Softens angular jawline',
          suitability: 90,
          tips: ['Round the corners', 'Keep well-groomed'],
          imageUrl: '/api/placeholder/300/300'
        }
      ],
      oblong: [
        {
          id: 'oblong-beard-1',
          name: 'Short Boxed Beard',
          description: 'Adds width without extra length',
          suitability: 87,
          tips: ['Keep short and wide', 'Define the neckline'],
          imageUrl: '/api/placeholder/300/300'
        }
      ]
    };

    return (baseStyles[faceShape as keyof typeof baseStyles] || baseStyles.oval).map(style => ({
      ...style,
      category: 'beard' as const
    }));
  };

  const hairStyles = recommendations.filter(r => r.category === 'hair');
  const beardStyles = recommendations.filter(r => r.category === 'beard');

  return (
    <div className="space-y-8">
      {/* Loading State */}
      {isGenerating && (
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <div className="p-8 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-lg font-medium">
                {useGemini ? 'Generating AI-enhanced recommendations...' : 'Analyzing your face shape...'}
              </span>
            </div>
            <p className="text-muted-foreground">
              {useGemini ? 'Our AI is crafting personalized styling advice just for you' : 'Creating your personalized style guide'}
            </p>
          </div>
        </Card>
      )}

      {/* Face Shape Summary */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-bold capitalize">{analysis.faceShape} Face Shape</h3>
                {useGemini && (
                  <Badge variant="secondary" className="gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Enhanced
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">
                {Math.round(analysis.confidence * 100)}% confidence match
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Jawline:</span>
              <p className="font-medium capitalize">{analysis.features.jawline}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Cheekbones:</span>
              <p className="font-medium capitalize">{analysis.features.cheekbones}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Forehead:</span>
              <p className="font-medium capitalize">{analysis.features.forehead}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Personal Advice (Gemini Enhanced) */}
      {personalAdvice && (
        <Card className="bg-gradient-accent/5 border-accent/20 shadow-card">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-6 h-6 text-accent" />
              <h3 className="text-lg font-bold">Personal Styling Advice</h3>
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </Badge>
            </div>
            
            <p className="text-foreground/90 mb-6 leading-relaxed">
              {personalAdvice.advice}
            </p>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Professional Tips
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {personalAdvice.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-2" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Style Recommendations */}
      {!isGenerating && recommendations.length > 0 && (
        <Tabs defaultValue="hair" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="hair" className="flex items-center gap-2">
              <Scissors className="w-4 h-4" />
              Hair Styles
            </TabsTrigger>
            <TabsTrigger value="beard" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Beard Styles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hair">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hairStyles.map((style) => (
                <StyleCard key={style.id} style={style} useGemini={useGemini} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="beard">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {beardStyles.map((style) => (
                <StyleCard key={style.id} style={style} useGemini={useGemini} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* No Gemini Alert */}
      {!useGemini && !isGenerating && (
        <Alert className="border-primary/20 bg-primary/5">
          <Sparkles className="h-4 w-4" />
          <AlertDescription>
            <strong>Want more personalized recommendations?</strong> Configure Gemini Pro API 
            for AI-enhanced styling advice with detailed reasoning and maintenance tips.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

// Enhanced Style Card Component
interface StyleCardProps {
  style: StyleRecommendation;
  useGemini: boolean;
}

const StyleCard = ({ style, useGemini }: StyleCardProps) => {
  return (
    <Card className="group hover:shadow-glow transition-all duration-300 cursor-pointer bg-gradient-card border-border/50">
      <div className="aspect-square bg-muted rounded-t-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="absolute inset-0 flex items-center justify-center">
          {style.category === 'hair' ? (
            <Scissors className="w-12 h-12 text-muted-foreground/50" />
          ) : (
            <Users className="w-12 h-12 text-muted-foreground/50" />
          )}
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="gap-1">
            <Star className="w-3 h-3" />
            {style.suitability}%
          </Badge>
        </div>
        {useGemini && (
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-3 h-3" />
              AI
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h4 className="font-bold text-lg mb-2">{style.name}</h4>
          <p className="text-muted-foreground text-sm mb-4">{style.description}</p>
        </div>
        
        {/* Enhanced content for Gemini recommendations */}
        {useGemini && style.reasoning && (
          <div className="space-y-3">
            <div>
              <h5 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Why This Works
              </h5>
              <p className="text-sm text-foreground/80">{style.reasoning}</p>
            </div>
            
            {style.styling_products && style.styling_products.length > 0 && (
              <div>
                <h5 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Recommended Products
                </h5>
                <div className="flex gap-1 flex-wrap">
                  {style.styling_products.map((product, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {product}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Basic styling tips */}
        <div>
          <h5 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide mb-2">
            Styling Tips
          </h5>
          <ul className="space-y-1">
            {style.tips.slice(0, 3).map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-xs">
                <div className="w-1 h-1 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Button size="sm" className="w-full">
          <Heart className="w-4 h-4 mr-2" />
          Save Style
        </Button>
      </div>
    </Card>
  );
};