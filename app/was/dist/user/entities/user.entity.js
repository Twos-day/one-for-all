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
exports.UserModel = void 0;
const base_entity_1 = require("../../common/entity/base.entity");
const image_entity_1 = require("../../image/entity/image.entity");
const post_entity_1 = require("../../twosday/post/entity/post.entity");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const account_type_const_1 = require("../const/account-type.const");
const status_const_1 = require("../const/status.const");
let UserModel = class UserModel extends base_entity_1.BaseModel {
};
exports.UserModel = UserModel;
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserModel.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], UserModel.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserModel.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserModel.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: account_type_const_1.AccountType, nullable: true }),
    __metadata("design:type", String)
], UserModel.prototype, "accountType", void 0);
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserModel.prototype, "verificationCode", void 0);
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, typeorm_1.Column)({
        type: 'timestamp',
        nullable: true,
    }),
    __metadata("design:type", Date)
], UserModel.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: status_const_1.StatusEnum }),
    __metadata("design:type", String)
], UserModel.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], UserModel.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => post_entity_1.TwosdayPostModel, (post) => post.author),
    __metadata("design:type", Array)
], UserModel.prototype, "posts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => image_entity_1.ImageModel, (image) => image.user),
    __metadata("design:type", Array)
], UserModel.prototype, "images", void 0);
exports.UserModel = UserModel = __decorate([
    (0, typeorm_1.Entity)()
], UserModel);
//# sourceMappingURL=user.entity.js.map