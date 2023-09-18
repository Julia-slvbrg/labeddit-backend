import { BaseError } from "./BaseError";

export class NotFoundError extends BaseError{
    constructor(
        message: string = 'Data not found'
    ){
        super(404, message)
    }
}