import express from 'express';
import { connectToDB } from '../../utils/connectToDB.js'
import { setupServer } from '../../utils/setupServer.js'
import { addRoutes } from '../../config/routes.config.js';
import { errorHandler } from '../../middleware/errorHandler.js';

// Create Express server
const server = express();

// Setup server
setupServer(server)

// Add all routes to server
addRoutes(server)

server.use(errorHandler)

// Connect to test database
connectToDB(true);


export { server }