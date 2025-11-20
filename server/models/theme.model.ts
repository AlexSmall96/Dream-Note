import mongoose, { Schema, model } from "mongoose";
import { ThemeDocument } from "../interfaces/theme.interfaces.js"

const themeSchema = new Schema<ThemeDocument>({
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

export const Theme = model<ThemeDocument>("Theme", themeSchema)