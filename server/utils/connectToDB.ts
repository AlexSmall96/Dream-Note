import mongoose from "mongoose";

// Connect to MongoDB database
export async function connectToDB(test: boolean) {
    if (!process.env.DATABASE_URL){
        throw new Error('Database url not found.')
    }
    try {
        await mongoose.connect(
            process.env.DATABASE_URL,
        {
            dbName: process.env.DATABASE_NAME,
        }
        );
        if (!test){
            console.log("Connnected To MongoDB");
        }
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}