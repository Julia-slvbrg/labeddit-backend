import { z } from "zod"

export interface UpdatePostInputDTO{
    id: string,
    content: string,
    token: string
};

export interface UpdatePostOutputDTO{
    content: string
};

export const UpdatePostSchema = z.object({
    id: z.string(
        {
            required_error: 'id is required.',
            invalid_type_error: 'id must be a string.'
        }
    ).min(2, 'invalid id.'),
    content: z.string(
        {
            required_error: 'content is required',
            invalid_type_error: 'content must be a string'
        }
    ).min(1, 'content must have atleast one character.'),
    token: z.string(
        {
            required_error: 'token is required.',
            invalid_type_error: 'token must be a string.'
        }
    ).min(2, 'invalid token.')
}).transform(data => data as UpdatePostInputDTO)