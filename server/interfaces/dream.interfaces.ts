/* 
The Below interface was created using the below article as a guide
https://www.slingacademy.com/article/mongoose-define-schema-typescript/
*/

import { Model, Document, Types} from "mongoose";
import { UserDocument } from "./user.interfaces.js";

// Define basic dream interface
export interface DreamInterface {
    title: string;
    description: string;
    date: Date;
    analysis: string;
    notes: string;
    owner: UserDocument['_id']
}

// Create new interface from Dream Interface + mongoose Document
export interface DreamDocument extends DreamInterface, Document {
    _id: Types.ObjectId;
}

export interface DreamModel extends Model<DreamDocument>{
    findByIdAndUpdateOrThrowError(_id: string, update: DreamInterface): Promise<DreamDocument>
}



