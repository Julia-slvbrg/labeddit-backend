import { ZodError } from "zod"
import { PostBusiness } from "../../../src/business/posts/PostBusiness"
import { LikeDislikeCommentSchema } from "../../../src/dtos/comments/likeDislikeComment.dto"
import { BadRequestError } from "../../../src/errors/BadRequestError"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { LikesDislikesCommentDatabaseMock } from "../../mocks/LikesDislikesCommentsMock"
import { LikesDislikesPostDatabaseMock } from "../../mocks/LikesDislikesPostDatabaseMock"
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"

describe('Test for the LikeDislikeComment method', () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new LikesDislikesPostDatabaseMock(),
        new LikesDislikesCommentDatabaseMock(),
        new CommentDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock()
    );

    test('Should not throw any errors when executed (liking a new comment)', async () => {
        const input = LikeDislikeCommentSchema.parse({
            idPost: 'post002',
            idComment: 'comment002',
            like: true,
            token: 'token-mock-mockUser' 
        });
        
        await postBusiness.likeDislikeComment(input)

        expect(async () => await postBusiness.likeDislikeComment(input)).not.toThrow()
    });

    test('Should not throw any errors when executed (liking a comment already liked)', async () => {
        const input = LikeDislikeCommentSchema.parse({
            idPost: 'post002',
            idComment: 'comment001',
            like: true,
            token: 'token-mock-adminUser' 
        });

        expect(async () => await postBusiness.likeDislikeComment(input)).not.toThrow()
    });

    test('Should not throw any errors when executed (disliking a comment already liked)', async () => {
        const input = LikeDislikeCommentSchema.parse({
            idPost: 'post002',
            idComment: 'comment001',
            like: false,
            token: 'token-mock-adminUser' 
        });

        expect(async () => await postBusiness.likeDislikeComment(input)).not.toThrow()
    });

    test('Should not throw any errors when executed (liking a comment already disliked)', async () => {
        const input = LikeDislikeCommentSchema.parse({
            idPost: 'post001',
            idComment: 'comment003',
            like: true,
            token: 'token-mock-normUser' 
        });

        expect(async () => await postBusiness.likeDislikeComment(input)).not.toThrow()
    });

    test('Should not throw any errors when executed (disliking a comment already disliked)', async () => {
        const input = LikeDislikeCommentSchema.parse({
            idPost: 'post001',
            idComment: 'comment003',
            like: false,
            token: 'token-mock-normUser' 
        });

        expect(async () => await postBusiness.likeDislikeComment(input)).not.toThrow()
    });

    test('Invalid token', async () => {
        expect.assertions(2);
        try {
            const input = LikeDislikeCommentSchema.parse({
                idPost: 'post001',
                idComment: 'comment003',
                like: false,
                token: 'token'
            });

            await postBusiness.likeDislikeComment(input)

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
            const input = LikeDislikeCommentSchema.parse({
                idPost: 'post0002',
                idComment: 'comment001',
                like: true,
                token: 'token-mock-adminUser'
            });

            await postBusiness.likeDislikeComment(input) 

        } catch (error) {
            if(error instanceof NotFoundError){
                expect(error.statusCode).toBe(404);
                expect(error.message).toBe('Post not found.')
            }
        }
    });

    test('Comment not found', async () => {
        expect.assertions(2);
        try {
            const input = LikeDislikeCommentSchema.parse({
                idPost: 'post001',
                idComment: 'comment000003',
                like: true,
                token: 'token-mock-normUser' 
            });

            await postBusiness.likeDislikeComment(input)

        } catch (error) {
            if(error instanceof NotFoundError){
                expect(error.statusCode).toBe(404);
                expect(error.message).toBe('Comment not found.') 
            }
        }
    });

    test('Zod validation for the idPost', async () => {
        expect.assertions(1);
        try {
            const input = LikeDislikeCommentSchema.parse({
                idPost: 2,
                idComment: 'comment001',
                like: true,
                token: 'token-mock-adminUser'
            });

            await postBusiness.likeDislikeComment(input) 

        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    });

    test('Zod validation for the idComment', async () => {
        expect.assertions(1);
        try {
            const input = LikeDislikeCommentSchema.parse({
                idPost: 'post0002',
                idComment: 1,
                like: true,
                token: 'token-mock-adminUser'
            });

            await postBusiness.likeDislikeComment(input) 

        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    });

    test('Zod validation for the token', async () => {
        expect.assertions(1);
        try {
            const input = LikeDislikeCommentSchema.parse({
                idPost: 'post0002',
                idComment: 'comment001',
                like: true,
                token: 1
            });

            await postBusiness.likeDislikeComment(input) 

        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    });

    test('Zod validation for the like', async () => {
        expect.assertions(1);
        try {
            const input = LikeDislikeCommentSchema.parse({
                idPost: 'post0002',
                idComment: 'comment001',
                like: 1,
                token: 'token-mock-adminUser'
            });

            await postBusiness.likeDislikeComment(input) 

        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    });
})
