import { Document, Types, Model} from "mongoose";
import { DreamDocument } from "./dream.interfaces.js";
import { UserDocument } from "./user.interfaces.js";

// Define basic theme interface
export interface ThemeInterface {
    theme: string
    dream: DreamDocument['_id']
    owner: UserDocument['_id']
}

// Create new interface from theme interface and mongoose document
export interface ThemeDocument extends ThemeInterface, Document {
    _id: Types.ObjectId;
}


export interface ThemeModel extends Model<ThemeDocument> {
    findByThemeOrThrowError(text: string): Promise<ThemeDocument>
}