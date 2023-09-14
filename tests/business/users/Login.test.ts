import { ZodError } from "zod"
import { UserBusiness } from "../../../src/business/users/UserBusiness"
import { LoginSchema } from "../../../src/dtos/users/login.dto"
import { BadRequestError } from "../../../src/errors/BadRequestError"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { HashManagerMock } from "../../mocks/HashManagerMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"

describe('Tests for the Login method', () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock(),
        new HashManagerMock()
    );

    test('Should return the mocked token for the normUser', async () => {
        const input = LoginSchema.parse({
            email: 'normuser@email.com',
            password: 'normUser123!'
        });

        const output = await userBusiness.login(input);

        expect(output).toEqual({
            token: 'token-mock-normUser'
        })
    });

    test('Should return the mocked token for the adminUser', async () => {
        const input = LoginSchema.parse({
            email: 'adminuser@email.com',
            password: 'adminUser123!'
        });

        const output = await userBusiness.login(input);

        expect(output).toEqual({
            token: 'token-mock-adminUser'
        })
    });

    test('Test for email not found', async () => {
        expect.assertions(2);
        try {
            const input = LoginSchema.parse({
                email: 'user@email.com',
                password: 'normUser123!'
            });

            await userBusiness.login(input)

        } catch (error) {
            if(error instanceof NotFoundError){
                expect(error.statusCode).toBe(400);
                expect(error.message).toBe('email or password not valid')
            }
        }
    });

    test('Test for wrong password', async () => {
        expect.assertions(2);
        try {
            const input = LoginSchema.parse({
                email: 'normuser@email.com',
                password: 'norm123!'
            });

            await userBusiness.login(input)

        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.statusCode).toBe(400);
                expect(error.message).toBe('email or password not valid')
            }
        }
    });

    test('Zod validation for email', async () => {
        expect.assertions(1);
        try {
            const input = LoginSchema.parse({
                email: 'normuseremail.com',
                password: 'normUser123!'
            });

            await userBusiness.login(input)
        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    });

    test('Zod validation for the password', async () => {
        expect.assertions(1);
        try {
            const input = LoginSchema.parse({
                email: 'normuser@email.com',
                password: ''
            });

            await userBusiness.login(input) 

        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    })
})