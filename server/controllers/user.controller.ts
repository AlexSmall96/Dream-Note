import { injectable } from "inversify";
import { UserInterface } from "../interfaces"
import { User } from "../models/user.model";

// Controller clas for User model
@injectable()
export class UserController {
    // Sign up
    public async handleSignUp(data: UserInterface){
        const user = new User(data);
        await user.save();
        return user;
    }

}