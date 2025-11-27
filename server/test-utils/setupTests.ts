// Creates a test server with no client rendering. Only routes and DB connection
import { server, bootstrap } from '../server.js'
import { addRoutes } from '../config/routes.config.js';
import { User } from '../models/user.model.js';
import mongoose from 'mongoose';

// Add all routes to server
addRoutes(server)

// Call boostrap function to connect to database
bootstrap();

// Define and save test data
const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    email: 'user1@email.com',
    password: 'apple123',
    _id: userOneId
}

const wipeDBAndSaveData = async () => {
    await User.deleteMany()
    await new User(userOne).save()
}

export { server, wipeDBAndSaveData, userOne }