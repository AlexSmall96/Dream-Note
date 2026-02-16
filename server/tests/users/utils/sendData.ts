import request from 'supertest';
import { Application } from 'express';

export const sendData = async (
    server: Application,
    url: string,
    body: any,
    status: number,
    options?: {auth? : [string, string], post?: boolean }
):Promise<{body: any}> => {
    const {post, auth} = options ?? {post: false, auth: null}
    const authHeader = auth ?? ['Authorization', `Bearer 123`]
    const response = post? 
        await request(server).post(url).send(body).set(...authHeader).expect(status)
    :
        await request(server).patch(url).send(body).set(...authHeader).expect(status)
    return response
}

export const postDataWithNoAuth = async (server: Application, url: string, body: any, status:number):Promise<{body: any}> => {
    return await sendData(server, url, body, status, {post:true})
}

export const patchDataWithNoAuth = async (server: Application, url: string, body: any, status:number):Promise<{body: any}> => {
    return await sendData(server, url, body, status)
}

export const patchDataWithAuth = async (server: Application, url: string, body: any, status:number, auth: [string, string]):Promise<{body: any}> => {
    return await sendData(server, url, body, status, {auth})
}