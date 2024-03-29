"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const runCode_1 = __importDefault(require("./routes/runCode"));
const PORT = 8001;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/code', runCode_1.default);
app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
});
