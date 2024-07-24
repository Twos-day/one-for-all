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
exports.TwosdayReferenceController = void 0;
const common_1 = require("@nestjs/common");
const reference_service_1 = require("./reference.service");
const create_reference_dto_1 = require("./dto/create-reference.dto");
let TwosdayReferenceController = class TwosdayReferenceController {
    constructor(referenceService) {
        this.referenceService = referenceService;
    }
    async get(page) {
        const [data, total] = await this.referenceService.getReferences(page);
        return {
            message: ['레퍼런스가 조회되었습니다.'],
            data: {
                reference: data,
                total,
                length: data.length,
            },
        };
    }
    async post(body) {
        const vid = this.referenceService.extractYoutubeVId(body.url);
        let info;
        if (vid) {
            info = await this.referenceService.getYoutubeInfoByVId(vid);
        }
        else {
            info = await this.referenceService.crawlingUrl(body.url);
        }
        await this.referenceService.createReference(info);
        return { message: ['레퍼런스가 저장되었습니다.'] };
    }
};
exports.TwosdayReferenceController = TwosdayReferenceController;
__decorate([
    (0, common_1.Get)('reference'),
    __param(0, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TwosdayReferenceController.prototype, "get", null);
__decorate([
    (0, common_1.Post)('reference'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reference_dto_1.CreateReferenceDto]),
    __metadata("design:returntype", Promise)
], TwosdayReferenceController.prototype, "post", null);
exports.TwosdayReferenceController = TwosdayReferenceController = __decorate([
    (0, common_1.Controller)('api/twosday'),
    __metadata("design:paramtypes", [reference_service_1.TwosdayReferenceService])
], TwosdayReferenceController);
//# sourceMappingURL=reference.controller.js.map