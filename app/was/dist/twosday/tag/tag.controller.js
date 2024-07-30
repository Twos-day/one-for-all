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
exports.TwosdayTagController = void 0;
const common_1 = require("@nestjs/common");
const tag_service_1 = require("./tag.service");
const after_login_guard_1 = require("../../auth/guard/after-login.guard");
const ParseString_pipe_1 = require("../../common/pipe/ParseString.pipe");
let TwosdayTagController = class TwosdayTagController {
    constructor(tagService) {
        this.tagService = tagService;
    }
    async getAllTags() {
        const tags = await this.tagService.getAllTags();
        return { data: tags, message: ['태그가 조회되었습니다.'] };
    }
    async postTag(name) {
        const tagModel = await this.tagService.postTag(name);
        return {
            data: { id: tagModel.id, name: tagModel.name },
            message: ['태그가 생성되었습니다.'],
        };
    }
    async patchTag(id, name) {
        await this.tagService.patchTag(id, name);
        return { data: null, message: ['태그가 수정되었습니다.'] };
    }
    async deleteTag(id) {
        await this.tagService.deleteTag(id);
        return { data: null, message: ['태그가 삭제되었습니다.'] };
    }
};
exports.TwosdayTagController = TwosdayTagController;
__decorate([
    (0, common_1.Get)('tag'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TwosdayTagController.prototype, "getAllTags", null);
__decorate([
    (0, common_1.Post)('tag'),
    __param(0, (0, common_1.Body)('name', ParseString_pipe_1.ParseStringPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TwosdayTagController.prototype, "postTag", null);
__decorate([
    (0, common_1.Patch)('tag/:id'),
    (0, common_1.UseGuards)(after_login_guard_1.AccessGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('name', ParseString_pipe_1.ParseStringPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], TwosdayTagController.prototype, "patchTag", null);
__decorate([
    (0, common_1.Delete)('tag/:id'),
    (0, common_1.UseGuards)(after_login_guard_1.AccessGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TwosdayTagController.prototype, "deleteTag", null);
exports.TwosdayTagController = TwosdayTagController = __decorate([
    (0, common_1.Controller)('api/twosday'),
    __metadata("design:paramtypes", [tag_service_1.TwosdayTagService])
], TwosdayTagController);
//# sourceMappingURL=tag.controller.js.map