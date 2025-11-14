import express, { Request, Response } from 'express';
import next from "next";
import mongoose from "mongoose";
import { addRoutes } from './config/routes.config';

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {

    const server = express();
    server.use(express.json());

    // Welcome message
    server.get('/api', (_req: Request, res: Response) => {
        res.json({message: 'Welcome to The Dream Note API.'});
    });

    // Add all routes to server
    addRoutes(server)

    // Connect to MongoDB database
    async function bootstrap() {
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
            console.log("Connnected To MongoDB");
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }

    // Render frontend
    server.all("*", (req, res) => handle(req, res));

    const port = process.env.PORT || 3000;

    server.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });

    // Call boostrap function to connect to database
    bootstrap()

})
