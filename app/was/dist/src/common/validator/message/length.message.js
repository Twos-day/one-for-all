"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lenghthValidationMessage = void 0;
const lenghthValidationMessage = (args) => {
    const constraints = args.constraints;
    if (constraints.length === 2) {
        return `${args.property}은 ${constraints[0]}~${constraints[1]}자 사이로 입력해야합니다. `;
    }
    return `${args.property}은 ${constraints[0]}자 이하여야합니다. `;
};
exports.lenghthValidationMessage = lenghthValidationMessage;
//# sourceMappingURL=length.message.js.map