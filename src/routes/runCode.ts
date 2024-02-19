import {compileCode,getResult} from "../controllers/compile";
import express from 'express';
const router = express.Router();


router.post('/compile',compileCode);

router.get('/output/',getResult);

export default router;