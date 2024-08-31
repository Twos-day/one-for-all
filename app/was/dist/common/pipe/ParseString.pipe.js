"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseStringPipe = void 0;
const common_1 = require("@nestjs/common");
let ParseStringPipe = class ParseStringPipe {
    transform(value) {
        if (typeof value !== 'string') {
            throw new common_1.BadRequestException('문자열만 입력할 수 있습니다.');
        }
        if (value.trim().length < 1) {
            throw new common_1.BadRequestException('공백은 입력할 수 없습니다.');
        }
        return value;
    }
};
exports.ParseStringPipe = ParseStringPipe;
exports.ParseStringPipe = ParseStringPipe = __decorate([
    (0, common_1.Injectable)()
], ParseStringPipe);
//# sourceMappingURL=ParseString.pipe.js.map