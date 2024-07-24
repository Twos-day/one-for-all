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
exports.AwsService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const path_1 = require("path");
const extname_const_1 = require("../image/const/extname.const");
const uuid_1 = require("uuid");
let AwsService = class AwsService {
    constructor(configService) {
        this.configService = configService;
        this.s3Client = new client_s3_1.S3Client({
            region: this.configService.get('AWS_REGION'),
            credentials: {
                accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
                secretAccessKey: this.configService.get('AWS_S3_SECRET_KEY'),
            },
        });
    }
    async imageUploadToS3(file) {
        const id = (0, uuid_1.v4)();
        const ext = (0, path_1.extname)(file.originalname);
        const fileName = id + ext;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        });
        await this.s3Client.send(command);
        common_1.Logger.log(`AWS S3 이미지 업로드 성공, 파일명: ${fileName}`);
        return { path: fileName };
    }
    async generatePresignedUrl(projectName, userId, fileName) {
        const id = (0, uuid_1.v4)();
        const ext = (0, path_1.extname)(fileName);
        if (!extname_const_1.IMAGE_EXTNAME_LIST.includes(ext)) {
            throw new common_1.BadRequestException('지원하지 않는 파일 형식입니다.');
        }
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
            Key: [projectName, userId.toString(), id + ext].join('/'),
        });
        return (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn: 3600 });
    }
};
exports.AwsService = AwsService;
exports.AwsService = AwsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AwsService);
//# sourceMappingURL=aws.service.js.map