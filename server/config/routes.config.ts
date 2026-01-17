import { Application } from "express";
import { container } from "./container";
import { UserRouter } from "../routers/user.router";
import { DreamRouter } from '../routers/dream.router'
import { ThemeRouter } from '../routers/theme.router'

export function addRoutes(server: Application): Application{

    const userRouter = container.get<UserRouter>(UserRouter);
    server.use('/api/users', userRouter.router);

    const dreamRouter = container.get<DreamRouter>(DreamRouter);
    server.use('/api/dreams', dreamRouter.router)

    const themeRouter = container.get<ThemeRouter>(ThemeRouter);
    server.use('/api/themes', themeRouter.router);
    return server;
};