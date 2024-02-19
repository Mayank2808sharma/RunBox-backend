"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compile_1 = require("../controllers/compile");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/compile', compile_1.compileCode);
router.get('/output/', compile_1.getResult);
exports.default = router;
