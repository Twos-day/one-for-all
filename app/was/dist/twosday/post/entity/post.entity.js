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
exports.TwosdayPostModel = void 0;
const tag_entity_1 = require("../../tag/entity/tag.entity");
const base_entity_1 = require("../../../common/entity/base.entity");
const user_entity_1 = require("../../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
let TwosdayPostModel = class TwosdayPostModel extends base_entity_1.BaseModel {
};
exports.TwosdayPostModel = TwosdayPostModel;
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserModel, (user) => user.posts, { nullable: false }),
    __metadata("design:type", user_entity_1.UserModel)
], TwosdayPostModel.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => tag_entity_1.TwosdayTagModel, (tag) => tag.posts, { cascade: true }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], TwosdayPostModel.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], TwosdayPostModel.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TwosdayPostModel.prototype, "thumbnail", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], TwosdayPostModel.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], TwosdayPostModel.prototype, "isPublic", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], TwosdayPostModel.prototype, "viewCount", void 0);
exports.TwosdayPostModel = TwosdayPostModel = __decorate([
    (0, typeorm_1.Entity)('twosday_post_model')
], TwosdayPostModel);
//# sourceMappingURL=post.entity.js.map