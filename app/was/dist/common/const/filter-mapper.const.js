"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FILTER_MAPPER = void 0;
const typeorm_1 = require("typeorm");
exports.FILTER_MAPPER = {
    any: typeorm_1.Any,
    array_contained_by: typeorm_1.ArrayContainedBy,
    array_contains: typeorm_1.ArrayContains,
    array_overlap: typeorm_1.ArrayOverlap,
    between: typeorm_1.Between,
    equal: typeorm_1.Equal,
    i_like: typeorm_1.ILike,
    in: typeorm_1.In,
    is_null: typeorm_1.IsNull,
    less_than: typeorm_1.LessThan,
    less_than_or_equal: typeorm_1.LessThanOrEqual,
    like: typeorm_1.Like,
    more_than: typeorm_1.MoreThan,
    more_than_or_equal: typeorm_1.MoreThanOrEqual,
    not: typeorm_1.Not,
};
//# sourceMappingURL=filter-mapper.const.js.map