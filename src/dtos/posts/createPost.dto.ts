import { z } from "zod"

export interface CreatePostInputDTO{
    content: string,
    token: string
};

export interface CreatePostOutputDTO{
    content: string
};

export const CreatePostSchema = z.object({
    content: z.string(
        {
            required_error: 'content is required',
            invalid_type_error: 'content must be a string'
        }
    ).min(1, 'content must have atleast one character.'),
    token: z.string(
        {
            required_error: 'token is required',
            invalid_type_error: 'token must be a string'
        }
    ).min(2, 'invalid token.')
}).transform(data => data as CreatePostInputDTO)