import { injectable } from "inversify";
import { UserInterface } from "../interfaces.js"
import { User } from "../models/user.model.js";

// Controller clas for User model
@injectable()
export class UserController {
    // Sign up
    public async handleSignUp(data: UserInterface){
        const user = new User(data);
        await user.save();
        return {email: user.email, id: user._id}
    }

    // Log in
    public async handleLogIn(data: UserInterface){
        const { email, password } = data;
        const user = await User.findByCredentials(email, password)
        const token = await user.generateAuthToken()
        return {user, token}
    }

}