import { z } from "zod"

export interface SignupInputDTO{
    name: string,
    email: string,
    password: string
};

export interface SignupOutputDTO{
    token: string
};

export const SignupSchema = z.object({
    name: z.string(
        {
            required_error: 'name is required.',
            invalid_type_error: 'name must be a string.'
        }
    ).min(2, '"name" must have atleast 2 charateres.'),
    email: z.string(
        {
            required_error: 'email is required.',
            invalid_type_error: 'email must be a string'
        }
    ).refine(
        (value) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value),
        'email not valid'
    ),
    password: z.string(
        {
            required_error: 'password is required',
            invalid_type_error: 'password must be a string'
        }
    ).refine(
        (value) => /^(?=.*[A-Z])(?=.*[!#@$%&])(?=.*[0-9])(?=.*[a-z]).{6,10}$/g.test(value),
        'Invalid password. It must have from six to ten characters, with uppercase and lowercase letters and one special character. Try again.'
    )
}).transform(data => data as SignupInputDTO)