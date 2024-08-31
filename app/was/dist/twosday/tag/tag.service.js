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
exports.TwosdayTagService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const common_service_1 = require("../../common/common.service");
const typeorm_2 = require("typeorm");
const tag_entity_1 = require("./entity/tag.entity");
let TwosdayTagService = class TwosdayTagService {
    constructor(postsRepository, configService, commonService) {
        this.postsRepository = postsRepository;
        this.configService = configService;
        this.commonService = commonService;
    }
    async getAllTags() {
        const tagModels = await this.postsRepository.find({
            order: { name: 'ASC' },
            select: ['id', 'name'],
        });
        return tagModels;
    }
    async postTag(tag) {
        try {
            const tagModel = this.postsRepository.create({
                name: tag,
            });
            const newTag = await this.postsRepository.save(tagModel);
            return newTag;
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.ConflictException('이미 존재하는 태그입니다.');
            }
        }
    }
    async patchTag(id, tag) {
        try {
            const result = await this.postsRepository.update({ id }, { name: tag });
            return result;
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.ConflictException('이미 존재하는 태그입니다.');
            }
        }
    }
    async deleteTag(id) {
        const result = await this.postsRepository.delete({ id });
        return result;
    }
};
exports.TwosdayTagService = TwosdayTagService;
exports.TwosdayTagService = TwosdayTagService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tag_entity_1.TwosdayTagModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService,
        common_service_1.CommonService])
], TwosdayTagService);
//# sourceMappingURL=tag.service.js.map