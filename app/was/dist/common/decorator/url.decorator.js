"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Url = void 0;
const common_1 = require("@nestjs/common");
exports.Url = (0, common_1.createParamDecorator)((data, context) => {
    const req = context.switchToHttp().getRequest();
    const fullUrl = req.fullUrl;
    if (!fullUrl) {
        throw new common_1.InternalServerErrorException('Request에 fullUrl이 존재하지 않습니다.');
    }
    return fullUrl;
});
//# sourceMappingURL=url.decorator.js.map