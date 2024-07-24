"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KakaoUser = void 0;
const common_1 = require("@nestjs/common");
exports.KakaoUser = (0, common_1.createParamDecorator)((data, context) => {
    const req = context.switchToHttp().getRequest();
    const profile = req.user;
    if (!profile) {
        throw new common_1.InternalServerErrorException('Request에 kakao profile이 존재하지 않습니다.');
    }
    const kakaoUser = {
        nickname: profile.username,
        email: profile._json.kakao_account.email,
        accessToken: profile.accessToken,
        avatar: profile._json.properties.thumbnail_image,
    };
    return data ? kakaoUser[data] : kakaoUser;
});
//# sourceMappingURL=kakao-user.decorator.js.map