import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Key, ExternalLink, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { GeminiService } from '@/services/GeminiService';
import { useToast } from '@/hooks/use-toast';

interface ApiKeySetupProps {
  onApiKeyConfigured: () => void;
}

export const ApiKeySetup = ({ onApiKeyConfigured }: ApiKeySetupProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const { toast } = useToast();

  const handleApiKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key",
        variant: "destructive",
      });
      return;
    }

    setIsTestingKey(true);
    setKeyStatus('idle');

    try {
      const isValid = await GeminiService.testApiKey(apiKey.trim());
      
      if (isValid) {
        GeminiService.saveApiKey(apiKey.trim());
        setKeyStatus('valid');
        toast({
          title: "API Key Configured!",
          description: "Gemini Pro is now ready for enhanced recommendations",
        });
        setTimeout(() => {
          onApiKeyConfigured();
        }, 1500);
      } else {
        setKeyStatus('invalid');
        toast({
          title: "Invalid API Key",
          description: "Please check your Gemini API key and try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      setKeyStatus('invalid');
      toast({
        title: "Connection Failed",
        description: "Unable to verify API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTestingKey(false);
    }
  };

  const skipForNow = () => {
    toast({
      title: "Using Basic Mode",
      description: "You can always add Gemini Pro later for enhanced recommendations",
    });
    onApiKeyConfigured();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-background">
      <Card className="w-full max-w-2xl bg-gradient-card border-border/50 shadow-luxury">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4">
              <Key className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Enhanced AI Recommendations</h1>
            <p className="text-muted-foreground text-lg">
              Configure Gemini Pro for personalized, conversational styling advice
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/20 border border-border/30">
              <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Multimodal Analysis</h3>
                <p className="text-xs text-muted-foreground">
                  Analyzes hair texture, density, and styling context from your photo
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/20 border border-border/30">
              <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Natural Language</h3>
                <p className="text-xs text-muted-foreground">
                  Conversational advice that goes beyond template responses
                </p>
              </div>
            </div>
          </div>

          {/* API Key Form */}
          <form onSubmit={handleApiKeySubmit} className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="apiKey" className="text-base font-medium">
                  Gemini API Key
                </Label>
                <Badge variant="secondary" className="text-xs">
                  Stored locally
                </Badge>
              </div>
              
              <div className="relative">
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="pr-12"
                  disabled={isTestingKey}
                />
                {keyStatus === 'valid' && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
                {keyStatus === 'invalid' && (
                  <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-destructive" />
                )}
              </div>
            </div>

            <Alert className="border-border/50 bg-muted/20">
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Privacy:</strong> Your API key is stored locally in your browser and never sent to our servers. 
                For production use, we recommend connecting to Supabase for secure secret management.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                disabled={isTestingKey || !apiKey.trim()}
                className="flex-1"
              >
                {isTestingKey ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2" />
                    Testing Connection...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Configure Gemini Pro
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="secondary"
                onClick={skipForNow}
                disabled={isTestingKey}
                className="flex-1 sm:flex-none"
              >
                Skip for Now
              </Button>
            </div>
          </form>

          {/* Get API Key Link */}
          <div className="mt-8 pt-6 border-t border-border/30">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Don't have a Gemini API key yet?
              </p>
              <Button variant="outline" size="sm" asChild>
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Get Free API Key
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};