import { z } from "zod"

export interface GetPostsInputDTO{
    token: string
};

export interface GetPostsOutputDTO{
    id: string,
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

export const GetPostSchema = z.object({
    token: z.string(
        {
            required_error: 'token is required.',
            invalid_type_error: 'token must be a string.'
        }
    ).min(2, 'invalid token.')
}).transform(data => data as GetPostsInputDTO)