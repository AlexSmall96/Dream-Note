import { injectable } from "inversify";
import OpenAI from "openai";

// Dream title service to generate AI title based on description
@injectable()
export class DreamService {
    private openAI: OpenAI 
    
    constructor(){
        // Check if API key is provided
        if (!process.env.API_KEY) {
                throw new Error("OpenAI API key is missing.");
        }

        // Create OpenAI instance
        this.openAI = new OpenAI({apiKey: process.env.API_KEY})
    }

    // Method to get title from openAI API
    public async generateAIDreamInfo(description: string, generateTitle: boolean){
        const content = generateTitle 
            ? 
                'Return exactly one short title for the provided dream.' 
            : 
                'Return 1-3 one word themes for the provided dream. Seperate them by commas.'

        const response = await this.openAI.responses.create({
            model: "gpt-5-nano",
            input: [
                {
                    role: 'system',
                    content
                }, {
                    role: 'user',
                    content: description
                }
            ]
        }); 
        // Return generated title, or first 15 characters of description as a fallback
        if (generateTitle){
            return response.output_text.trim() ?? description.substring(0, 15)
        }
        // Return themes as array
        return response.output_text.trim().split(',') ?? []
    }
}