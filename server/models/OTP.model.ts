import mongoose, { Schema, model } from "mongoose";
import { OtpDocument } from "../interfaces/otp.interfaces.js";
import bcrypt from "bcrypt";

const otpSchema = new Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: false,
		},
		email: {
			type: String,
			required: true,
		},
		otp: {
			type: String,
			required: true,
		},
		purpose: {
			type: String,
			enum: ["email-update", "password-reset", "email-verification"],
			required: true,
		},
		expiresAt: {
			type: Date,
			required: true,
		},
		used: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
)

// Automatically delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Method to hash otp value when created
otpSchema.pre<OtpDocument>("save", async function (next) {
	if (this.isModified("otp")) {
		this.otp = await bcrypt.hash(this.otp, 8);
	}
	next();
});

export const Otp = mongoose.models.Otp || model<OtpDocument>("Otp", otpSchema)
