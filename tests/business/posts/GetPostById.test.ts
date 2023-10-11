import { ZodError } from "zod"
import { PostBusiness } from "../../../src/business/posts/PostBusiness"
import { GetPostByIdSchema } from "../../../src/dtos/posts/getPostById.dto"
import { BadRequestError } from "../../../src/errors/BadRequestError"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { LikesDislikesCommentDatabaseMock } from "../../mocks/LikesDislikesCommentsMock"
import { LikesDislikesPostDatabaseMock } from "../../mocks/LikesDislikesPostDatabaseMock"
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"

describe('Tests fot the GetPostById method', () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new LikesDislikesPostDatabaseMock(),
        new LikesDislikesCommentDatabaseMock(),
        new CommentDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock()
    );

    test('Should return post', async () => {
        const input = GetPostByIdSchema.parse({
            token: 'token-mock-adminUser',
            id: 'post001'
        });

        const output = await postBusiness.getPostById(input);
        expect(output).toEqual([
            {
                id: 'post001',
                content: "normUser's first post",
                likes: 1,
                dislikes: 0,
                comments: 2,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                creator: {
                    id: 'id-mock-normUser',
                    name: 'NormUser'
                }
            }
        ])
    });

    test('Invalid token', async () => {
        expect.assertions(2);
        try {
            const input = GetPostByIdSchema.parse({
                token: 'token',
                id: 'post001'
            });

            await postBusiness.getPostById(input)
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.statusCode).toBe(400);
                expect(error.message).toBe('Invalid token.')
            }
        }
    });

    test('Invalid post id', async () => {
        expect.assertions(2);
        try {
            const input = GetPostByIdSchema.parse({
                token: 'token-mock-adminUser',
                id: 'post00'
            });

            await postBusiness.getPostById(input)
        } catch (error) {
            if(error instanceof NotFoundError){
                expect(error.statusCode).toBe(404);
                expect(error.message).toBe('Post not found.')
            }
        }
    });

    test('Zod validation for the token', async () => {
        expect.assertions(1);
        try {
            const input = GetPostByIdSchema.parse({
                token: 11,
                id: 'post001'
            });
            
            await postBusiness.getPostById(input)
        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    });

    test('Zod validation for the post id', async () => {
        expect.assertions(1);
        try {
            const input = GetPostByIdSchema.parse({
                token: 'token-mock-adminUser',
                id: 1
            });
            
            await postBusiness.getPostById(input)
        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    })
})