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
exports.DiskImageInterceptor = void 0;
const common_1 = require("@nestjs/common");
const multer = require("multer");
const path_1 = require("path");
const operators_1 = require("rxjs/operators");
const uuid_1 = require("uuid");
const path_const_1 = require("../const/path.const");
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
    storage: multer.diskStorage({
        destination: (req, res, cb) => {
            console.log(path_const_1.POSTS_FOLDER_PATH);
            return cb(null, path_const_1.POSTS_FOLDER_PATH);
        },
        filename: (req, file, cb) => {
            cb(null, (0, uuid_1.v4)() + (0, path_1.extname)(file.originalname));
        },
    }),
};
let DiskImageInterceptor = class DiskImageInterceptor {
    constructor() { }
    get uploader() {
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
        await this.upload(request, response);
        if (!request.file) {
            throw new common_1.BadRequestException('이미지 파일이 없습니다.');
        }
        return next
            .handle()
            .pipe((0, operators_1.tap)(() => common_1.Logger.log('DiskImageInterceptor: 로컬 이미지 저장성공')));
    }
};
exports.DiskImageInterceptor = DiskImageInterceptor;
exports.DiskImageInterceptor = DiskImageInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DiskImageInterceptor);
//# sourceMappingURL=diskImage.interceptor.js.map