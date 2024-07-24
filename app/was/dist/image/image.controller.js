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
exports.ImageController = void 0;
const common_1 = require("@nestjs/common");
const image_service_1 = require("./image.service");
const aws_service_1 = require("../aws/aws.service");
const user_decorator_1 = require("../user/decorator/user.decorator");
const config_1 = require("@nestjs/config");
const log_service_1 = require("../log/log.service");
const after_login_guard_1 = require("../auth/guard/after-login.guard");
let ImageController = class ImageController {
    constructor(awsService, imageService, configService, logService) {
        this.awsService = awsService;
        this.imageService = imageService;
        this.configService = configService;
        this.logService = logService;
    }
    async postPresignedUrl(userId, email, projectName, fileName) {
        const url = await this.awsService.generatePresignedUrl(projectName, userId, fileName);
        const log = `사용자 ${email}에게 ${projectName} 프로젝트의 사진 업로드 URL 발급`;
        common_1.Logger.log(log);
        this.logService.sendDiscode(log);
        return { url };
    }
};
exports.ImageController = ImageController;
__decorate([
    (0, common_1.Post)('sign'),
    __param(0, (0, user_decorator_1.User)('id')),
    __param(1, (0, user_decorator_1.User)('email')),
    __param(2, (0, common_1.Body)('projectName')),
    __param(3, (0, common_1.Body)('fileName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "postPresignedUrl", null);
exports.ImageController = ImageController = __decorate([
    (0, common_1.UseGuards)(after_login_guard_1.AccessGuard),
    (0, common_1.Controller)('api/image'),
    __metadata("design:paramtypes", [aws_service_1.AwsService,
        image_service_1.ImageService,
        config_1.ConfigService,
        log_service_1.LogService])
], ImageController);
//# sourceMappingURL=image.controller.js.map