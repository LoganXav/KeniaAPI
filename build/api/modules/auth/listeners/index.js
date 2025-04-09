"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserListener = void 0;
const DateTimeUtil_1 = __importDefault(require("../../../../utils/DateTimeUtil"));
const Email_service_1 = require("../../../shared/services/email/Email.service");
const UserUpdate_provider_1 = __importDefault(require("../../../modules/user/providers/UserUpdate.provider"));
const userUpdateProvider = new UserUpdate_provider_1.default();
class UserListener {
    constructor() { }
    static async onUserSignUp(onSignUpEventListenerArgs) {
        await Email_service_1.EmailService.sendAccountActivationEmail(onSignUpEventListenerArgs);
    }
    static async onUserSignIn(onSignInEventListenerArgs) {
        const lastLoginDate = DateTimeUtil_1.default.getCurrentDate();
        await userUpdateProvider.updateOneByCriteria({
            userId: onSignInEventListenerArgs.userId,
            lastLoginDate,
        });
    }
}
exports.UserListener = UserListener;
//# sourceMappingURL=index.js.map