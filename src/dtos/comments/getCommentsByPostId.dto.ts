import { z } from "zod"

export interface GetCommentsByPostIdInputDTO{
    token: string,
    id: string
};

export interface GetCommentsByPostIdOutputDTO{
    id: string,
    postId: string,
    content: string,
    likes: number,
    dislikes: number,
    createdAt: string,
    updatedAt: string,
    creator: {
        id: string,
        name: string
    }
};

export const GetCommentsByPostIdSchema = z.object({
    token: z.string(
        {
            required_error: 'token is required',
            invalid_type_error: 'token must be a string'
        }
    ).min(2, 'invalid token.'),
    id: z.string(
        {
            required_error: 'id is required.',
            invalid_type_error: 'id must be a string.'
        }
    ).min(2, 'id invalid.')
}).transform(data => data as GetCommentsByPostIdInputDTO)