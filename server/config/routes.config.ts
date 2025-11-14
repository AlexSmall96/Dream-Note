import { Application } from "express";
import { container } from "./container.js";
import { UserRouter } from "../routers/user.router.js";

export function addRoutes(server: Application): Application{

    const userRouter = container.get<UserRouter>(UserRouter);
    server.use('/api/users', userRouter.router);

    return server;
};