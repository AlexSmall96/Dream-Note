import { injectable, inject } from "inversify";
import { User } from "../models/user.model.js";
import {generateOtp} from "./utils/otp.js"
import { Otp } from "../models/OTP.model.js";
import {AppError} from "../utils/appError.js"
import { OtpDocument } from "../interfaces/otp.interfaces.js";

export type purposeType = "email-update" | "password-reset"

@injectable()
export class OtpService {

    // Sends and generates a OTP for either email update or password reset, depending on the provided purpose. 
    // UserId is only required for email update as password reset is for unauthenticated users.
    public async generateOTP(email: string, purpose: purposeType, incomingUserId?: string){
        if (purpose === 'email-update' && !incomingUserId){
            // Throw system error - this situation will never be reached from data inputted via client
            // Only included for debugging purposes in the case that account.controller calls this service incorrectly
            throw new AppError('Arugment incomingUserId must be provided if purpose is email-update.', 500)
        }
        const existingUser = await User.findOne({ email })

        if (purpose === "email-update" && existingUser) {
            const errorMessage = existingUser._id.toString() !== incomingUserId ? 
                'Email address already in use.' 
            : 
                'This email address is already associated with your account.'
            throw new AppError(errorMessage, 400, 'email');
        }

        if (purpose === "password-reset" && !existingUser) {
            // Don't throw error if no user found for password reset to prevent email enumeration
            return null
        }

        const otp = generateOtp()
        // If purpose is password reset, existingUser must exist at this point due to early return
        // If purpose is email-update, incomingUserId must exist at this point due to throw error
        const userId = purpose === "password-reset" ? existingUser!._id.toString() : incomingUserId
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 mins
            await Otp.create({
                userId,
                email,
                otp,
                purpose,
                expiresAt,
            })
        return otp
    }

    // Find saved OTP record based on userId and provied otp value
    public async findOtpById(otp: string, purpose: purposeType, userId: string): Promise<OtpDocument | null>{
        const otpRecord = await Otp.findOne({
            userId, 
            otp, 
            purpose, 
            used: false, 
            expiresAt: { $gt: new Date() }
        })
        return otpRecord
    }

    public async findOtpByEmailAndUpdate(otp: string, email: string, purpose: purposeType): Promise<OtpDocument | null>{
        const otpRecord = await Otp.findOneAndUpdate({
            otp,
            email, 
            purpose, 
            used: false, 
            expiresAt: { $gt: new Date() }
        }, {
            $set: {used: true}
        }, {
            new: true
        })
        return otpRecord        
    }

    public async findUsedOtp(otpId: string, userId: string, purpose: purposeType): Promise<OtpDocument | null>{
        const otp = await Otp.findOne({
            _id: otpId,
            userId: userId,
            purpose,
            used: true,
            expiresAt: { $gt: new Date() }
        })
        return otp
    }
    
    public async deleteOtp(otpId: string){
        await Otp.findOneAndDelete({_id: otpId})
    }

}