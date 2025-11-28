import express from 'express';
import { connectToDB } from '../connectToDB.js'
import { setupServer } from '../setupServer.js';
import { addRoutes } from '../../config/routes.config.js';

// Create Express server
const server = express();

// Setup server
setupServer(server)

// Add all routes to server
addRoutes(server)

// Connect to test database
connectToDB(true);


export { server }