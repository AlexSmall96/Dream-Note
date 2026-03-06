export const parseErrors = (array: {value: string, msg: string, param: string}[], param: string) => {
    const errorObj = array.find((
        err: {value: string, msg: string, param: string}
    ) => {
        return err.param === param
    })
    
    return errorObj?.msg ?? ''
}