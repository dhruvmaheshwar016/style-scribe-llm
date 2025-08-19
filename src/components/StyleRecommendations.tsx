import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scissors, Users, Star, Heart } from 'lucide-react';

interface FaceAnalysis {
  faceShape: string;
  confidence: number;
  features: {
    jawline: string;
    cheekbones: string;
    forehead: string;
  };
}

interface StyleRecommendation {
  id: string;
  name: string;
  category: 'hair' | 'beard';
  description: string;
  suitability: number;
  tips: string[];
  imageUrl: string;
}

interface StyleRecommendationsProps {
  analysis: FaceAnalysis;
}

export const StyleRecommendations = ({ analysis }: StyleRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<StyleRecommendation[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<StyleRecommendation | null>(null);

  useEffect(() => {
    generateRecommendations();
  }, [analysis]);

  const generateRecommendations = () => {
    // Generate style recommendations based on face shape
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
      {/* Face Shape Summary */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold capitalize">{analysis.faceShape} Face Shape</h3>
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

      {/* Style Recommendations */}
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
              <Card 
                key={style.id}
                className="group hover:shadow-glow transition-all duration-300 cursor-pointer bg-gradient-card border-border/50"
                onClick={() => setSelectedStyle(style)}
              >
                <div className="aspect-square bg-muted rounded-t-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-primary opacity-10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Scissors className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="gap-1">
                      <Star className="w-3 h-3" />
                      {style.suitability}%
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-lg mb-2">{style.name}</h4>
                  <p className="text-muted-foreground text-sm mb-4">{style.description}</p>
                  <Button size="sm" className="w-full">
                    <Heart className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="beard">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {beardStyles.map((style) => (
              <Card 
                key={style.id}
                className="group hover:shadow-glow transition-all duration-300 cursor-pointer bg-gradient-card border-border/50"
                onClick={() => setSelectedStyle(style)}
              >
                <div className="aspect-square bg-muted rounded-t-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-accent opacity-10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="gap-1">
                      <Star className="w-3 h-3" />
                      {style.suitability}%
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-lg mb-2">{style.name}</h4>
                  <p className="text-muted-foreground text-sm mb-4">{style.description}</p>
                  <Button size="sm" className="w-full">
                    <Heart className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Style Detail Modal could go here */}
    </div>
  );
};