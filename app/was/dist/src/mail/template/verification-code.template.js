"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.template = void 0;
const template = (code) => `
  <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
    <h2>이메일 인증 코드</h2>
    <p>아래의 인증 코드를 입력하여 이메일 인증을 완료하세요.</p>
    <p style="font-size: 24px; font-weight: bold; color: #007BFF;">${code}</p>
    <p>감사합니다.</p>
  </div>
`;
exports.template = template;
//# sourceMappingURL=verification-code.template.js.map