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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const status_const_1 = require("./const/status.const");
const user_entity_1 = require("./entities/user.entity");
const date_fns_1 = require("date-fns");
let UserService = class UserService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async getUserById(id) {
        return this.usersRepository.findOne({ where: { id } });
    }
    async getUserByEmail(email) {
        return this.usersRepository.findOne({ where: { email } });
    }
    async deleteUser(id) {
        return await this.usersRepository.update(id, {
            deletedAt: () => 'CURRENT_TIMESTAMP',
            status: status_const_1.StatusEnum.deactivated,
        });
    }
    async registerUser(dto) {
        const newUser = this.usersRepository.create({
            email: dto.email,
            nickname: dto.email.split('@')[0],
            status: status_const_1.StatusEnum.unauthorized,
        });
        return await this.usersRepository.save(newUser);
    }
    async patchUser(user, dto, accountType) {
        const updatedUser = {
            ...user,
            ...dto,
            accountType,
            status: status_const_1.StatusEnum.activated,
        };
        const result = await this.usersRepository.save(updatedUser);
        return result;
    }
    async generateVerificationCode(id) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('존재하지 않는 사용자입니다.');
        }
        if (user.status === status_const_1.StatusEnum.deactivated) {
            throw new common_1.ForbiddenException('접근이 제한된 사용자입니다.');
        }
        const verificationCode = Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, '0');
        await this.usersRepository.update(user.id, {
            verificationCode,
            expiresAt: new Date(Date.now() + 1000 * 60 * 30),
        });
        return { email: user.email, code: verificationCode };
    }
    async checkVerificationCode(dto) {
        const user = await this.usersRepository.findOne({
            where: { id: dto.id, email: dto.email },
        });
        if (!user) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        if (user.verificationCode !== dto.code) {
            throw new common_1.ForbiddenException('인증번호가 일치하지 않습니다.');
        }
        if (!user.expiresAt || (0, date_fns_1.isAfter)(new Date(), user.expiresAt)) {
            throw new common_1.ForbiddenException('인증번호가 만료되었습니다.');
        }
        await this.usersRepository.update(dto.id, { expiresAt: null });
        return user;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map