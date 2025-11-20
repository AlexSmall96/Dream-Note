import { Container } from "inversify";
import { UserController } from "../controllers/user.controller.js";
import { UserRouter } from "../routers/user.router.js";
import { EmailService } from "../services/email.service.js";
import { DreamController } from "../controllers/dream.controlller.js";
import { ThemeController } from "../controllers/theme.controller.js"
import { DreamRouter } from "../routers/dream.router.js";
import { DreamService } from "../services/dream.service.js";


export const container: Container = new Container();

// User router + controller
container.bind(UserController).toSelf().inTransientScope()
container.bind(UserRouter).toSelf().inTransientScope()

// Email Service for user router
container.bind(EmailService).toSelf().inTransientScope()

// Dream router + controller
container.bind(DreamController).toSelf().inTransientScope()
container.bind(DreamRouter).toSelf().inTransientScope()

// Theme router + controller
container.bind(ThemeController).toSelf().inTransientScope()

// AI API Dream title and theme generation services for dream router
container.bind(DreamService).toSelf().inTransientScope()

