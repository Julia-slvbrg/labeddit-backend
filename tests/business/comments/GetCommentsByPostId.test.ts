import { ZodError } from "zod"
import { PostBusiness } from "../../../src/business/posts/PostBusiness"
import { GetCommentsByPostIdSchema } from "../../../src/dtos/comments/getCommentsByPostId.dto"
import { BadRequestError } from "../../../src/errors/BadRequestError"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { LikesDislikesCommentDatabaseMock } from "../../mocks/LikesDislikesCommentsMock"
import { LikesDislikesPostDatabaseMock } from "../../mocks/LikesDislikesPostDatabaseMock"
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"

describe('Tests for the GetCommentsByPostId method', () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new LikesDislikesPostDatabaseMock(),
        new LikesDislikesCommentDatabaseMock(),
        new CommentDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock()
    );

    test('Should return the comments of the post', async () => {
        const input = GetCommentsByPostIdSchema.parse({
            token: 'token-mock-adminUser',
            id:  'post002'
        });

        const output = await postBusiness.getCommentsByPostId(input);
 
        expect(output).toHaveLength(2);
        expect(output).toEqual([
            {
                id: 'comment001',
                postId: 'post002',
                content: 'first comment',
                likes: 2,
                dislikes: 1,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                creator: {
                    id: 'id-mock-normUser',
                    name: 'NormUser'
                }
            }, 
            {
                id: 'comment002',
                postId: 'post002',
                content: 'second comment', 
                likes: 0,
                dislikes: 0,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                creator: {
                    id: 'id-mock-adminUser',
                    name: 'AdminUser'
                }
            }
        ])
    });

    test('Invalid token',async () => {
        expect.assertions(2);
        try {
            const input = GetCommentsByPostIdSchema.parse({
                token: 'token',
                id:  'post002'
            });

            await postBusiness.getCommentsByPostId(input)
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe('Invalid token.');
                expect(error.statusCode).toBe(400)
            }
        }
    });

    test('Invalid id', async () => {
        expect.assertions(2);
        try {
            const input = GetCommentsByPostIdSchema.parse({
                token: 'token-mock-adminUser',
                id:  'post00002'
            });
    
            await postBusiness.getCommentsByPostId(input);
        } catch (error) {
            if(error instanceof NotFoundError){
                expect(error.message).toBe('Post not found.');
                expect(error.statusCode).toBe(404)
            }
        }
    });

    test('Zod validation for the id', async () => {
        expect.assertions(1);
        try {
            const input = GetCommentsByPostIdSchema.parse({
                token: 'token-mock-adminUser',
                id:  1
            });

            await postBusiness.getCommentsByPostId(input)
        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    });

    test('Zod validation for the token', async () => {
        expect.assertions(1);
        try {
            const input = GetCommentsByPostIdSchema.parse({
                token: 1,
                id:  'post002'
            });

            await postBusiness.getCommentsByPostId(input)
        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    });
})