import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Scissors } from 'lucide-react';
import heroImage from '@/assets/hero-bg.jpg';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Professional barbershop interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8 shadow-glow">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Style Analysis</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
            Perfect Your Look
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-foreground/90">
            AI-Powered Hair & Beard Styling
          </h2>
          
          {/* Description */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover personalized hair and beard styles that perfectly complement your unique face shape. 
            Our advanced AI analyzes your features to recommend the most flattering looks.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg"
              onClick={onGetStarted}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6 rounded-full"
            >
              <Scissors className="w-5 h-5 mr-2" />
              Get My Style Analysis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="secondary" 
              size="lg"
              className="text-lg px-8 py-6 rounded-full border-border/50 hover:border-primary/50 transition-all duration-300"
            >
              View Sample Results
            </Button>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">AI Face Analysis</h3>
              <p className="text-muted-foreground">
                Advanced computer vision identifies your unique face shape and features
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
                <Scissors className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-bold text-lg mb-2">Expert Recommendations</h3>
              <p className="text-muted-foreground">
                Curated style suggestions from professional barbers and stylists
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Instant Results</h3>
              <p className="text-muted-foreground">
                Get personalized styling advice in seconds, not hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};