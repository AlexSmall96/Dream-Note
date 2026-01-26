import { User } from '../../models/user.model.js';
import { Dream } from '../../models/dream.model.js';
import { Theme } from '../../models/theme.model.js';
import { saveUsers } from '../users/data.js'
import { saveDreams } from '../dreams/data.js'
import { saveThemes } from '../themes/data.js'

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
