import { beforeEach } from "node:test";
import { Theme } from "../../models/theme.model";
import { test, describe, expect} from 'vitest'
import { wipeDB } from "../setup/wipeDB";
import { Dream } from "../../models/dream.model";
import mongoose from "mongoose";

beforeEach(async () => {
    await wipeDB()
})

describe('Theme owner validation middleware should:', () => {

    test('Save theme when theme owner matches dream owner.', async () => {
        const userOneId = new mongoose.Types.ObjectId()

        const dream = await new Dream({
            title: 'dream',
            date: new Date(),
            owner: userOneId
        }).save()

        const theme = new Theme({
            theme: 'Fear',
            dream: dream._id,
            owner: userOneId
        })

        await expect(theme.save()).resolves.toBeDefined()
    })

    test('Fail if dream does not exist.', async () => {
        const fakeDreamId = new mongoose.Types.ObjectId()
        const userOneId = new mongoose.Types.ObjectId()

        const theme = new Theme({
            theme: 'Fear',
            dream: fakeDreamId,
            owner: userOneId
        })

        await expect(theme.save()).rejects.toThrow('Associated dream not found.')
    })

    test('Fail if theme owner differs from dream owner.', async () => {
        const userOneId = new mongoose.Types.ObjectId()
        const userThreeId = new mongoose.Types.ObjectId()

        const dream = await new Dream({
            title: 'dream',
            date: new Date(),
            owner: userOneId
        }).save()

        const theme = new Theme({
            theme: 'Fear',
            dream: dream._id,
            owner: userThreeId
        })

        await expect(theme.save()).rejects.toThrow(
            'Theme owner must match dream owner.'
        )
    })

})