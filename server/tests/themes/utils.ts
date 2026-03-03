import { Dream } from '../../models/dream.model.js';
import { Theme } from '../../models/theme.model.js';

export const findDreamAndSaveTheme = async (theme: string, title: string, owner: string) => {
    const dream = await Dream.findOne({title})
    const dreamId = dream?._id
    await new Theme({
        theme, 
        dream: dreamId, 
        owner
    }).save()    
}
