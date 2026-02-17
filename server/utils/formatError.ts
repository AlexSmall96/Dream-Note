export const formatError = (msg: string, param?: string): {errors: {msg: string, param?: string}[]} => {
    return {
        errors: [
            {msg, param}
        ]
    }
}