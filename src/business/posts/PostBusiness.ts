import { PostDatabase } from "../../database/posts/PostDatabase";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../../dtos/posts/createPost.dto";
import { DeletePostInputDTO } from "../../dtos/posts/deletePost.dto";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../../dtos/posts/getPosts.dto";
import { UpdatePostInputDTO, UpdatePostOutputDTO } from "../../dtos/posts/updatePost.dto";
import { BadRequestError } from "../../errors/BadRequestError";
import { NotFoundError } from "../../errors/NotFoundError";
import { GetPostDB, Post, PostDB } from "../../models/Post";
import { USER_ROLES } from "../../models/User";
import { IdGenerator } from "../../services/IdGenerator";
import { TokenManager } from "../../services/TokenManager";

export class PostBusiness{
    constructor(
        private postDatabase: PostDatabase,
        private tokenManager: TokenManager,
        private idGenerator: IdGenerator
    ){}

    public createPost = async (input:CreatePostInputDTO):Promise<CreatePostOutputDTO> => {
        const { content, token } = input;

        const payload = this.tokenManager.getPayload(token);

        if(!payload){
            throw new BadRequestError('Invalid token.')
        };

        const newPost = new Post(
            this.idGenerator.generateId(),
            payload.id,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString()
        );

        await this.postDatabase.createPost(newPost.postToDBModel());

        const output:CreatePostOutputDTO = {
            content: content
        };

        return output
    };

    public getPosts = async (input:GetPostsInputDTO):Promise<GetPostsOutputDTO[]> => {
        const { token } = input;

        const payload = this.tokenManager.getPayload(token);

        if(!payload){
            throw new BadRequestError('Invalid token.')
        };

        const postsDB:GetPostDB[] = await this.postDatabase.getPosts();

        const result:GetPostsOutputDTO[] = postsDB.map((postDB) => {
            return{
                id: postDB.id,
                content: postDB.content,
                likes: postDB.likes,
                dislikes: postDB.dislikes,
                createdAt: postDB.createdAt,
                updatedAt: postDB.updatedAt,
                creator: {
                    id: postDB.creatorId,
                    name: postDB.creatorName
                }
            }
        });

        return result
    };

    public updatePost = async (input:UpdatePostInputDTO):Promise<UpdatePostOutputDTO> => {
        const { id, content, token } = input;

        const payload = this.tokenManager.getPayload(token);

        if(!payload){
            throw new BadRequestError('Invalid token.')
        };

        const checkPost = await this.postDatabase.getPostById(id);

        if(!checkPost){
            throw new NotFoundError('Post not found.')
        };

        if(checkPost.creator_id !== payload.id){
            throw new BadRequestError('Only the creator of the post can edit it.')
        };

        const editedPost = new Post(
            checkPost.id,
            checkPost.creator_id,
            checkPost.content,
            checkPost.likes,
            checkPost.dislikes,
            checkPost.created_at,
            checkPost.updated_at
        );

        editedPost.setContent(content);
        editedPost.setUpdateAt(new Date().toISOString());

        await this.postDatabase.updatePost(editedPost.postToDBModel());
        
        const output:UpdatePostOutputDTO = {
            content: content
        };

        return output    
    };

    public deletePost = async (input:DeletePostInputDTO):Promise<void> => {
        const { id, token } = input;

        const payload = this.tokenManager.getPayload(token);

        if(!payload){
            throw new BadRequestError('Invalid token.')
        };

        const postDB:PostDB = await this.postDatabase.getPostById(id);

        if(!postDB){
            throw new NotFoundError('Post not found.')
        };

        if(postDB.creator_id !== payload.id && payload.role !== USER_ROLES.ADMIN){
            throw new BadRequestError('Only the creator of the post or ADMIN users can delete it.')
        };

        await this.postDatabase.deletePost(id)
    }
}