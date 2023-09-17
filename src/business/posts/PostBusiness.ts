import { LikesDislikesDatabase } from "../../database/likesDislikes/LikesDislikesDatabase";
import { PostDatabase } from "../../database/posts/PostDatabase";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../../dtos/posts/createPost.dto";
import { DeletePostInputDTO } from "../../dtos/posts/deletePost.dto";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../../dtos/posts/getPosts.dto";
import { LikeDislikePostInputDTO } from "../../dtos/posts/likeDislikePost.dto";
import { UpdatePostInputDTO, UpdatePostOutputDTO } from "../../dtos/posts/updatePost.dto";
import { BadRequestError } from "../../errors/BadRequestError";
import { NotFoundError } from "../../errors/NotFoundError";
import { LikesDislikes, LikesDislikesCountDB } from "../../models/LikesDislikes";
import { GetPostDB, Post, PostDB } from "../../models/Post";
import { USER_ROLES } from "../../models/User";
import { IdGenerator } from "../../services/IdGenerator";
import { TokenManager } from "../../services/TokenManager";

export class PostBusiness{
    constructor(
        private postDatabase: PostDatabase,
        private likesDislikesDatabase: LikesDislikesDatabase,
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
    };

    public likeDislikePost = async (input:LikeDislikePostInputDTO) => {
        const { id, like, token } = input;

        const payload = this.tokenManager.getPayload(token);

        if(!payload){
            throw new BadRequestError('Invalid token.')
        };

        const checkPostDB:PostDB = await this.postDatabase.getPostById(id);

        if(!checkPostDB){
            throw new NotFoundError('Post not found.')
        };

        const postDB = new Post(
            checkPostDB.id,
            checkPostDB.creator_id,
            checkPostDB.content,
            checkPostDB.likes,
            checkPostDB.dislikes,
            checkPostDB.created_at,
            checkPostDB.updated_at
        );

        const currentLikeCount = postDB.getLikes();
        const currentDislikeCount = postDB.getDislikes();

        const [checkLikeDislike] = await this.likesDislikesDatabase.getLike(payload.id, id);

        if(!checkLikeDislike){
            //criando a interação na tabela

            const newLikeDislike = new LikesDislikes(
                payload.id,
                id,
                like? 1 : 0
            );

            await this.likesDislikesDatabase.createPost(newLikeDislike.likeDislikeToDBModel());
            
            //mudando contagem de like/dislike tabela posts

            const newLikeDislikeCount:LikesDislikesCountDB = {
                newLikeCount: like? currentLikeCount + 1 : currentLikeCount,
                newDislikeCount: like? currentDislikeCount : currentDislikeCount + 1
            };

            await this.postDatabase.editPostLikes(postDB.getId(), newLikeDislikeCount);

            return
        };

        const likeDislikeDB = new LikesDislikes(
            payload.id,
            id,
            like? 1 : 0
        );

        if(checkLikeDislike.like === 1 && like){
            //remove da tabela likeDislike, subtrai like de posts

            await this.likesDislikesDatabase.deletePost(likeDislikeDB.getPostId(), likeDislikeDB.getUserId());

            const newLikeDislikeCount:LikesDislikesCountDB = {
                newLikeCount: currentLikeCount - 1,
                newDislikeCount: currentDislikeCount
            };

            await this.postDatabase.editPostLikes(id, newLikeDislikeCount);

            return
        };

        if(checkLikeDislike.like === 1 && !like){
            //muda para 0 na tabela likeDislike, subtrai um like e soma um dislike na posts

            await this.likesDislikesDatabase.editLikes(likeDislikeDB.getPostId(), likeDislikeDB.getUserId(), likeDislikeDB.getLike());

            const newLikeDislikeCount:LikesDislikesCountDB = {
                newLikeCount: currentLikeCount - 1,
                newDislikeCount: currentDislikeCount + 1
            };

            await this.postDatabase.editPostLikes(likeDislikeDB.getPostId(), newLikeDislikeCount);

            return            
        };

        if(checkLikeDislike.like === 0 && like){
            //muda para 1 na tabela likeDislike, soma 1 na like da posts

            await this.likesDislikesDatabase.editLikes(likeDislikeDB.getPostId(), likeDislikeDB.getUserId(), likeDislikeDB.getLike());

            const newLikeDislikeCount:LikesDislikesCountDB = {
                newLikeCount: currentLikeCount + 1,
                newDislikeCount: currentDislikeCount - 1
            };

            await this.postDatabase.editPostLikes(likeDislikeDB.getPostId(), newLikeDislikeCount);

            return
        };

        if(checkLikeDislike.like === 0 && !like){
            //muda para 1 na tabela likeDislike, deleta o post da likeDislike, subtrai um dislike da posts

            await this.likesDislikesDatabase.deletePost(likeDislikeDB.getPostId(), likeDislikeDB.getUserId());

            const newLikeDislikeCount:LikesDislikesCountDB = {
                newLikeCount: currentLikeCount,
                newDislikeCount: currentDislikeCount - 1
            };

            await this.postDatabase.editPostLikes(likeDislikeDB.getPostId(), newLikeDislikeCount);

            return
        }

        


    }
}