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
    public async generateAIDreamInfo(description: string, prompt: string, forThemes: boolean){
        const response = await this.openAI.responses.create({
            model: "gpt-5-nano",
            input: [
                {
                    role: 'system',
                    content: prompt
                }, {
                    role: 'user',
                    content: description
                }
            ]
        }); 

        if (forThemes){
            // Return themes as array
            return response.output_text.trim().split(',') ?? []
        }
        // Return generated string
        return response.output_text.trim() ?? null

    }
}