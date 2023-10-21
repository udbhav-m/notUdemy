"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputvalues = void 0;
const zod_1 = require("zod");
exports.inputvalues = zod_1.z.object({
    username: zod_1.z.string().min(1),
    password: zod_1.z.string().min(1),
});
