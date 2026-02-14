import { Application } from "express";
import { container } from "./container.js";
import { AuthRouter } from "../routers/auth.router.js";
import { AccountRouter } from "../routers/account.router.js";
import { DreamRouter } from '../routers/dream.router.js'
import { ThemeRouter } from '../routers/theme.router.js'

export function addRoutes(server: Application): Application{

    const authRouter = container.get<AuthRouter>(AuthRouter);
    server.use('/api/users', authRouter.router);

    const accountRouter = container.get<AccountRouter>(AccountRouter);
    server.use('/api/users', accountRouter.router);

    const dreamRouter = container.get<DreamRouter>(DreamRouter);
    server.use('/api/dreams', dreamRouter.router)

    const themeRouter = container.get<ThemeRouter>(ThemeRouter);
    server.use('/api/themes', themeRouter.router);
    return server;
};