import mongoose, { Schema, model } from "mongoose";
import { ThemeDocument, ThemeModel } from "../interfaces/theme.interfaces.js"

const themeSchema = new Schema<ThemeDocument, ThemeModel>({
    theme: {
        type: String,
        required: [true, 'Theme is required.'],
        maxlength: [15, 'Theme cannot be more than 15 characters.'],
        trim: true
    },
    dream: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Dream'        
    }
})

themeSchema.statics.findByThemeOrThrowError = async function (this: ThemeModel, text: string): Promise<ThemeDocument> {
    const theme = await this.findOne({theme:text})
    if (!theme){
        throw new Error('Theme not found.')
    }
    return theme
}
 

export const Theme = model<ThemeDocument, ThemeModel>("Theme", themeSchema)