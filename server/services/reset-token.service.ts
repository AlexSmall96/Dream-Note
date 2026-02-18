import { injectable } from "inversify";
import {AppError} from "../utils/appError.js"
import jwt from "jsonwebtoken"

export type purposeType = "email-update" | "password-reset"

@injectable()
export class ResetTokenService {

    public generatePasswordResetToken(userId: string, otpId: string){
        const resetSecret = process.env.RESET_TOKEN_SECRET!
        if (!resetSecret){
            throw new AppError('RESET_TOKEN_SECRET is not configured.', 500)
        }

        const resetToken = jwt.sign(
                { userId, otpId },
                resetSecret,
                { expiresIn: "10m" }
        )
        return resetToken
    }

    public verifyPasswordResetToken(resetToken:string){
        const resetSecret = process.env.RESET_TOKEN_SECRET!
        if (!resetSecret){
            throw new AppError('RESET_TOKEN_SECRET is not configured.', 500)
        }
        const payload = jwt.verify(
            resetToken,
            resetSecret
        ) as { userId: string, otpId: string}
        return payload
    }
}