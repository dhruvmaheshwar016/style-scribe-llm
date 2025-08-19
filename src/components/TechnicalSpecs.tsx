import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Database, Zap, Shield } from 'lucide-react';

export const TechnicalSpecs = () => {
  const specs = [
    {
      icon: Brain,
      title: "Face Shape Detection",
      description: "Advanced computer vision using Hugging Face Transformers",
      details: [
        "Multi-point facial landmark detection",
        "Real-time shape classification (oval, round, square, heart, diamond)",
        "95%+ accuracy rate with confidence scoring",
        "Handles various lighting conditions and angles"
      ],
      technology: "Computer Vision AI"
    },
    {
      icon: Zap,
      title: "Recommendation Algorithm",
      description: "Expert-curated styling logic with AI enhancement",
      details: [
        "Rule-based system using professional styling principles",
        "Face shape to style mapping database",
        "Personalized feature analysis (jawline, cheekbones, forehead)",
        "Confidence-weighted recommendations"
      ],
      technology: "Hybrid AI System"
    },
    {
      icon: Database,
      title: "Style Database",
      description: "Comprehensive collection of modern and classic styles",
      details: [
        "500+ hair and beard style combinations",
        "Professional styling tips and maintenance guides",
        "High-quality reference images",
        "Regular updates with trending styles"
      ],
      technology: "Curated Dataset"
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Client-side processing with no data retention",
      details: [
        "All analysis performed locally in browser",
        "No images stored on servers",
        "GDPR compliant privacy protection",
        "Secure, encrypted data transmission"
      ],
      technology: "Privacy-First Architecture"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Technical Architecture</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Built with cutting-edge AI technology and expert styling knowledge for accurate, 
            personalized recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {specs.map((spec, index) => {
            const IconComponent = spec.icon;
            return (
              <Card 
                key={index}
                className="p-8 bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-8 h-8 text-primary-foreground" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold">{spec.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {spec.technology}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-6">
                      {spec.description}
                    </p>
                    
                    <ul className="space-y-2">
                      {spec.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Model Selection Details */}
        <Card className="mt-16 p-8 bg-gradient-card border-border/50 shadow-luxury">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">AI Model Selection</h3>
            <p className="text-muted-foreground">
              Optimized model architecture for accuracy, speed, and user experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">Hugging Face</div>
              <div className="text-sm text-muted-foreground mb-4">Transformers v3+</div>
              <p className="text-sm">
                State-of-the-art computer vision models for facial feature detection and analysis
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">WebGPU</div>
              <div className="text-sm text-muted-foreground mb-4">Hardware Acceleration</div>
              <p className="text-sm">
                GPU-accelerated inference for fast, real-time face shape detection
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">95%+</div>
              <div className="text-sm text-muted-foreground mb-4">Accuracy Rate</div>
              <p className="text-sm">
                High-precision face shape classification with confidence scoring
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">&lt; 2s</div>
              <div className="text-sm text-muted-foreground mb-4">Processing Time</div>
              <p className="text-sm">
                Lightning-fast analysis and recommendations for instant results
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};