import crypto from "crypto";

export const generateOtp = (min = 100000, max = 999999) => {
    return crypto.randomInt(min, max).toString();
};