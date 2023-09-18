import { TokenPayload, USER_ROLES } from "../../src/models/User";

export class TokenManagerMock{
    public createToken = (payload: TokenPayload): string => {
        if(payload.id === 'id-mock'){
            return 'token-mock'
        };
        if(payload.id === 'id-mock-mockUser'){
            return 'token-mock-mockUser'
        };
        if(payload.id === 'id-mock-normUser'){
            return 'token-mock-normUser'
        }else{
            return 'token-mock-adminUser'
        }
    };

    public getPayload = (token: string): TokenPayload | null => {
        if(token === 'token-mock-normUser'){
            return {
                id: 'id-mock-normUser',
                role: USER_ROLES.NORMAL,
                name: 'NormUser'
            }
        }else if(token === 'token-mock-adminUser'){
            return {
                id: 'id-mock-adminUser',
                role: USER_ROLES.ADMIN,
                name: 'AdminUser'
            }
        }else if(token === 'token-mock-mockUser'){
            return {
                id: 'id-mock-mockUser',
                role: USER_ROLES.NORMAL,
                name: 'MockUser'
            }
        }else{
            return null
        }
    }
}