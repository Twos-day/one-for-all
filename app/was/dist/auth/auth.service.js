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
exports.AuthService = void 0;
const account_type_const_1 = require("../user/const/account-type.const");
const status_const_1 = require("../user/const/status.const");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bycrypt = require("bcrypt");
const user_service_1 = require("../user/user.service");
const excute_root_domain_1 = require("./util/excute-root-domain");
const getServerUrl_1 = require("../common/util/getServerUrl");
let AuthService = class AuthService {
    constructor(jwrService, userService, configService) {
        this.jwrService = jwrService;
        this.userService = userService;
        this.configService = configService;
    }
    extractTokenFromReq(req, isBearer) {
        const rawToken = req.headers.authorization;
        if (!rawToken) {
            throw new common_1.BadRequestException('토큰이 없습니다.');
        }
        const [type, token] = rawToken.split(' ');
        const prefix = isBearer ? 'Bearer' : 'Basic';
        const isValidate = type && token && prefix === type;
        if (!isValidate) {
            throw new common_1.BadRequestException('잘못된 토큰입니다.');
        }
        return token;
    }
    decodeBasicToken(token) {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const [email, password] = decoded.split(':');
        if (!email || !password) {
            throw new common_1.BadRequestException('잘못된 토큰입니다.');
        }
        return { email, password };
    }
    async veryfySocialUser(req, socialUser, accountType) {
        let user = await this.userService.getUserByEmail(socialUser.email);
        if (!user) {
            user = await this.userService.registerUser(socialUser);
        }
        const serverUrl = (0, getServerUrl_1.getServerUrl)();
        const redirectUrl = req.cookies.redirect || serverUrl;
        if (user.accountType && user.accountType !== accountType) {
            const cause = `${accountType.toUpperCase()} 계정으로 가입된 사용자가 아닙니다.`;
            return req.res.redirect(`${serverUrl}/unAuthorized?cause=${encodeURIComponent(cause)}`);
        }
        if (user.status === status_const_1.StatusEnum.deactivated) {
            const cause = '접근할 수 없는 계정입니다.';
            return req.res.redirect(`${serverUrl}/unAuthorized?cause=${encodeURIComponent(cause)}`);
        }
        if (user.status === status_const_1.StatusEnum.unauthorized) {
            user.accountType = accountType;
            user.avatar = socialUser.avatar;
            user.nickname = socialUser.nickname;
            const token = this.generateRefreshToken(user);
            return req.res.redirect(`${serverUrl}/signup/register?token=${token}`);
        }
        if (user.accountType === accountType &&
            user.status === status_const_1.StatusEnum.activated) {
            const refreshToken = this.generateRefreshToken(user);
            this.setRefreshToken(req.res, refreshToken);
            return req.res.redirect(`${redirectUrl}`);
        }
        throw new common_1.InternalServerErrorException('관리자에게 문의하세요.');
    }
    verifyEmailUser(req, user) {
        const redirectUrl = req.cookies.redirect || (0, getServerUrl_1.getServerUrl)();
        if (user.accountType && user.accountType !== account_type_const_1.AccountType.email) {
            const cause = '이메일 계정으로 가입된 사용자가 아닙니다.';
            throw new common_1.UnauthorizedException(cause);
        }
        if (user.status === status_const_1.StatusEnum.deactivated) {
            const cause = '접근할 수 없는 계정입니다.';
            throw new common_1.UnauthorizedException(cause);
        }
        if (user.status !== status_const_1.StatusEnum.unauthorized) {
            throw new common_1.UnauthorizedException('이미 가입된 사용자입니다.');
        }
    }
    async authenticateWithEmailAndPassword(payload) {
        const existingUser = await this.userService.getUserByEmail(payload.email);
        if (!existingUser || existingUser.status === status_const_1.StatusEnum.unauthorized) {
            throw new common_1.BadRequestException('이메일 또는 비밀번호가 잘못되었습니다.');
        }
        if (existingUser.status === status_const_1.StatusEnum.deactivated) {
            throw new common_1.ForbiddenException('비활성화된 계정입니다.');
        }
        if (existingUser.accountType !== account_type_const_1.AccountType.email) {
            throw new common_1.ForbiddenException('이메일로 회원가입된 계정이 아닙니다.');
        }
        const isPass = await bycrypt.compare(payload.password, existingUser.password);
        if (!isPass) {
            throw new common_1.BadRequestException('이메일 또는 비밀번호가 잘못되었습니다.');
        }
        return existingUser;
    }
    verifyToken(token, isRefresh) {
        try {
            return this.jwrService.verify(token, {
                secret: isRefresh
                    ? process.env.REFRESH_SECRET
                    : process.env.ACCESS_SECRET,
            });
        }
        catch (e) {
            throw new common_1.UnauthorizedException('토큰이 만료되거나 잘못되었습니다.');
        }
    }
    generateRefreshToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            accountType: user.accountType,
            avatar: user.avatar,
            nickname: user.nickname,
        };
        const refreshToken = this.jwrService.sign(payload, {
            secret: process.env.REFRESH_SECRET,
            expiresIn: 60 * 60 * 24 * 3,
        });
        return refreshToken;
    }
    setRefreshToken(res, token) {
        res.cookie('refreshToken', token, {
            httpOnly: true,
            domain: (0, excute_root_domain_1.excuteRootDomain)(process.env.HOST),
            secure: process.env.PROTOCOL === 'https',
        });
    }
    createSession(user) {
        const session = {
            id: user.id,
            email: user.email,
            avatar: user.avatar,
            nickname: user.nickname,
            accountType: user.accountType,
            level: user.level,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        const accessToken = this.jwrService.sign(session, {
            secret: process.env.ACCESS_SECRET,
            expiresIn: 60 * 60,
        });
        return { ...session, accessToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_service_1.UserService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map