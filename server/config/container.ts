import { Container } from "inversify";
import { AuthController } from "../controllers/auth.controller.js";
import { AuthRouter } from "../routers/auth.router.js";
import { AccountRouter } from "../routers/account.router.js";
import { EmailService } from "../services/email.service.js";
import { DreamController } from "../controllers/dream.controlller.js";
import { ThemeController } from "../controllers/theme.controller.js"
import { DreamRouter } from "../routers/dream.router.js";
import { DreamService } from "../services/dream.service.js";
import { ThemeRouter } from "../routers/theme.router.js";
import { ThemeService } from "../services/theme.service.js";
import { AuthService } from "../services/auth.service.js";
import { AccountService } from "../services/account.service.js";
import { AccountController } from "../controllers/account.controller.js";
import { OtpService } from "../services/otp.service.js";
import { ResetTokenService } from "../services/reset-token.service.js";

export const container: Container = new Container();

// Accounts
container.bind(AccountController).toSelf().inTransientScope()
container.bind(AccountRouter).toSelf().inTransientScope()   
container.bind(AccountService).toSelf().inTransientScope()

// Otp, reset token and email (services only)
container.bind(OtpService).toSelf().inTransientScope()
container.bind(ResetTokenService).toSelf().inTransientScope()
container.bind(EmailService).toSelf().inTransientScope()

// Auth
container.bind(AuthController).toSelf().inTransientScope()
container.bind(AuthRouter).toSelf().inTransientScope()
container.bind(AuthService).toSelf().inTransientScope()

// Dreams
container.bind(DreamController).toSelf().inTransientScope()
container.bind(DreamRouter).toSelf().inTransientScope()
container.bind(DreamService).toSelf().inTransientScope()

// Themes
container.bind(ThemeController).toSelf().inTransientScope()
container.bind(ThemeRouter).toSelf().inTransientScope()
container.bind(ThemeService).toSelf().inTransientScope()


