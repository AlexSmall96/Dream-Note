import mongoose from 'mongoose';
import { Dream } from '../../../models/dream.model.js';
import { userOneId, userThreeId } from '../data/users.js';
import { userFourId } from './users.js';

const oldDreamId = new mongoose.Types.ObjectId()
const newDreamId = new mongoose.Types.ObjectId()
const dreamWithNoThemesId = new mongoose.Types.ObjectId()
const dreamWithNoDescId = new mongoose.Types.ObjectId()
const dreamWithManyThemesId = new mongoose.Types.ObjectId()
const oldDreamTheme1Id = new mongoose.Types.ObjectId()

const userOneTitles: string[] = []
for (let i=1; i<10; i++){
    userOneTitles.push(`dream${i}`)
}
const userThreeTitles = ['In space', 'In space without a space suit', 'In space wearing a space suit']

const oldDream = {
    title: 'A dream from 1 year ago', 
    date: '2024-12-30T00:00:00.000Z', 
    owner: userThreeId, 
    _id: oldDreamId,
    description: 'I slept in and missed my train.'
}

const newDream = {
    title: 'A dream from 6 months ago', 
    date: '2025-05-29T00:00:00.000Z', 
    owner: userThreeId, 
    _id: newDreamId,
    description: 'I was being chased by a dog.'
}

const dreamWithNoThemes = {
    title: 'A dream with no themes', 
    date: '2020-05-29T00:00:00.000Z',
    owner: userThreeId, 
    _id: dreamWithNoThemesId,
    description: 'A description to generate themes from.'    
}

const dreamWithNoDesc = {
    title: 'A dream with no description', 
    date: '2020-05-29T00:00:00.000Z',
    owner: userThreeId, 
    _id: dreamWithNoDescId,   
}

const dreamWithManyThemes = {
    title: 'A dream with many themes', 
    date: '2020-05-29T00:00:00.000Z',
    owner: userFourId, 
    _id: dreamWithManyThemesId, 
}

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
    
    // Save dreams to user three to test date filtering and theme generation
    await new Dream(oldDream).save()
    await new Dream(newDream).save()
    await new Dream(dreamWithNoThemes).save()
    await new Dream(dreamWithNoDesc).save()
    await new Dream(dreamWithManyThemes).save()
}

export {
    saveDreams, 
    oldDreamId, 
    oldDream, 
    dreamWithNoDescId, 
    userOneTitles, 
    oldDreamTheme1Id, 
    newDreamId, 
    dreamWithManyThemesId,
    newDream,
    userThreeTitles
}