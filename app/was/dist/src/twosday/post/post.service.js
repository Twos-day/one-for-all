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
exports.TwosdayPostService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const common_service_1 = require("../../common/common.service");
const typeorm_2 = require("typeorm");
const tag_service_1 = require("../tag/tag.service");
const post_entity_1 = require("./entity/post.entity");
let TwosdayPostService = class TwosdayPostService {
    constructor(postsRepository, commonService, tagsService) {
        this.postsRepository = postsRepository;
        this.commonService = commonService;
        this.tagsService = tagsService;
    }
    async getAllPosts() {
        return this.postsRepository.find({
            relations: ['author', 'tags'],
            where: { isPublic: true },
            select: {
                author: {
                    email: true,
                    avatar: true,
                    nickname: true,
                },
                deletedAt: false,
            },
        });
    }
    async getPostById(postId) {
        const post = await this.postsRepository.findOne({
            relations: ['author', 'tags'],
            where: { id: postId },
        });
        if (!post) {
            throw new common_1.NotFoundException();
        }
        if (!post.isPublic) {
            throw new common_1.ForbiddenException('접근 할 수 없는 게시글입니다.');
        }
        await this.postsRepository.increment({ id: postId }, 'viewCount', 1);
        post.viewCount += 1;
        return post;
    }
    async createPost(authorId, postDto) {
        const tagsModel = await this.tagsService.getTags(postDto.tags);
        const post = this.postsRepository.create({
            author: { id: authorId },
            ...postDto,
            tags: tagsModel,
        });
        const newPost = await this.postsRepository.save(post);
        return newPost;
    }
    async updatePost(postId, postDto) {
        const post = await this.postsRepository.findOne({ where: { id: postId } });
        if (!post)
            throw new common_1.NotFoundException();
        if (postDto.title)
            post.title = postDto.title;
        if (postDto.content)
            post.content = postDto.content;
        return this.postsRepository.save(post);
    }
    async deletePost(postId) {
        const result = await this.postsRepository.softDelete(postId);
        if (!result.affected)
            throw new common_1.NotFoundException();
        return postId;
    }
};
exports.TwosdayPostService = TwosdayPostService;
exports.TwosdayPostService = TwosdayPostService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.TwosdayPostModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        common_service_1.CommonService,
        tag_service_1.TwosdayTagService])
], TwosdayPostService);
//# sourceMappingURL=post.service.js.map