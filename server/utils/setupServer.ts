import express, { Application, Request, Response, NextFunction } from 'express';

// Function to setup basic properties of Express server
export const setupServer = (server: Application) => {
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));
    
    // Welcome message
    server.get('/api', (_req: Request, res: Response) => {
        res.json({message: 'Welcome to The Dream Note API.'});
    });

    // Add error handling middleware
    server.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
        console.error(err);
        res.status(400).json({ error: err.message?? "Unkown error." });
    })
}