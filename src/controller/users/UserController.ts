import { Request, Response } from "express";
import { UserBusiness } from "../../business/users/UserBusiness";
import { GetUsersSchema } from "../../dtos/users/getUsers.dto";
import { ZodError } from "zod";
import { BaseError } from "../../errors/BaseError";
import { SignupSchema } from "../../dtos/users/signup.dto";

export class UserController{
    constructor(
        private userBusiness: UserBusiness
    ){};

    public getUsers =async (req: Request, res: Response) => {
        try {
            const input = GetUsersSchema.parse({
                q: req.body.q,
                token: req.headers.authorization
            });

            const output = await this.userBusiness.getUsers(input);

            res.status(200).send(output)
        } catch (error) {
            console.log(error);

            if(error instanceof ZodError){
                res.status(400).send(error.issues)
            }else if(error instanceof BaseError){
                res.status(error.statusCode).send(error.message)
            }else{
                res.status(500).send('Unknown error.')
            }
        }
    };

    public signup = async (req: Request, res: Response) => {
        try {
            const input = SignupSchema.parse({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            const output = await this.userBusiness.signup(input);

            res.status(200).send(output)
        } catch (error) {
            console.log(error);

            if(error instanceof ZodError){
                res.status(400).send(error.issues)
            }else if(error instanceof BaseError){
                res.status(error.statusCode).send(error.message)
            }else{
                res.status(500).send('Unknown error.')
            }
        }
    };
}