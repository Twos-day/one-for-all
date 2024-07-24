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
exports.TwosdayReferenceService = exports.youtubeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reference_entity_1 = require("./entities/reference.entity");
const googleapis_1 = require("googleapis");
const cheerio = require("cheerio");
const typeorm_2 = require("typeorm");
exports.youtubeService = googleapis_1.google.youtube('v3');
let TwosdayReferenceService = class TwosdayReferenceService {
    constructor(referenceRepository) {
        this.referenceRepository = referenceRepository;
    }
    extractYoutubeVId(url) {
        const videoId = url
            .match(/(?:\?v=|&v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
            .trim();
        return videoId;
    }
    async getYoutubeInfoByVId(videoId) {
        const response = await exports.youtubeService.videos.list({
            part: ['id', 'snippet', 'statistics'],
            id: [videoId],
            key: process.env.GOOGLE_API_KEY,
        });
        const item = response.data.items?.[0];
        if (!item) {
            throw new common_1.NotFoundException(`${videoId} 해당하는 영상을 찾을 수 없습니다.`);
        }
        return {
            url: `https://www.youtube.com/watch?v=${videoId}`,
            title: item.snippet?.title || '',
            description: item.snippet?.description.replaceAll('\n', ' '),
            thumbnail: item.snippet?.thumbnails?.medium?.url || '',
        };
    }
    async crawlingUrl(url) {
        const response = await fetch(url);
        const body = await response.text();
        const $ = cheerio.load(body);
        const info = {
            url,
            title: $('title').text() || '',
            description: $('meta[name="description"]').attr('content') || '',
            thumbnail: $('meta[property="og:image"]').attr('content') || '',
        };
        return info;
    }
    async createReference(info) {
        const reference = this.referenceRepository.create(info);
        return this.referenceRepository.save(reference);
    }
    getReferences(page) {
        const PAGE_SIZE = 10;
        return this.referenceRepository.findAndCount({
            select: [
                'id',
                'title',
                'description',
                'thumbnail',
                'url',
                'createdAt',
                'updatedAt',
            ],
            skip: page < 2 ? 0 : (page - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
        });
    }
};
exports.TwosdayReferenceService = TwosdayReferenceService;
exports.TwosdayReferenceService = TwosdayReferenceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reference_entity_1.TwosdayReferenceModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TwosdayReferenceService);
//# sourceMappingURL=reference.service.js.map