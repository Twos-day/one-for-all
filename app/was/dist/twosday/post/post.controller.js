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
exports.TwosdayPostController = void 0;
const after_login_guard_1 = require("../../auth/guard/after-login.guard");
const common_1 = require("@nestjs/common");
const user_decorator_1 = require("../../user/decorator/user.decorator");
const post_dto_1 = require("./dto/post.dto");
const update_post_dto_1 = require("./dto/update-post.dto");
const post_service_1 = require("./post.service");
let TwosdayPostController = class TwosdayPostController {
    constructor(twosdayPostService) {
        this.twosdayPostService = twosdayPostService;
    }
    async getAllPost() {
        const posts = await this.twosdayPostService.getAllPosts();
        return { data: { posts }, message: ['게시글이 조회되었습니다.'] };
    }
    async getPostsById(id) {
        const post = await this.twosdayPostService.getPostById(id);
        return { data: post, message: ['게시글이 조회되었습니다.'] };
    }
    async postPosts(userId, postDto) {
        const result = await this.twosdayPostService.createPost(userId, postDto);
        return { data: { id: result.id }, message: ['게시글이 생성되었습니다.'] };
    }
    async patchPostsById(id, postDto) {
        const result = await this.twosdayPostService.updatePost(id, postDto);
        return { data: { id: result.id }, message: ['게시글이 수정되었습니다.'] };
    }
    async deletePostsById(id) {
        const result = await this.twosdayPostService.deletePost(id);
        return { data: { id: result }, message: ['게시글이 삭제되었습니다.'] };
    }
};
exports.TwosdayPostController = TwosdayPostController;
__decorate([
    (0, common_1.Get)('post'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TwosdayPostController.prototype, "getAllPost", null);
__decorate([
    (0, common_1.Get)('post/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TwosdayPostController.prototype, "getPostsById", null);
__decorate([
    (0, common_1.Post)('post'),
    (0, common_1.UseGuards)(after_login_guard_1.AccessGuard),
    __param(0, (0, user_decorator_1.User)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, post_dto_1.PostDto]),
    __metadata("design:returntype", Promise)
], TwosdayPostController.prototype, "postPosts", null);
__decorate([
    (0, common_1.Patch)('post/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_post_dto_1.UpdatePostDto]),
    __metadata("design:returntype", Promise)
], TwosdayPostController.prototype, "patchPostsById", null);
__decorate([
    (0, common_1.Delete)('post/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TwosdayPostController.prototype, "deletePostsById", null);
exports.TwosdayPostController = TwosdayPostController = __decorate([
    (0, common_1.Controller)('api/twosday'),
    __metadata("design:paramtypes", [post_service_1.TwosdayPostService])
], TwosdayPostController);
//# sourceMappingURL=post.controller.js.map