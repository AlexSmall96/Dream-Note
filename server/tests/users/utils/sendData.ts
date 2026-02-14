import request from 'supertest';
import { Application } from 'express';

export const sendData = async (
    server: Application,
    url: string,
    body: any,
    status: number,
    auth?: [string, string]
):Promise<{body: any}> => {
    const response = auth ? 
        await request(server).patch(url).send(body).set(...auth).expect(status)
    :
        await request(server).patch(url).send(body).expect(status)

    return response
}