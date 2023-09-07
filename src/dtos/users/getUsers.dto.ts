import { z } from "zod"

export interface GetUsersInputDTO {
    q?: string,
    token: string
};

export interface GetUsersOutputDTO {
    id: string,
    name: string,
    email: string,
    role: string,
    createdAt: string
};

export const GetUsersSchema = z.object({
    q: z.string(
        {
            invalid_type_error: '"q" must be a string'
        }
    ).min(1, '"q" must have atleast one character').optional(),
    token: z.string(
        {
            invalid_type_error: 'token must be a string',
            required_error: 'token is required'
        }
    ).min(1, 'invalid token')
}).transform(data => data as GetUsersInputDTO)