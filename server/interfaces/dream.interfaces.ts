/* 
The Below interface was created using the below article as a guide
https://www.slingacademy.com/article/mongoose-define-schema-typescript/
*/

import { Model, Document, Types} from "mongoose";
import { UserDocument } from "./user.interfaces.js";

export const options = {
    tone: ['neutral', 'curious', 'caring', 'excited', 'spiritual'],
    style: ['poetic', 'clinical', 'spiritual'],
    length: ['brief', 'long']
} as const

export type Tone = typeof options.tone[number];
export type Style = typeof options.style[number];
export type Length = typeof options.length[number];

export interface AnalysisInterface {
    text: string,
    tone: Tone,
    style: Style,
    length: Length,
    descriptionSnapshot: string,
    createdAt?: Date,
    isFavorite?: boolean,
    modelUsed?: string
}

// Define basic dream interface
export interface DreamInterface {
    title: string;
    description: string;
    date: Date;
    analyses: AnalysisInterface[];
    notes: string;
    owner: UserDocument['_id']
}

// Create new interface from Dream Interface + mongoose Document
export interface DreamDocument extends DreamInterface, Document {
    _id: Types.ObjectId;
}

export interface DreamModel extends Model<DreamDocument>{
    findByIdOrThrowError(_id: string): Promise<DreamDocument>
}

export interface GetDreamsQuery {
    title?: string
    year?: string
    month?: string
    limit?: string
    skip?: string
    sort?: string
}


 


