import { ZodError } from "zod"
import { PostBusiness } from "../../../src/business/posts/PostBusiness"
import { UpdatePostSchema } from "../../../src/dtos/posts/updatePost.dto"
import { BadRequestError } from "../../../src/errors/BadRequestError"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { LikeDislikesDatabaseMock } from "../../mocks/LikeDislikesDatabaseMock"
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"

describe('Test for the UpdatePost method', () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new LikeDislikesDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock()
    );

    test('Should return the updated content', async () => {
        const input = UpdatePostSchema.parse({
            id: 'post001',
            content: 'Updated post',
            token: 'token-mock-normUser'
        });

        const output = await postBusiness.updatePost(input);

        expect(output).toEqual({
            content: 'Updated post'
        })
    });

    test('Invalid token error', async () => {
        expect.assertions(2);
        try {
            const input = UpdatePostSchema.parse({
                id: 'post001',
                content: 'Updated post',
                token: 'token'
            });

            await postBusiness.updatePost(input)
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.statusCode).toBe(400);
                expect(error.message).toBe('Invalid token.')
            }
        }
    });

    test('Post not found error', async () => {
        expect.assertions(2);
        try {
            const input = UpdatePostSchema.parse({
                id: 'post055',
                content: 'Updated post',
                token: 'token-mock-normUser'
            });

            await postBusiness.updatePost(input)
        } catch (error) {
            if(error instanceof NotFoundError){
                expect(error.statusCode).toBe(400);
                expect(error.message).toBe('Post not found.')
            }
        }
    });

    test('Unauthorized user', async () => {
        expect.assertions(2);
        try {
            const input = UpdatePostSchema.parse({
                id: 'post001',
                content: 'Updated post',
                token: 'token-mock-adminUser'
            });

            await postBusiness.updatePost(input)
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.statusCode).toBe(400);
                expect(error.message).toBe('Only the creator of the post can edit it.')
            }
        }
    });

    test('Zod validation for the id', async () => {
        expect.assertions(1);
        try {
            const input = UpdatePostSchema.parse({
                content: 'Updated post',
                token: 'token-mock-normUser'
            });

            await postBusiness.updatePost(input)
        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    });

    test('Zod validation for the content', async () => {
        expect.assertions(1);
        try {
            const input = UpdatePostSchema.parse({
                id: 'post001',
                content: '',
                token: 'token-mock-normUser'
            });

            await postBusiness.updatePost(input)
        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    });

    test('Zod validation for the token', async () => {
        expect.assertions(1);
        try {
            const input = UpdatePostSchema.parse({
                id: 'post001',
                content: 'Updated post',
                token: ''
            });

            await postBusiness.updatePost(input)
        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    })
})