import mongoose from "mongoose";

// Connect to MongoDB database
export async function connectToDB(test: boolean) {
    if (!process.env.DATABASE_URL){
        throw new Error('Database url not found.')
    }
    if (!process.env.TEST_DATABASE_URL){
        throw new Error('Database url not found.')
    }
    const dbUrl = test? process.env.TEST_DATABASE_URL :process.env.DATABASE_URL 
    // const dbUrl = process.env.DATABASE_URL 
    try {
        await mongoose.connect(
            dbUrl,
        {
            dbName: process.env.DATABASE_NAME,
        }
        );
        console.log("Connnected To MongoDB", test? 'test database': '');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}