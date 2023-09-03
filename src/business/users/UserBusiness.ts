import { UserDatabase } from "../../database/UserDatabase";
import { GetUsersInputDTO, GetUsersOutputDTO } from "../../dtos/users/getUsers.dto";
import { SignupInputDTO, SignupOutputDTO } from "../../dtos/users/signup.dto";
import { BadRequestError } from "../../errors/BadRequestError";
import { USER_ROLES, User } from "../../models/User";
import { HashManager } from "../../services/HashManager";
import { IdGenerator } from "../../services/IdGenerator";
import { TokenManager } from "../../services/TokenManager";

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
}