import { UserDatabase } from "../../database/UserDatabase";
import { GetUsersInputDTO, GetUsersOutputDTO } from "../../dtos/users/getUsers.dto";
import { LoginInputDTO, LoginOutputDTO } from "../../dtos/users/login.dto";
import { SignupInputDTO, SignupOutputDTO } from "../../dtos/users/signup.dto";
import { BadRequestError } from "../../errors/BadRequestError";
import { NotFoundError } from "../../errors/NotFoundError";
import { USER_ROLES, User } from "../../models/User";
import { HashManager } from "../../services/HashManager";
import { IdGenerator } from "../../services/IdGenerator";
import { TokenManager, TokenPayload } from "../../services/TokenManager";

export class UserBusiness{
    constructor(
        private userDatabase: UserDatabase,
        private tokenManager: TokenManager,
        private idGenerator: IdGenerator,
        private hashManager: HashManager
    ){};

    public getUsers = async (input: GetUsersInputDTO):Promise<GetUsersOutputDTO[]> => {
        const { q, token } = input;

        const payload = this.tokenManager.getPayload(token);

        if(!payload){
            throw new BadRequestError('token is required.')
        };

        if(payload.role !== USER_ROLES.ADMIN){
            throw new BadRequestError('Only ADMIN users can access users information.')
        };

        const usersDB = await this.userDatabase.findUsers(q);

        const users: GetUsersOutputDTO[] = usersDB.map((userDB) => {
            return{
                id: userDB.id,
                name: userDB.name,
                email: userDB.email,
                role: userDB.user_role,
                createdAt: userDB.created_at
            }
        });

        return users
    };

    public signup = async (input:SignupInputDTO):Promise<SignupOutputDTO> => {
        const { name, email, password } = input;

        const checkEmail = await this.userDatabase.findEmail(email);

        if(checkEmail){
            throw new BadRequestError('email is already being used.')
        };

        const hashedPassword = await this.hashManager.hash(password);

        const newUser = new User(
            this.idGenerator.generateId(),
            name,
            email,
            hashedPassword,
            USER_ROLES.NORMAL,
            new Date().toISOString()
        );

        await this.userDatabase.createUser(newUser.userToDBModel());

        const token = this.tokenManager.createToken(
            {
                id: newUser.getId(),
                role: newUser.getRole(),
                name: newUser.getName()
            }
        );

        const output: SignupOutputDTO = {
            token: token
        };

        return output
    }

    public login =async (input:LoginInputDTO):Promise<LoginOutputDTO> => {
        const { email, password } = input;

        const [checkUserDB] = await this.userDatabase.findEmail(email);

        if(!checkUserDB){
            throw new NotFoundError('email or password not valid')
        };

        const isPasswordValid = await this.hashManager.compare(password, checkUserDB.password);

        if(!isPasswordValid){
            throw new BadRequestError('email or password not valid')
        };

        const user = new User(
            checkUserDB.id,
            checkUserDB.name,
            checkUserDB.email,
            checkUserDB.password,
            checkUserDB.user_role,
            checkUserDB.created_at,
        );

        const payload:TokenPayload = {
            id: user.getId(),
            role: user.getRole(),
            name: user.getName()
        };

        const token = this.tokenManager.createToken(payload);

        const output:LoginOutputDTO = {
            token: token
        };

        return output
    }
}