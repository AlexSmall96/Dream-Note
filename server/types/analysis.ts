import { Length, Style, Tone } from "../interfaces/dream.interfaces.js";


export enum prompts {
    title = 'Return exactly one short title for the provided dream.',
    themes =  'Return 1-4 one word themes for the provided dream. Seperate them by commas without spaces.',
    analysis = `Return a short interpretation of the provided dream. Include only the interpretation itself without any \n.
                Never use self referential language and never include a follow up question.`
}

export type ParamsType = {
   tone: Tone, 
   style: Style, 
   length: Length 
}