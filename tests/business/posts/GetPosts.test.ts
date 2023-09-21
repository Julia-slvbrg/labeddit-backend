import { ZodError } from "zod"
import { PostBusiness } from "../../../src/business/posts/PostBusiness"
import { GetPostSchema } from "../../../src/dtos/posts/getPosts.dto"
import { BadRequestError } from "../../../src/errors/BadRequestError"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { LikeDislikesDatabaseMock } from "../../mocks/LikeDislikesDatabaseMock"
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock"

describe('Tests for the GetPosts method', () => {
    const postbusiness = new PostBusiness(
        new PostDatabaseMock(),
        new LikeDislikesDatabaseMock(),
        new CommentDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock()
    );

    test('Should return posts', async () => {
        const input = GetPostSchema.parse({
            token: 'token-mock-normUser'
        });

        const output = await postbusiness.getPosts(input);

        expect(output).toHaveLength(3);
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
            },
            {
                id: 'post002',
                content: "normUser's second post",
                likes: 0,
                dislikes: 0,
                comments: 7,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                creator: {
                    id: 'id-mock-normUser',
                    name: 'NormUser'
                }
            },
            {
                id: 'post003',
                content: "adminUser's first post",
                likes: 1,
                dislikes: 1,
                comments: 0,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                creator: {
                    id: 'id-mock-adminUser',
                    name: 'AdminUser'
                }
            }
        ])
    });
    
    test('Invalid token', async () => {
        expect.assertions(2);
        try {
            const input = GetPostSchema.parse({
                token: 'token'
            });

            await postbusiness.getPosts(input)
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.statusCode).toBe(400);
                expect(error.message).toBe('Invalid token.')
            }
        }
    });

    test('Zod validation for the token', async () => {
        expect.assertions(1);
        try {
            const input = GetPostSchema.parse({
                token: 111
            });
            
            await postbusiness.getPosts(input)
        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    })
})