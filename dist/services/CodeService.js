"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeService = void 0;
class CodeService {
    getRandomCode(length) {
        let min = Math.pow(10, (length - 1));
        let max = Math.pow(10, length);
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
exports.codeService = new CodeService();
//# sourceMappingURL=CodeService.js.map