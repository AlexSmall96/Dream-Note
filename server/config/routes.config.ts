import { Application } from "express";
import { container } from "./container";
import { UserRouter } from "../routers/user.router";

export function addRoutes(server: Application): Application{

    const userRouter = container.get<UserRouter>(UserRouter);
    server.use('/api/users', userRouter.router);

    return server;
};