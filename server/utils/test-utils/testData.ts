import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user.model';
import { Dream } from '../../models/dream.model';
import { Theme } from '../../models/theme.model';

// Define and save test data

// Create user ids 
const userOneId = new mongoose.Types.ObjectId()
const userThreeId = new mongoose.Types.ObjectId()

// Create token
const JWT_SECRET = process.env.JWT_SECRET

const generateToken = (id: string) => {
    if (!JWT_SECRET){
        throw new Error('Please provide a json web token secret key.')
    }
    return jwt.sign({ _id:id }, JWT_SECRET, { expiresIn: "24h" })
}

// Create users to save to DB
const userOne = {
    email: 'user1@email.com',
    password: 'apple123',
    _id: userOneId,
    tokens: [generateToken(userOneId.toString())]
}

const userThree = {
    email: 'user3@email.com',
    password: 'orange123',
    _id: userThreeId,
    tokens: [generateToken(userThreeId.toString())]
}

// Use token to create auth string
const userOneAuth: [string, string] = ['Authorization', `Bearer ${userOne.tokens[0]}`]
const userThreeAuth: [string, string] = ['Authorization', `Bearer ${userThree.tokens[0]}`]

// Create dreams to save to db
const userOneTitles: string[] = []
for (let i=1; i<10; i++){
    userOneTitles.push(`dream${i}`)
}

const userThreeTitles = ['In space', 'In space without a space suit', 'In space wearing a space suit']
const oldDreamId = new mongoose.Types.ObjectId()
const newDreamId = new mongoose.Types.ObjectId()
const dreamWithNoThemesId = new mongoose.Types.ObjectId()
const dreamWithNoDescId = new mongoose.Types.ObjectId()

const oldDream = {
    title: 'A dream from 1 year ago', 
    date: '2024-12-30T00:00:00.000Z', 
    owner: userThreeId, 
    _id: oldDreamId,
    description: 'I slept in and missed my train.'
}

const newDream = {
    title: 'A dream from 6 months ago.', 
    date: '2025-05-29T00:00:00.000Z', 
    owner: userThreeId, 
    _id: newDreamId,
    description: 'I was being chased by a dog.'
}

const dreamWithNoThemes = {
    title: 'A dream with no themes.', 
    date: '2020-05-29T00:00:00.000Z',
    owner: userThreeId, 
    _id: dreamWithNoThemesId,
    description: 'A description to generate themes from.'    
}

const dreamWithNoDesc = {
    title: 'A dream with no description.', 
    date: '2020-05-29T00:00:00.000Z',
    owner: userThreeId, 
    _id: dreamWithNoDescId,   
}

const oldDreamTheme1 = {theme: 'Lateness', dream: oldDreamId}
const oldDreamTheme2 = {theme: 'Anxiety', dream: oldDreamId}
const newDreamTheme1 = {theme: 'Fear', dream: newDreamId}
const newDreamTheme2 = {theme: 'Animals', dream: newDreamId}

const saveDreams = async () => {
    // Save userOne's dreams to test sorting and pagination
    await Promise.all(
        userOneTitles.map(async (title, index) => {
            const date = `2025-06-0${index + 1}T00:00:00.000Z`
            await new Dream({title, date, owner: userOneId}).save()
        })
    )
    // Save userTwo's dreams to test title search
    await Promise.all(
        userThreeTitles.map(async (title, index) => {
            const date = `2025-06-0${index + 1}T00:00:00.000Z`
            await new Dream({title, owner: userThreeId, date}).save()
        })
    )
    
    // Save two more dreams to user three to test date filtering
    await new Dream(oldDream).save()
    await new Dream(newDream).save()
    await new Dream(dreamWithNoThemes).save()
    await new Dream(dreamWithNoDesc).save()
}

const saveUsers = async () => {
    await new User(userOne).save()
    await new User(userThree).save()
}

const saveThemes = async () => {
    await new Theme(oldDreamTheme1).save()
    await new Theme(oldDreamTheme2).save()
    await new Theme(newDreamTheme1).save()
    await new Theme(newDreamTheme2).save()
}

// Wipe DB, save data
const wipeDBAndSaveData = async () => {
    // Wipe db
    await User.deleteMany()
    await Dream.deleteMany()
    await Theme.deleteMany()
    // Save dreams, themes and users
    await saveUsers()
    await saveDreams()
    await saveThemes()
}

export { 
    wipeDBAndSaveData, 
    userOne, 
    userOneId, 
    userOneAuth, 
    userThreeId, 
    userThreeAuth, 
    oldDreamId, 
    oldDream,
    dreamWithNoThemes,
    dreamWithNoDesc,
    dreamWithNoThemesId,
    dreamWithNoDescId,
}