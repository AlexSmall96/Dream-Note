import express from 'express';
import next from "next";
import { addRoutes } from './config/routes.config.js';
import { setupServer } from './utils/setupServer.js';
import { connectToDB } from './utils/connectToDB.js';
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Create Express server
export const server = express();

// Setup server
setupServer(server)

app.prepare().then(() => {
    // Add all routes to server
    addRoutes(server)
    // Render frontend
    server.all("*", (req, res) => handle(req, res));
    const port = process.env.PORT || 3000;

    server.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });

    // Connect to database
    connectToDB(false)
})

