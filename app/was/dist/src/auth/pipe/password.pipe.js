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
exports.MinLengthPipe = exports.MaxLengthPipe = exports.PasswordPipe = void 0;
const common_1 = require("@nestjs/common");
let PasswordPipe = class PasswordPipe {
    transform(value, _metadata) {
        const str = value.toString();
        if (str.toString().length > 8) {
            throw new common_1.BadRequestException('비밀번호는 8자 이하로 입력해주세요.');
        }
        return str;
    }
};
exports.PasswordPipe = PasswordPipe;
exports.PasswordPipe = PasswordPipe = __decorate([
    (0, common_1.Injectable)()
], PasswordPipe);
let MaxLengthPipe = class MaxLengthPipe {
    constructor(maxLength) {
        this.maxLength = maxLength;
    }
    transform(value, _metadata) {
        const str = value.toString();
        if (str.length > this.maxLength) {
            throw new common_1.BadRequestException(`최대 ${this.maxLength}자 이하로 입력해주세요.`);
        }
        return str;
    }
};
exports.MaxLengthPipe = MaxLengthPipe;
exports.MaxLengthPipe = MaxLengthPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Number])
], MaxLengthPipe);
let MinLengthPipe = class MinLengthPipe {
    constructor(minLength) {
        this.minLength = minLength;
    }
    transform(value, _metadata) {
        const str = value.toString();
        if (str.length < this.minLength) {
            throw new common_1.BadRequestException(`최소 ${this.minLength}자 이상으로 입력해주세요.`);
        }
        return str;
    }
};
exports.MinLengthPipe = MinLengthPipe;
exports.MinLengthPipe = MinLengthPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Number])
], MinLengthPipe);
//# sourceMappingURL=password.pipe.js.map