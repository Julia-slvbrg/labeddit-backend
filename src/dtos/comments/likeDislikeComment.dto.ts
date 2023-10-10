import { z } from "zod"

export interface LikeDislikeCommentInputDTO{
    idPost: string,
    idComment: string,
    like: boolean,
    token: string
};

export interface LikeDislikeCommentOutputDTO{};

export const LikeDislikeCommentSchema = z.object({
    idPost: z.string(
        {
            required_error: 'id is required.',
            invalid_type_error: 'id must be a string.'
        }
    ).min(2, 'id invalid.'),
    idComment: z.string(
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
}).transform(data => data as LikeDislikeCommentInputDTO)