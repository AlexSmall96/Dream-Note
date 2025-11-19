import { Application } from "express";
import { container } from "./container.js";
import { UserRouter } from "../routers/user.router.js";
import { DreamRouter } from '../routers/dream.router.js'

export function addRoutes(server: Application): Application{

    const userRouter = container.get<UserRouter>(UserRouter);
    server.use('/api/users', userRouter.router);

    const dreamRouter = container.get<DreamRouter>(DreamRouter);
    server.use('/api/dreams', dreamRouter.router)
    return server;
};