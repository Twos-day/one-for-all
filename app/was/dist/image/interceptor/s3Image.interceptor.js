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
exports.S3ImageInterceptor = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path_1 = require("path");
const operators_1 = require("rxjs/operators");
const aws_service_1 = require("../../aws/aws.service");
const uuid_1 = require("uuid");
const image_service_1 = require("../image.service");
const multerOptions = {
    limits: {
        fieldSize: 10000000,
    },
    fileFilter: (req, file, cb) => {
        const ext = (0, path_1.extname)(file.originalname);
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            return cb(new common_1.BadRequestException('jpg/jpeg/png 파일만 업로드 가능합니다.'));
        }
        return cb(null, true);
    },
};
let S3ImageInterceptor = class S3ImageInterceptor {
    constructor(configService, awsService, imageService) {
        this.configService = configService;
        this.awsService = awsService;
        this.imageService = imageService;
    }
    get uploader() {
        multerOptions.storage = multerS3({
            s3: this.awsService.s3Client,
            bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
            key: function (request, file, cb) {
                const fileName = (0, uuid_1.v4)() + (0, path_1.extname)(file.originalname);
                cb(null, fileName);
            },
        });
        return multer(multerOptions).single('image');
    }
    upload(request, response) {
        return new Promise((resolve, reject) => {
            this.uploader(request, response, (error) => {
                return error ? reject(error) : resolve(request);
            });
        });
    }
    async intercept(context, next) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const user = request.user;
        if (!user) {
            throw new common_1.BadRequestException('사용자 정보가 없습니다.');
        }
        await this.upload(request, response);
        if (!request.file) {
            throw new common_1.BadRequestException('이미지 파일이 없습니다.');
        }
        this.imageService.saveMetadata(user.email, request.file.key);
        return next
            .handle()
            .pipe((0, operators_1.tap)(() => common_1.Logger.log(`S3ImageInterceptor: S3-Bucket 이미지 저장성공. 유저 이메일: ${user.email}, 이미지 키: ${request.file.key}`)));
    }
};
exports.S3ImageInterceptor = S3ImageInterceptor;
exports.S3ImageInterceptor = S3ImageInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        aws_service_1.AwsService,
        image_service_1.ImageService])
], S3ImageInterceptor);
//# sourceMappingURL=s3Image.interceptor.js.map