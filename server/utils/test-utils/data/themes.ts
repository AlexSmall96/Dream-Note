import { Theme } from '../../../models/theme.model.js';
import { oldDreamId, newDreamId, oldDreamTheme1Id, dreamWithManyThemesId } from './dreams.js';

const manyThemeTitles: string[] = []


for (let i=0; i<10; i++){
    manyThemeTitles.push(i < 5? `b-theme-${i}` : i < 8 ? `a-theme-${i}` : `c-theme-${i}`)
}

const baseTime = new Date('2025-06-15T00:00:00.000Z');

const oldDreamTheme1 = {theme: 'Lateness', dream: oldDreamId, _id: oldDreamTheme1Id}
const oldDreamTheme2 = {theme: 'Anxiety', dream: oldDreamId}
const newDreamTheme1 = {theme: 'Fear', dream: newDreamId}
const newDreamTheme2 = {theme: 'Animals', dream: newDreamId}

const oldAndNewThemes = [
    oldDreamTheme1, oldDreamTheme2, newDreamTheme1, newDreamTheme2
]

const saveThemes = async () => {
    await Promise.all(oldAndNewThemes.map(async (theme, index) => {
        await new Theme({
            ...theme,
            createdAt: new Date(baseTime.getTime() + index)
        }).save()
    }))

    await Promise.all(
        manyThemeTitles.map(async (theme, i) => {
            await new Theme({
                theme,
                dream: dreamWithManyThemesId,
            }).save()
        })
    )
}

export {
    saveThemes
}