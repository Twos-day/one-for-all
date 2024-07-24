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
exports.SessoionUserGuard = exports.AccessGuard = void 0;
const status_const_1 = require("../../user/const/status.const");
const common_1 = require("@nestjs/common");
const user_service_1 = require("../../user/user.service");
const auth_service_1 = require("../auth.service");
let AccessGuard = class AccessGuard {
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
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        if (user.status !== status_const_1.StatusEnum.activated) {
            throw new common_1.ForbiddenException('활성화 되지않은 계정입니다.');
        }
        req.user = user;
        return true;
    }
};
exports.AccessGuard = AccessGuard;
exports.AccessGuard = AccessGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService])
], AccessGuard);
let SessoionUserGuard = class SessoionUserGuard {
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
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        if (user.status !== status_const_1.StatusEnum.activated) {
            throw new common_1.ForbiddenException('비정상적인 접근입니다.');
        }
        req.user = user;
        return true;
    }
};
exports.SessoionUserGuard = SessoionUserGuard;
exports.SessoionUserGuard = SessoionUserGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService])
], SessoionUserGuard);
//# sourceMappingURL=after-login.guard.js.map