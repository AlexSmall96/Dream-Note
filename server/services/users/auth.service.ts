import { injectable } from "inversify";
import { Dream } from "../../models/dream.model.js";
import { Theme } from "../../models/theme.model.js";
import { User } from "../../models/user.model.js";
import { UserInterface, UserDocument } from "../../interfaces/user.interfaces.js";
import { guestData } from '../../seed-data/guestSeedData.js'

@injectable()
export class AuthService {

    // Sign up
    public async signUp(data: UserInterface){
        const user = new User(data);
        await user.save();
        return {email: user.email, id: user._id}
    }

    // Login
    public async login(user: UserDocument){
        const token = await user.generateAuthToken()
        return {user, token, isGuest: false}
    }

    // Logout
    public async logout(user: UserDocument, token: string){
        user.tokens = user.tokens.filter((oldToken: string) => oldToken !== token)
        await user.save()
    }

    // Save dreams and themes when guest logs in
    public async seedGuestData(guestId: string){
        await Promise.all(guestData.map(async (data) => {
            const dreamData = data.dream
            const themes = data.themes
            const savedDream = await new Dream({...dreamData, owner: guestId}).save()
            await Promise.all(themes.map(async (theme) => {
                await new Theme({theme, dream: savedDream._id}).save()
            }))
        }))
    }

    // Delete guest data and seed original data
    public async resetGuestData(guestId: string) {
        // Delete guest's dreams and themes
        // Clear tokens
        await Dream.deleteMany({ owner: guestId });
        await Theme.updateMany({ owner: guestId }, { $pull: { dreams: guestId } });
        await User.updateOne(
            { _id: guestId },
            { $set: { tokens: [] } }
        )
        await this.seedGuestData(guestId)
    }

    public async loginGuest(){
        const guestEmail = process.env.GUEST_USER_EMAIL
        if (!guestEmail) {
            throw new Error('GUEST_USER_EMAIL is not configured')
        }    
        const user = await User.findByEmailOrThrowError(guestEmail)
        await this.resetGuestData(user._id.toString())
        const token = await user.generateAuthToken(true)
        return {user, token, isGuest: true}
    }
}