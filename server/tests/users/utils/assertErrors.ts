import { expect } from 'vitest';


// Helper function to make assertions on email, password and token errors
export const assertErrors = (
    errorsResponse: {param: string, msg: string}[], 
    errorMsgs : {param: string, msg: string}[]
) => {
    expect(errorsResponse).toHaveLength(errorMsgs.length)
    errorsResponse.forEach((error, index) => {
        expect(error).toMatchObject(errorMsgs[index])
    })
}