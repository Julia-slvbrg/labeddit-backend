import { ZodError } from "zod"
import { PostBusiness } from "../../../src/business/posts/PostBusiness"
import { DeletePostSchema } from "../../../src/dtos/posts/deletePost.dto"
import { BadRequestError } from "../../../src/errors/BadRequestError"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { LikeDislikesDatabaseMock } from "../../mocks/LikeDislikesDatabaseMock"
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"

describe('Tests for the DeletePost method', () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new LikeDislikesDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock()
    );

    test('Should not throw any errors when executed', async () => {
        const input = DeletePostSchema.parse({
            id: 'post001',
            token: 'token-mock-normUser'
        });

        await postBusiness.deletePost(input)
       
        expect(async () => await postBusiness.deletePost(input)).not.toThrow()
    });

    test('Invalid token', async () => {
        expect.assertions(2);
        try {
            const input = DeletePostSchema.parse({
                id: 'post001',
                token: 'token'
            });

            await postBusiness.deletePost(input)
            
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.statusCode).toBe(400);
                expect(error.message).toBe('Invalid token.')
            }
        }
    });

    test('Post not found', async () => {
        expect.assertions(2);
        try {
            const input = DeletePostSchema.parse({
                id: 'post055',
                token: 'token-mock-normUser'
            });
    
            await postBusiness.deletePost(input)

        } catch (error) {
            if(error instanceof NotFoundError){
                expect(error.statusCode).toBe(404);
                expect(error.message).toBe('Post not found.')
            }
        }
    });

    test('Unauthorized user', async () => {
        expect.assertions(2);
        try {
            const input = DeletePostSchema.parse({
                id: 'post001',
                token: 'token-mock-mockUser'
            });
    
            await postBusiness.deletePost(input)

        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.statusCode).toBe(400);
                expect(error.message).toBe('Only the creator of the post or ADMIN users can delete it.')
            }
        }
    });

    test('Zod validation for the id', async () => {
        expect.assertions(1);
        try {
            const input = DeletePostSchema.parse({
                id: ' ',
                token: 'token-mock-normUser'
            });
    
            await postBusiness.deletePost(input)

        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    });

    test('Zod validation for the token', async () => {
        expect.assertions(1);
        try {
            const input = DeletePostSchema.parse({
                id: 'post001',
                token: ''
            });
    
            await postBusiness.deletePost(input)

        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    })
})