"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicAccessGuard = exports.SignupAccessGuard = exports.SignupSessionGuard = exports.BasicTokenGuard = void 0;
const status_const_1 = require("../../user/const/status.const");
const user_service_1 = require("../../user/user.service");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth.service");
let BasicTokenGuard = class BasicTokenGuard {
    constructor(authService) {
        this.authService = authService;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const token = this.authService.extractTokenFromReq(req, false);
        const payload = this.authService.decodeBasicToken(token);
        const user = await this.authService.authenticateWithEmailAndPassword(payload);
        req.user = user;
        return true;
    }
};
exports.BasicTokenGuard = BasicTokenGuard;
exports.BasicTokenGuard = BasicTokenGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], BasicTokenGuard);
let SignupSessionGuard = class SignupSessionGuard {
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const token = this.authService.extractTokenFromReq(req, true);
        const payload = this.authService.verifyToken(token, true);
        const user = await this.usersService.getUserByEmail(payload.email);
        if (!user) {
            throw new common_1.NotFoundException('가입되지 않은 사용자입니다.');
        }
        if (user.status !== status_const_1.StatusEnum.unauthorized) {
            throw new common_1.ForbiddenException('비정상적인 접근입니다.');
        }
        if (!payload.accountType) {
            throw new common_1.BadRequestException('회원가입 계정정보가 부족합니다.');
        }
        user.accountType = payload.accountType;
        user.avatar = payload.avatar;
        user.nickname = payload.nickname;
        req.user = user;
        return true;
    }
};
exports.SignupSessionGuard = SignupSessionGuard;
exports.SignupSessionGuard = SignupSessionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService])
], SignupSessionGuard);
let SignupAccessGuard = class SignupAccessGuard {
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const token = this.authService.extractTokenFromReq(req, true);
        const payload = this.authService.verifyToken(token, false);
        const user = await this.usersService.getUserByEmail(payload.email);
        if (!user) {
            throw new common_1.NotFoundException('가입되지 않은 사용자입니다.');
        }
        if (user.status !== status_const_1.StatusEnum.unauthorized) {
            throw new common_1.ForbiddenException('비정상적인 접근입니다.');
        }
        user.accountType = payload.accountType;
        req.user = user;
        return true;
    }
};
exports.SignupAccessGuard = SignupAccessGuard;
exports.SignupAccessGuard = SignupAccessGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService])
], SignupAccessGuard);
let PublicAccessGuard = class PublicAccessGuard {
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        if (req.headers.authorization === undefined) {
            return true;
        }
        const token = this.authService.extractTokenFromReq(req, true);
        const payload = this.authService.verifyToken(token, false);
        const user = await this.usersService.getUserByEmail(payload.email);
        if (!user) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        if (user.status !== status_const_1.StatusEnum.activated) {
            throw new common_1.ForbiddenException('활성화 되지않은 계정입니다.');
        }
        req.user = user;
    }
};
exports.PublicAccessGuard = PublicAccessGuard;
exports.PublicAccessGuard = PublicAccessGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService])
], PublicAccessGuard);
//# sourceMappingURL=before-login.guard.js.map