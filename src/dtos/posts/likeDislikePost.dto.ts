import { z } from "zod"

export interface LikeDislikePostInputDTO{
    id: string,
    like: boolean,
    token: string
};

export interface LikeDislikePostOutputDTO{};

export const LikeDislikeSchema = z.object({
    id: z.string(
        {
            required_error: 'id is required.',
            invalid_type_error: 'id must be a string.'
        }
    ).min(2, 'id invalid.'),
    like: z.boolean(
        {
            required_error: 'like is required.',
            invalid_type_error: 'like must be a boolean.'
        }
    ),
    token: z.string(
        {
            required_error: 'id is required.',
            invalid_type_error: 'id must be a string.'
        }
    ).min(2, 'invalid token.')
}).transform(data => data as LikeDislikePostInputDTO)