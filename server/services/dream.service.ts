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
    public async generateAIDreamInfo(description: string, prompt: string, forThemes: boolean, analysisOptions?: {tone: string, style: string}){
        // If options have been passed in to set analysis, add to system prompt
        const  fullPrompt = analysisOptions? prompt + analysisOptions.tone + analysisOptions.style : prompt
        // Create 
        const response = !process.env.DEV? await this.openAI.responses.create({
            model: "gpt-5-nano",
            input: [
                {
                    role: 'system',
                    content: fullPrompt
                }, {
                    role: 'user',
                    content: description
                }
            ]
        }) : {
            // If DEV flag is supplied, mock response 
            // If analysis - supply generic analysis referring to tone and style
            output_text: analysisOptions? 
                `Mock analysis response. Description: ${description} Tone: ${analysisOptions.tone}, Style: ${analysisOptions.style}.` 
            // If themes, return generic themes
                : forThemes? 
                    'theme1,theme2,theme3'
                : 
                    // If title - use first 30 characters of description
                    description.substring(0, 30) + '...'
        }
        if (forThemes){
            // Return themes as array
            return response.output_text.trim().split(',') ?? []
        }
        // Return generated string
        return response.output_text.trim() ?? null

    }
}