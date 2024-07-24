"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonService = void 0;
const common_1 = require("@nestjs/common");
const base_pagination_dto_1 = require("./dto/base-pagination.dto");
const filter_mapper_const_1 = require("./const/filter-mapper.const");
let CommonService = class CommonService {
    paginate(dto, repository, overrideFindOptions = {}, path) {
        if (dto.page) {
            return this.pagePaginate(dto, repository, overrideFindOptions);
        }
        else {
            return this.cursorPaginate(dto, repository, path, overrideFindOptions);
        }
    }
    async pagePaginate(dto, repository, overrideFindOptions) {
        const findOptions = this.composeFindOptions(dto);
        const [results, total] = await repository.findAndCount({
            ...findOptions,
            ...overrideFindOptions,
        });
        return {
            data: results,
            total,
        };
    }
    async cursorPaginate(dto, repository, url, overrideFindOptions) {
        const findOptions = this.composeFindOptions(dto);
        const results = await repository.find({
            ...findOptions,
            ...overrideFindOptions,
        });
        const lastPost = results.length > 0 && results.length === dto.take ? results.at(-1) : null;
        const nextUrl = lastPost && new URL(url);
        if (nextUrl) {
            for (const key in dto) {
                if (dto[key] && !key.startsWith('where__id')) {
                    nextUrl.searchParams.append(key, dto[key]);
                }
            }
            const idKey = dto.order__createdAt === base_pagination_dto_1.OrderBy.ASC
                ? 'id__more_than'
                : 'id__less_than';
            nextUrl.searchParams.append('where__' + idKey, lastPost.id.toString());
        }
        return {
            data: results,
            cursor: {
                after: lastPost?.id || null,
            },
            count: results.length,
            next: nextUrl?.toString() || null,
        };
    }
    composeFindOptions(dto) {
        let where = {};
        let order = {};
        for (const [key, value] of Object.entries(dto)) {
            if (key.startsWith('where__')) {
                where = {
                    ...where,
                    ...this.parseWhereFilter(key, value),
                };
            }
            else if (key.startsWith('order__')) {
                order = {
                    ...order,
                    ...this.parseWhereFilter(key, value),
                };
            }
        }
        return {
            where,
            order,
            take: dto.take,
            skip: dto.page ? dto.take * (dto.page - 1) : null,
        };
    }
    parseWhereFilter(key, value) {
        const options = {};
        const split = key.split('__');
        if (split.length !== 2 && split.length !== 3) {
            throw new common_1.BadRequestException(`where 필터는 '__'로 slpit 했을때 길이가 2 또는 3이어야 합니다 - key: ${key}`);
        }
        if (split.length === 2) {
            options[split[1]] = value;
        }
        else {
            const field = split[1];
            const operator = split[2];
            const values = value.toString().split(',');
            if (operator === 'i_like') {
                const filter = '%' + values[0] + '%';
                options[field] = filter_mapper_const_1.FILTER_MAPPER[operator](filter);
            }
            else {
                options[field] = filter_mapper_const_1.FILTER_MAPPER[operator](...values);
            }
        }
        return options;
    }
};
exports.CommonService = CommonService;
exports.CommonService = CommonService = __decorate([
    (0, common_1.Injectable)()
], CommonService);
//# sourceMappingURL=common.service.js.map