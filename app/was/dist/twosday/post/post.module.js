"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwosdayPostModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("../../auth/auth.module");
const aws_module_1 = require("../../aws/aws.module");
const common_module_1 = require("../../common/common.module");
const user_module_1 = require("../../user/user.module");
const post_entity_1 = require("./entity/post.entity");
const post_controller_1 = require("./post.controller");
const post_service_1 = require("./post.service");
const tag_module_1 = require("../tag/tag.module");
let TwosdayPostModule = class TwosdayPostModule {
};
exports.TwosdayPostModule = TwosdayPostModule;
exports.TwosdayPostModule = TwosdayPostModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            common_module_1.CommonModule,
            aws_module_1.AwsModule,
            tag_module_1.TwosdayTagModule,
            typeorm_1.TypeOrmModule.forFeature([post_entity_1.TwosdayPostModel]),
        ],
        controllers: [post_controller_1.TwosdayPostController],
        providers: [post_service_1.TwosdayPostService],
        exports: [post_service_1.TwosdayPostService],
    })
], TwosdayPostModule);
//# sourceMappingURL=post.module.js.map