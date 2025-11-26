import { GoogleGenAI, Type, Schema } from "@google/genai";
import { WeddingProfile, Task, Guest, Table, BudgetItem } from "../types";

const apiKey = process.env.API_KEY || '';
// Initialize normally for text/image generation.
// For Veo/High-quality image which requires user key selection, we re-init in component.
const ai = new GoogleGenAI({ apiKey });

/**
 * GENERATE INITIAL PLAN (Gemini 3 Pro)
 * Uses high intelligence to create a structured plan.
 */
export const generateWeddingPlan = async (profile: WeddingProfile): Promise<Task[]> => {
  const model = "gemini-3-pro-preview";
  
  const prompt = `
    Create a wedding planning checklist for a couple.
    Profile:
    - Style: ${profile.style}
    - Date: ${profile.date}
    - Budget: ${profile.budget}
    - Location: ${profile.location}
    
    Return a list of 10 critical tasks distributed over time.
    JSON format only.
  `;

  const responseSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        title: { type: Type.STRING },
        month: { type: Type.STRING },
        category: { type: Type.STRING, enum: ['legal', 'vendor', 'fashion', 'beauty', 'ceremony', 'party'] },
        completed: { type: Type.BOOLEAN },
      },
      required: ["id", "title", "month", "category", "completed"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as Task[];
  } catch (error) {
    console.error("Error generating plan:", error);
    return [];
  }
};

/**
 * GENERATE BUDGET BREAKDOWN (Gemini 2.5 Flash)
 * Fast estimation based on total budget.
 */
export const generateBudget = async (total: number, style: string): Promise<BudgetItem[]> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
    Create a budget breakdown for a wedding with total budget ${total} and style ${style}.
    Break it down into 5-8 major categories (Venue, Catering, Photography, etc.).
    JSON only.
  `;

  const responseSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        category: { type: Type.STRING },
        estimated: { type: Type.NUMBER },
        actual: { type: Type.NUMBER },
        paid: { type: Type.BOOLEAN },
      },
      required: ["id", "category", "estimated"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });
    
    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as BudgetItem[];
  } catch (e) {
    console.error(e);
    return [];
  }
};

/**
 * AI ANTI-TRETA (Gemini 3 Pro)
 * Intelligent seating arrangement.
 */
export const organizeTables = async (guests: Guest[]): Promise<Table[]> => {
  const model = "gemini-3-pro-preview";

  const guestData = JSON.stringify(guests.map(g => ({ name: g.name, category: g.category, conflicts: g.conflictPotential })));

  const prompt = `
    Organize these wedding guests into tables of 4-6 people.
    Maximize harmony. Avoid putting people with 'conflicts' at the same table.
    Group by category if it makes sense, but prioritize harmony.
    Guests: ${guestData}
    
    Explain the reasoning for each table composition briefly.
  `;

  const responseSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.INTEGER },
        name: { type: Type.STRING },
        guests: { 
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    category: { type: Type.STRING },
                    confirmed: { type: Type.BOOLEAN },
                    conflictPotential: { type: Type.ARRAY, items: { type: Type.STRING }}
                }
            }
        },
        reasoning: { type: Type.STRING }
      },
      required: ["id", "name", "guests", "reasoning"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 2048 }, // Use thinking to solve social logic
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as Table[];
  } catch (e) {
    console.error("Seating error", e);
    return [];
  }
};

/**
 * SOS EMERGENCY ADVICE (Gemini 2.5 Flash Lite)
 * Extremely fast response for emergencies.
 */
export const getEmergencyAdvice = async (problem: string): Promise<string> => {
  const model = "gemini-2.5-flash-lite-latest"; // Using lite for speed
  
  const prompt = `
    ACT AS A PROFESSIONAL WEDDING PLANNER IN CRISIS MODE.
    The bride has an emergency: "${problem}".
    Provide a calm, immediate "Plan B" solution in 3 bullet points.
    Keep it under 100 words. Be reassuring.
    Language: Portuguese.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "Mantenha a calma. Respire fundo. Tudo se resolverá.";
  } catch (e) {
    return "Erro de conexão. Tente respirar fundo e contate a cerimonialista.";
  }
};

/**
 * IMAGE GENERATION (Gemini 3 Pro Image)
 * Creates moodboard images.
 * REQUIRES USER SELECTED KEY IN COMPONENT, but helper here structures request.
 */
export const generateMoodboardImage = async (prompt: string, aspectRatio: string, userClient: GoogleGenAI): Promise<string | null> => {
  // We expect the caller to pass a client initialized with the user's selected key
  const model = 'gemini-3-pro-image-preview';
  
  try {
    const response = await userClient.models.generateContent({
        model,
        contents: {
            parts: [{ text: prompt }]
        },
        config: {
            imageConfig: {
                aspectRatio: aspectRatio as any, 
                imageSize: "1K"
            }
        }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    return null;
  } catch (e: any) {
    console.error("Image gen error details:", JSON.stringify(e));
    throw e;
  }
};

/**
 * VIDEO GENERATION (Veo 3)
 * REQUIRES USER SELECTED KEY IN COMPONENT.
 */
export const generateWeddingVideo = async (prompt: string, userClient: GoogleGenAI): Promise<string | null> => {
    const model = 'veo-3.1-fast-generate-preview';

    try {
        let operation = await userClient.models.generateVideos({
            model,
            prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });

        // Polling loop
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await userClient.operations.getVideosOperation({ operation });
        }

        const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!uri) return null;
        
        // We need to fetch the bytes because the URI is protected by the key
        // However, in a frontend context, we often just want the URL. 
        // The instructions say: fetch(`${downloadLink}&key=${process.env.API_KEY}`)
        // Since we are using a user-selected key, we need to append that.
        // NOTE: We cannot easily access the internal key of the userClient instance if strictly typed,
        // but typically we can grab it from where we initialized the client.
        // For this demo, we will return the URI and handle the fetch in the component with the known key.
        return uri;

    } catch (e) {
        console.error("Video generation error", e);
        throw e;
    }
}