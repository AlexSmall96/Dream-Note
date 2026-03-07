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
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'              
    }
}, {timestamps: true})

themeSchema.statics.findByThemeOrThrowError = async function (this: ThemeModel, text: string): Promise<ThemeDocument> {
    const theme = await this.findOne({theme:text})
    if (!theme){
        throw new Error('Theme not found.')
    }
    return theme
}
 
themeSchema.pre("save", async function (next) {
    const dream = await mongoose.model("Dream").findById(this.dream)

    if (!dream) {
        return next(new Error("Associated dream not found."))
    }

    if (!dream.owner.equals(this.owner)) {
        return next(new Error("Theme owner must match dream owner."))
    }

    next()
})

export const Theme =
    (mongoose.models.Theme as ThemeModel) ||
    model<ThemeDocument, ThemeModel>("Theme", themeSchema)