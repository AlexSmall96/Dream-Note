import mongoose, { Schema, model } from "mongoose";
import {  DreamDocument } from "../interfaces/dream.interfaces.js";

const dreamSchema = new Schema<DreamDocument>({
    title: {
        type: String,
        required: [true, 'Title is required.'],
        maxlength: [50, 'Title cannot be more than 50 characters.'],
        trim: true
    },
    description: {
        type: String,
        maxlength: [5000, 'Description cannot be more than 5000 characters.'],
    },    
    date: {
        type: Date,
        default: new Date()
    },
    analysis: {type: String},
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot be more than 5000 characters.']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
})

export const Dream = model<DreamDocument>("Dream", dreamSchema);