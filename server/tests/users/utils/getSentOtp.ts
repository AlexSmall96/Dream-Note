export type mailOptionsType = {
    from: string,
    to: string,
    subject: string,
    text: string
}

// The code to extract the first index of a number from a string using a regular expression was taken from:
// https://reactgo.com/javascript-get-first-number-in-a-string/

export const getSentOtp = (sentMail: mailOptionsType[]) => {
    const n = sentMail.length
    const mailText = sentMail[n-1].text
    const index = mailText.search(/[0-9]+/)
    const otpLength = 6
    const otp = mailText.substring(index, index + otpLength)
    return otp
}