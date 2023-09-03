import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { userRouter } from "./router/userRouter";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT || 3003, () => {
    console.log(`Server running on port ${process.env.PORT || 3003}.`)
});

app.use('/users', userRouter);
