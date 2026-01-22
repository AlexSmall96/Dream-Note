import { User } from '../../models/user.model.js';
import { Dream } from '../../models/dream.model.js';
import { Theme } from '../../models/theme.model.js';
import { saveUsers } from './data/users.js'
import { saveDreams } from './data/dreams.js'
import { saveThemes } from './data/themes.js'

// Wipe DB, save data
export const wipeDBAndSaveData = async () => {
    // Wipe db
    await User.deleteMany()
    await Dream.deleteMany()
    await Theme.deleteMany()
    // Save dreams, themes and users
    await saveUsers()
    await saveDreams()
    await saveThemes()
}
