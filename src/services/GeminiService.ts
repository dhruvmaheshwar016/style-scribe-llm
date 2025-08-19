import { GoogleGenerativeAI } from '@google/generative-ai';

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
  reasoning: string;
  maintenance: string;
  styling_products: string[];
}

export class GeminiService {
  private static API_KEY_STORAGE_KEY = 'gemini_api_key';
  private static genAI: GoogleGenerativeAI | null = null;

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    this.genAI = new GoogleGenerativeAI(apiKey);
    console.log('Gemini API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      const testGenAI = new GoogleGenerativeAI(apiKey);
      const model = testGenAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const result = await model.generateContent('Test connection');
      return !!result.response;
    } catch (error) {
      console.error('Error testing Gemini API key:', error);
      return false;
    }
  }

  static async generateStyleRecommendations(
    analysis: FaceAnalysis,
    userPhoto?: string,
    preferences?: {
      lifestyle?: string;
      maintenance_level?: string;
      style_preference?: string;
    }
  ): Promise<StyleRecommendation[]> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Gemini API key not found');
    }

    if (!this.genAI) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }

    try {
      const model = this.genAI.getGenerativeModel({ 
        model: userPhoto ? 'gemini-pro-vision' : 'gemini-pro' 
      });

      const prompt = this.buildPrompt(analysis, preferences);
      
      let result;
      if (userPhoto) {
        // Use vision model for multimodal analysis
        const imagePart = {
          inlineData: {
            data: userPhoto.split(',')[1], // Remove data:image/jpeg;base64, prefix
            mimeType: 'image/jpeg',
          },
        };
        result = await model.generateContent([prompt, imagePart]);
      } else {
        result = await model.generateContent(prompt);
      }

      const response = result.response.text();
      return this.parseRecommendations(response);
      
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw new Error('Failed to generate personalized recommendations');
    }
  }

  private static buildPrompt(
    analysis: FaceAnalysis,
    preferences?: {
      lifestyle?: string;
      maintenance_level?: string;
      style_preference?: string;
    }
  ): string {
    return `
You are an expert hair stylist and barber with 20+ years of experience. Analyze the following face shape data and provide personalized hair and beard style recommendations.

**Face Analysis Data:**
- Face Shape: ${analysis.faceShape}
- Confidence: ${Math.round(analysis.confidence * 100)}%
- Jawline: ${analysis.features.jawline}
- Cheekbones: ${analysis.features.cheekbones}
- Forehead: ${analysis.features.forehead}

${preferences ? `
**User Preferences:**
- Lifestyle: ${preferences.lifestyle || 'Not specified'}
- Maintenance Level: ${preferences.maintenance_level || 'Not specified'}
- Style Preference: ${preferences.style_preference || 'Not specified'}
` : ''}

**Instructions:**
1. Provide 3-4 hair style recommendations and 2-3 beard style recommendations
2. Each recommendation should include:
   - Name of the style
   - Detailed description (2-3 sentences)
   - Suitability score (80-98)
   - 3-4 specific styling tips
   - Professional reasoning (why this works for their face shape)
   - Maintenance requirements
   - Recommended styling products

3. Consider:
   - How each style complements their specific face shape
   - Professional and casual styling options
   - Modern trends that work with classic principles
   - Realistic maintenance expectations

4. If you can see their photo, also consider:
   - Hair texture and density
   - Current hair length and condition
   - Skin tone and complexion
   - Overall facial structure beyond just shape

**Output Format (JSON):**
{
  "recommendations": [
    {
      "id": "unique-id",
      "name": "Style Name",
      "category": "hair" or "beard",
      "description": "Detailed description...",
      "suitability": 85-98,
      "tips": ["tip1", "tip2", "tip3"],
      "reasoning": "Professional explanation...",
      "maintenance": "Maintenance description...",
      "styling_products": ["product1", "product2"]
    }
  ]
}

Provide expert-level, personalized advice that goes beyond generic recommendations. Make it conversational and helpful.
`;
  }

  private static parseRecommendations(response: string): StyleRecommendation[] {
    try {
      // Extract JSON from response (handle potential markdown formatting)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.recommendations || [];
    } catch (error) {
      console.error('Error parsing recommendations:', error);
      
      // Fallback: Create basic recommendations if parsing fails
      return this.createFallbackRecommendations();
    }
  }

  private static createFallbackRecommendations(): StyleRecommendation[] {
    return [
      {
        id: 'fallback-1',
        name: 'Classic Professional Cut',
        category: 'hair',
        description: 'A timeless, versatile style that works for any occasion',
        suitability: 85,
        tips: ['Regular trims every 4-6 weeks', 'Use quality pomade', 'Style with a side part'],
        reasoning: 'Safe choice that complements most face shapes',
        maintenance: 'Low to medium maintenance',
        styling_products: ['Pomade', 'Hair tonic']
      },
      {
        id: 'fallback-2',
        name: 'Well-Groomed Beard',
        category: 'beard',
        description: 'Clean, shaped beard that adds definition',
        suitability: 88,
        tips: ['Trim weekly', 'Use beard oil', 'Define the neckline'],
        reasoning: 'Adds structure and masculinity to facial features',
        maintenance: 'Medium maintenance',
        styling_products: ['Beard oil', 'Beard balm']
      }
    ];
  }

  static async enhanceWithPersonalAdvice(
    recommendations: StyleRecommendation[],
    userContext?: string
  ): Promise<{ advice: string; tips: string[] }> {
    const apiKey = this.getApiKey();
    if (!apiKey || !this.genAI) {
      return {
        advice: "Based on your face shape, these styles will enhance your natural features beautifully.",
        tips: ["Consult with a professional stylist", "Start with small changes", "Consider your lifestyle"]
      };
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `
As an expert stylist, provide personalized advice for someone who received these style recommendations:

${recommendations.map(r => `- ${r.name} (${r.category}): ${r.description}`).join('\n')}

${userContext ? `Additional context: ${userContext}` : ''}

Provide:
1. A warm, encouraging paragraph of personalized advice (2-3 sentences)
2. 5 practical tips for implementing these styles

Keep it conversational, supportive, and actionable. Format as JSON:
{
  "advice": "your personalized advice...",
  "tips": ["tip1", "tip2", "tip3", "tip4", "tip5"]
}
`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error generating personal advice:', error);
    }

    return {
      advice: "These carefully selected styles will perfectly complement your unique features and enhance your natural look.",
      tips: [
        "Book a consultation with an experienced stylist",
        "Bring reference photos to your appointment",
        "Start with subtle changes and adjust gradually",
        "Invest in quality styling products",
        "Maintain regular grooming appointments"
      ]
    };
  }
}