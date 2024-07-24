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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const mail_service_1 = require("../mail/mail.service");
const account_type_const_1 = require("../user/const/account-type.const");
const user_decorator_1 = require("../user/decorator/user.decorator");
const user_entity_1 = require("../user/entities/user.entity");
const user_service_1 = require("../user/user.service");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const bycrypt = require("bcrypt");
const auth_service_1 = require("./auth.service");
const google_user_decorator_1 = require("./decorator/google-user.decorator");
const kakao_user_decorator_1 = require("./decorator/kakao-user.decorator");
const email_user_dto_1 = require("./dto/email-user.dto");
const session_dto_1 = require("./dto/session.dto");
const social_user_dto_1 = require("./dto/social-user.dto");
const before_login_guard_1 = require("./guard/before-login.guard");
const after_login_guard_1 = require("./guard/after-login.guard");
let AuthController = class AuthController {
    constructor(authService, mailService, userService) {
        this.authService = authService;
        this.mailService = mailService;
        this.userService = userService;
    }
    async googleAuth() { }
    googleAuthRedirect(googleUser, req) {
        return this.authService.veryfySocialUser(req, googleUser, account_type_const_1.AccountType.google);
    }
    async kakaoAuth() { }
    kakaoAuthRedirect(kakaoUser, req) {
        return this.authService.veryfySocialUser(req, kakaoUser, account_type_const_1.AccountType.kakao);
    }
    async postSignupEmail(emailUser, req) {
        let user = await this.userService.getUserByEmail(emailUser.email);
        if (!user) {
            user = await this.userService.registerUser(emailUser);
        }
        this.authService.verifyEmailUser(req, user);
        return {
            data: { id: user.id },
            message: ['사용자정보 추가등록을 진행합니다.'],
        };
    }
    async postVerificationCode(id) {
        const user = await this.userService.getUserById(id);
        if (!user) {
            throw new common_1.NotFoundException('존재하지 않는 사용자입니다.');
        }
        const { email, code } = await this.userService.generateVerificationCode(user.id);
        await this.mailService.sendVerificationCode(email, code);
        common_1.Logger.log(`회원가입 이메일이 전송되었습니다. ${id} - ${email}`);
        return { data: null, message: ['메일이 성공적으로 전송되었습니다.'] };
    }
    async checkVerificationCode(dto) {
        const user = await this.userService.checkVerificationCode(dto);
        user.accountType = account_type_const_1.AccountType.email;
        const token = this.authService.generateRefreshToken(user);
        return { data: { token }, message: ['인증번호가 확인되었습니다.'] };
    }
    async getVerification(user) {
        const session = this.authService.createSession(user);
        return { data: session, message: ['세션이 조회되었습니다.'] };
    }
    async patchSignupEmail(user, dto, req) {
        dto.password = await bycrypt.hash(dto.password, Number(process.env.HASH_ROUNDS));
        const patchedUser = await this.userService.patchUser(user, dto, account_type_const_1.AccountType.email);
        const token = this.authService.generateRefreshToken(patchedUser);
        this.authService.setRefreshToken(req.res, token);
        return { data: null, message: ['회원가입이 완료 되었습니다.'] };
    }
    async patchSignupSocial(user, dto, req) {
        const patchedUser = await this.userService.patchUser(user, dto, user.accountType);
        const token = this.authService.generateRefreshToken(patchedUser);
        this.authService.setRefreshToken(req.res, token);
        return { data: null, message: ['회원가입이 완료 되었습니다.'] };
    }
    async postLoginEmail(user, req) {
        const refreshToken = this.authService.generateRefreshToken(user);
        this.authService.setRefreshToken(req.res, refreshToken);
        return { data: null, message: ['로그인 되었습니다.'] };
    }
    async getSession(user) {
        const session = this.authService.createSession(user);
        return { data: session, message: ['세션이 조회되었습니다.'] };
    }
    async deleteUser(id) {
        await this.userService.deleteUser(id);
        return { data: null, message: ['회원탈퇴가 완료되었습니다.'] };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('callback/google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, google_user_decorator_1.GoogleUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [social_user_dto_1.SocialUserDto, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, common_1.Get)('kakao'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('kakao')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "kakaoAuth", null);
__decorate([
    (0, common_1.Get)('callback/kakao'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('kakao')),
    __param(0, (0, kakao_user_decorator_1.KakaoUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [social_user_dto_1.SocialUserDto, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "kakaoAuthRedirect", null);
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_user_dto_1.PostEmailUserDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "postSignupEmail", null);
__decorate([
    (0, common_1.Post)('verification/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "postVerificationCode", null);
__decorate([
    (0, common_1.Post)('verification'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_user_dto_1.PostVerificationDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkVerificationCode", null);
__decorate([
    (0, common_1.Get)('verification'),
    (0, common_1.UseGuards)(before_login_guard_1.SignupSessionGuard),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserModel]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getVerification", null);
__decorate([
    (0, common_1.UseGuards)(before_login_guard_1.SignupAccessGuard),
    (0, common_1.Post)('signup/email'),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserModel,
        email_user_dto_1.PatchEmailUserDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "patchSignupEmail", null);
__decorate([
    (0, common_1.UseGuards)(before_login_guard_1.SignupAccessGuard),
    (0, common_1.Post)('signup/social'),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserModel,
        social_user_dto_1.PatchSocialUserDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "patchSignupSocial", null);
__decorate([
    (0, common_1.UseGuards)(before_login_guard_1.BasicTokenGuard),
    (0, common_1.Post)('email'),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserModel, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "postLoginEmail", null);
__decorate([
    (0, common_1.Get)('session'),
    (0, swagger_1.ApiOperation)({
        summary: '세션 조회',
        description: '리프레시 토큰을 이용하여 세션을 반환합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '세션 조회 성공',
        type: session_dto_1.SessionDto,
    }),
    (0, common_1.UseGuards)(after_login_guard_1.SessoionUserGuard),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserModel]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getSession", null);
__decorate([
    (0, common_1.UseGuards)(after_login_guard_1.AccessGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, user_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteUser", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('api/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        mail_service_1.MailService,
        user_service_1.UserService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map