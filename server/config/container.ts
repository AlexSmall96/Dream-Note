import { Container } from "inversify";
import { UserController } from "../controllers/user.controller.js";
import { AuthRouter } from "../routers/auth.router.js";
import { AccountRouter } from "../routers/account.router.js";
import { EmailService } from "../services/email.service.js";
import { DreamController } from "../controllers/dream.controlller.js";
import { ThemeController } from "../controllers/theme.controller.js"
import { DreamRouter } from "../routers/dream.router.js";
import { DreamService } from "../services/dream.service.js";
import { ThemeRouter } from "../routers/theme.router.js";
import { ThemeService } from "../services/theme.service.js";
import { UserService } from "../services/user.service.js";

export const container: Container = new Container();

// User router (accounts & auth) + controller
container.bind(UserController).toSelf().inTransientScope()
container.bind(AuthRouter).toSelf().inTransientScope()
container.bind(AccountRouter).toSelf().inTransientScope()

// Email Service for user router
container.bind(EmailService).toSelf().inTransientScope()

// Dream router + controller
container.bind(DreamController).toSelf().inTransientScope()
container.bind(DreamRouter).toSelf().inTransientScope()

// Theme router + controller
container.bind(ThemeController).toSelf().inTransientScope()
container.bind(ThemeRouter).toSelf().inTransientScope()

// AI API Dream title and theme generation services for dream router
container.bind(DreamService).toSelf().inTransientScope()

// Theme service
container.bind(ThemeService).toSelf().inTransientScope()

// User service
container.bind(UserService).toSelf().inTransientScope()
