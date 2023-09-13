import { BaseDatabase } from "../../src/database/BaseDatabase";
import { USER_ROLES, UserDB } from "../../src/models/User";

const usersMock: UserDB[] = [
    {
        id: 'id-mock-normUser',
        name: 'NormUser',
        email: 'normuser@email.com',
        password: 'hash-mock-normUser', //password = normUser123
        user_role: USER_ROLES.NORMAL,
        created_at: new Date().toISOString()
    },
    {
        id: 'id-mock-adminUser',
        name: 'AdminUser',
        email: 'adminuser@email.com',
        password: 'hash-mock-adminUser', //password = admUser123
        user_role: USER_ROLES.ADMIN,
        created_at: new Date().toISOString()
    }
];

export class UserDatabaseMock extends BaseDatabase{
    public TABLE_NAME = 'users'

    public async findUsers(q:string|undefined):Promise<UserDB[]>{
        if(q){
            return usersMock.filter(user => user.name.toLocaleLowerCase().includes(q.toLocaleLowerCase()))
        }else{
            return usersMock
        }
    };

    public async findEmail(email:string):Promise<UserDB>{
        return usersMock.filter(user => user.email === email)[0]
    };

    public async createUser(newUser:UserDB):Promise<void>{
        
    }
}