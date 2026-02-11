import { User } from '../../models/user.model.js';
import { Dream } from '../../models/dream.model.js';
import { Theme } from '../../models/theme.model.js';

// Wipe DB
export const wipeDB = async () => {
    // Wipe db
    await User.deleteMany()
    await Dream.deleteMany()
    await Theme.deleteMany()
}
