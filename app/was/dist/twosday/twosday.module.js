"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwosdayModule = void 0;
const common_1 = require("@nestjs/common");
const post_module_1 = require("./post/post.module");
const tag_module_1 = require("./tag/tag.module");
const twosday_controller_1 = require("./twosday.controller");
const twosday_service_1 = require("./twosday.service");
const reference_module_1 = require("./reference/reference.module");
let TwosdayModule = class TwosdayModule {
};
exports.TwosdayModule = TwosdayModule;
exports.TwosdayModule = TwosdayModule = __decorate([
    (0, common_1.Module)({
        imports: [post_module_1.TwosdayPostModule, tag_module_1.TwosdayTagModule, reference_module_1.TwosdayReferenceModule],
        controllers: [twosday_controller_1.TwosdayController],
        providers: [twosday_service_1.TwosdayService],
    })
], TwosdayModule);
//# sourceMappingURL=twosday.module.js.map