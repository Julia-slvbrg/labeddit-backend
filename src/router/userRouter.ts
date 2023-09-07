import express from "express";
import { UserDatabase } from "../database/UserDatabase";
import { UserBusiness } from "../business/users/UserBusiness";
import { UserController } from "../controller/users/UserController";
import { TokenManager } from "../services/TokenManager";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";

export const userRouter = express.Router();

const userController = new UserController(
    new UserBusiness(
        new UserDatabase(),
        new TokenManager(),
        new IdGenerator(),
        new HashManager()
    )
);

userRouter.get('/', userController.getUsers);
userRouter.post('/signup', userController.signup);
userRouter.post('/login', userController.login)