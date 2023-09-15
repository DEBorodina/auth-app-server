"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDto = void 0;
class UserDto {
    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.name = model.name;
        this.lastName = model.lastName;
    }
}
exports.UserDto = UserDto;
//# sourceMappingURL=UserDto.js.map