import express from "express";
import runCode from './routes/runCode';

const PORT = 8001;
const app = express();

app.use(express.json());

app.use('/code',runCode);

app.listen(PORT,()=>{
  console.log(`Server Running on ${PORT}`);
})
