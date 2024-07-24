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
exports.BasePaginationDto = exports.OrderBy = void 0;
const class_validator_1 = require("class-validator");
var OrderBy;
(function (OrderBy) {
    OrderBy["ASC"] = "ASC";
    OrderBy["DESC"] = "DESC";
})(OrderBy || (exports.OrderBy = OrderBy = {}));
class BasePaginationDto {
    constructor() {
        this.order__createdAt = OrderBy.ASC;
        this.take = 20;
    }
}
exports.BasePaginationDto = BasePaginationDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BasePaginationDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BasePaginationDto.prototype, "where__id__less_than", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BasePaginationDto.prototype, "where__id__more_than", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(OrderBy),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BasePaginationDto.prototype, "order__createdAt", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BasePaginationDto.prototype, "take", void 0);
//# sourceMappingURL=base-pagination.dto.js.map