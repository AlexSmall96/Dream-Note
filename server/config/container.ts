import { Container } from "inversify";
import { UserController } from "../controllers/user.controller.js";
import { UserRouter } from "../routers/user.router.js";
import { EmailService } from "../services/email.service.js";

export const container: Container = new Container();

// User router + controller
container.bind(UserController).toSelf().inTransientScope()
container.bind(UserRouter).toSelf().inTransientScope()

// Email Service
container.bind(EmailService).toSelf().inTransientScope()

