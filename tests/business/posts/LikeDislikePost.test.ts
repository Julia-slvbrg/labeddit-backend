import { ZodError } from "zod"
import { PostBusiness } from "../../../src/business/posts/PostBusiness"
import { LikeDislikeSchema } from "../../../src/dtos/posts/likeDislikePost.dto"
import { BadRequestError } from "../../../src/errors/BadRequestError"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { LikeDislikesDatabaseMock } from "../../mocks/LikeDislikesDatabaseMock"
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"

describe('Tests for the LikeDislikePost method', () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new LikeDislikesDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock()
    );

    test('Invalid token', async () => {
        expect.assertions(2);
        try {
            const input = LikeDislikeSchema.parse({
                id: 'post001',
                like: true,
                token: 'token-mock'
            });

            await postBusiness.likeDislikePost(input)

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
            const input = LikeDislikeSchema.parse({
                id: 'post055',
                like: true,
                token: 'token-mock-adminUser'
            });

            await postBusiness.likeDislikePost(input)

        } catch (error) {
            if(error instanceof NotFoundError){
                expect(error.statusCode).toBe(400);
                expect(error.message).toBe('Post not found.')
            }
        }
    });

    test('Zod validation for the id', async () => {
        expect.assertions(1);
        try {
            const input = LikeDislikeSchema.parse({
                id: ' ',
                like: true,
                token: 'token-mock-adminUser'
            });
    
            await postBusiness.deletePost(input)

        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    });

    test('Zod validation for the like', async () => {
        expect.assertions(1);
        try {
            const input = LikeDislikeSchema.parse({
                id: 'post001',
                like: 'true',
                token: 'token-mock-adminUser'
            });
    
            await postBusiness.deletePost(input)

        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    });

    test('Zod validation for the token', async () => {
        expect.assertions(1);
        try {
            const input = LikeDislikeSchema.parse({
                id: 'post001',
                like: true,
                token: ''
            });
    
            await postBusiness.deletePost(input)

        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    })
})