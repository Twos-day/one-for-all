"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwosdayTagModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("../../auth/auth.module");
const aws_module_1 = require("../../aws/aws.module");
const common_module_1 = require("../../common/common.module");
const user_module_1 = require("../../user/user.module");
const tag_entity_1 = require("./entity/tag.entity");
const tag_service_1 = require("./tag.service");
const tag_controller_1 = require("./tag.controller");
let TwosdayTagModule = class TwosdayTagModule {
};
exports.TwosdayTagModule = TwosdayTagModule;
exports.TwosdayTagModule = TwosdayTagModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            common_module_1.CommonModule,
            aws_module_1.AwsModule,
            typeorm_1.TypeOrmModule.forFeature([tag_entity_1.TwosdayTagModel]),
        ],
        controllers: [tag_controller_1.TwosdayTagController],
        providers: [tag_service_1.TwosdayTagService],
        exports: [tag_service_1.TwosdayTagService],
    })
], TwosdayTagModule);
//# sourceMappingURL=tag.module.js.map