import { injectable } from "inversify";
import OpenAI from "openai";
import { DreamInterface } from "../../interfaces/dream.interfaces.js";

export enum prompts {
    title = 'Return exactly one short title for the provided dream.',
    themes =  'Return 1-4 one word themes for the provided dream. Seperate them by commas without spaces.',
    analysis = `Return a short interpretation of the provided dream. Include only the interpretation itself without any \n.
                Never use self referential language and never include a follow up question.`
}

// Dream title service to generate AI title based on description
@injectable()
export class AIService {
    private openAI: OpenAI 

    constructor(){

        // Check if API key is provided
        if (!process.env.API_KEY) {
                throw new Error("OpenAI API key is missing.");
        }
        // Create OpenAI instance
        this.openAI = new OpenAI({apiKey: process.env.API_KEY})
    }

    private setFullSystemPrompt (systemPrompt:prompts, params: {tone: string, style: string, length: string}){
        const {tone, style, length} = params
        const toneSpec = tone ? `Use a ${tone} tone.` : ''
        const styleSpec = style ? `Write in a ${style} style.` : ''
        const lengthSpec = length ? `Make the response ${length}` : ''
        return systemPrompt + toneSpec + styleSpec + lengthSpec
    }


    private async sendPrompt(systemPrompt:prompts, content: string, params?: {tone: string, style: string, length: string}){
        let fullSystemPrompt = systemPrompt as string
        if (params){
            fullSystemPrompt = this.setFullSystemPrompt(systemPrompt, params)
        }
        const response = await this.openAI.responses.create({
            model: "gpt-5-nano", 
            input : [
                {
                    role: 'system',
                    content: fullSystemPrompt
                }, {
                    role: 'user',
                    content
                }            
            ] 
        })
        return response
    } 

    public async generateTitle(description: string){
        const response = await this.sendPrompt(prompts.title, description)
        const title = response.output_text.trim()
        return title
    }

    public async generateThemes(description: string){
        const response = await this.sendPrompt(prompts.themes, description)
        const themes = response.output_text.split(',')
        return themes
    }

    public async generateAnalysis(description: string, params: {tone: string, style: string, length: string}){
        const response = await this.sendPrompt(prompts.analysis, description, params)
        const analysis = response.output_text.trim()
        return analysis
    }

    public async addAIDataToDream(dream: DreamInterface, incomingThemes: string[]){
        const DEV = process.env.DEV
        const existingTitle = dream.title
        if (DEV){
            // Use substring of description as title and default themes to avoid api costs during development
            dream.title = existingTitle ?? dream.description.substring(0, 30).concat('...')
            const themes = incomingThemes.length > 0 ? incomingThemes : (dream.description ? ['theme1', 'theme2', 'theme3'] : null)
            return {dream, themes}
        }

        dream.title = existingTitle ?? await this.generateTitle(dream.description)
        const themes = incomingThemes.length > 0 ? incomingThemes : (dream.description ? await this.generateThemes(dream.description) : null)
        return {dream, themes}
    }
}