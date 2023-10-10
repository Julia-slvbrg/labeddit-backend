import { LikesDislikesPostDatabase } from "../../database/posts/likesDislikes/LikesDislikesPostDatabase";
import { PostDatabase } from "../../database/posts/PostDatabase";
import { CreateCommentInputDTO, CreateCommentOutputDTO } from "../../dtos/comments/CreateComment.dto";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../../dtos/posts/createPost.dto";
import { DeletePostInputDTO } from "../../dtos/posts/deletePost.dto";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../../dtos/posts/getPosts.dto";
import { LikeDislikePostInputDTO, LikeDislikePostOutputDTO } from "../../dtos/posts/likeDislikePost.dto";
import { UpdatePostInputDTO, UpdatePostOutputDTO } from "../../dtos/posts/updatePost.dto";
import { BadRequestError } from "../../errors/BadRequestError";
import { NotFoundError } from "../../errors/NotFoundError";
import { LikesDislikesPost, LikesDislikesPostCountDB } from "../../models/LikesDislikesPost";
import { GetPostDB, Post, PostDB } from "../../models/Post";
import { Comment, CommentDB, GetCommentDB } from "../../models/Comment";
import { USER_ROLES } from "../../models/User";
import { IdGenerator } from "../../services/IdGenerator";
import { TokenManager } from "../../services/TokenManager";
import { CommentDatabase } from "../../database/comments/CommentDatabase";
import { GetPostByIdInputDTO, GetPostByIdOutputDTO } from "../../dtos/posts/getPostById.dto";
import { GetCommentsByPostIdInputDTO, GetCommentsByPostIdOutputDTO } from "../../dtos/comments/getCommentsByPostId.dto";
import { LikeDislikeCommentInputDTO } from "../../dtos/comments/likeDislikeComment.dto";
import { LikesDislikesCommentDatabase } from "../../database/comments/likesDislikes/LikesDislikesCommentDatabase";
import { LikesDislikesComment, LikesDislikesCommentCountDB } from "../../models/LikesDislikesComments";

export class PostBusiness{
    constructor(
        private postDatabase: PostDatabase,
        private likesDislikesPostDatabase: LikesDislikesPostDatabase,
        private likesDislikesCommentDatabase: LikesDislikesCommentDatabase,
        private commentDatabase: CommentDatabase,
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
                comments: postDB.comments,
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

    public getPostById = async (input:GetPostByIdInputDTO):Promise<GetPostByIdOutputDTO[]> => {
        const {token, id} = input;

        const payload = this.tokenManager.getPayload(token);

        if(!payload){
            throw new BadRequestError('Invalid token.')
        };

        const postDB:GetPostDB[] = await this.postDatabase.getPostDataById(id);

        if(postDB.length == 0){
            throw new NotFoundError('Post not found.')
        };

        const result:GetPostsOutputDTO[] = postDB.map((post) => {
            return{
                id: post.id,
                content: post.content,
                likes: post.likes,
                dislikes: post.dislikes,
                comments: post.comments,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                creator: {
                    id: post.creatorId,
                    name: post.creatorName
                }
            }
        });

        return result
    }

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
            checkPost.comments,
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

    public likeDislikePost = async (input:LikeDislikePostInputDTO):Promise<void> => {
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
            checkPostDB.comments,
            checkPostDB.created_at,
            checkPostDB.updated_at
        );

        const currentLikeCount = postDB.getLikes();
        const currentDislikeCount = postDB.getDislikes();

        const [checkLikeDislike] = await this.likesDislikesPostDatabase.getLike(id, payload.id);

        if(!checkLikeDislike){

            const newLikeDislike = new LikesDislikesPost(
                payload.id,
                id,
                like? 1 : 0
            );

            await this.likesDislikesPostDatabase.createPost(newLikeDislike.likeDislikeToDBModel());

            const newLikeDislikeCount:LikesDislikesPostCountDB = {
                newLikeCount: like? currentLikeCount + 1 : currentLikeCount,
                newDislikeCount: like? currentDislikeCount : currentDislikeCount + 1
            };

            await this.postDatabase.editPostLikes(postDB.getId(), newLikeDislikeCount);

            return
        };

        const likeDislikeDB = new LikesDislikesPost(
            payload.id,
            id,
            like? 1 : 0
        ); //COPIAR A PARTIR DAQUI

        if(checkLikeDislike.like === 1 && like){ 

            await this.likesDislikesPostDatabase.deletePost(likeDislikeDB.getPostId(), likeDislikeDB.getUserId());

            const newLikeDislikeCount:LikesDislikesPostCountDB = {
                newLikeCount: currentLikeCount - 1,
                newDislikeCount: currentDislikeCount
            };

            await this.postDatabase.editPostLikes(id, newLikeDislikeCount);

            return
        };

        if(checkLikeDislike.like === 1 && !like){

            await this.likesDislikesPostDatabase.editLikes(likeDislikeDB.getPostId(), likeDislikeDB.getUserId(), likeDislikeDB.getLike());

            const newLikeDislikeCount:LikesDislikesPostCountDB = {
                newLikeCount: currentLikeCount - 1,
                newDislikeCount: currentDislikeCount + 1
            };

            await this.postDatabase.editPostLikes(likeDislikeDB.getPostId(), newLikeDislikeCount);

            return            
        };

        if(checkLikeDislike.like === 0 && like){

            await this.likesDislikesPostDatabase.editLikes(likeDislikeDB.getPostId(), likeDislikeDB.getUserId(), likeDislikeDB.getLike());

            const newLikeDislikeCount:LikesDislikesPostCountDB = {
                newLikeCount: currentLikeCount + 1,
                newDislikeCount: currentDislikeCount - 1
            };

            await this.postDatabase.editPostLikes(likeDislikeDB.getPostId(), newLikeDislikeCount);

            return
        };

        if(checkLikeDislike.like === 0 && !like){

            await this.likesDislikesPostDatabase.deletePost(likeDislikeDB.getPostId(), likeDislikeDB.getUserId());

            const newLikeDislikeCount:LikesDislikesPostCountDB = {
                newLikeCount: currentLikeCount,
                newDislikeCount: currentDislikeCount - 1
            };

            await this.postDatabase.editPostLikes(likeDislikeDB.getPostId(), newLikeDislikeCount);

            return
        }
    };

    public createComment = async (input:CreateCommentInputDTO):Promise<CreateCommentOutputDTO> => {
        const { id, content, token } = input;

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
            checkPostDB.comments,
            checkPostDB.created_at,
            checkPostDB.updated_at
        );
        
        const newCommentCount = postDB.getComments() + 1;
        postDB.setComments(newCommentCount);

        await this.postDatabase.updatePost(postDB.postToDBModel());

        const newComment = new Comment(
            this.idGenerator.generateId(),
            payload.id,
            id,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString()
        );
       
        await this.commentDatabase.createComment(newComment.commentToDBModel());

        const output:CreateCommentOutputDTO = {
            comment: content
        };

        return output
    };

    public getCommentsByPostId = async (input:GetCommentsByPostIdInputDTO):Promise<GetCommentsByPostIdOutputDTO[]> => {
        const {token, id} = input;

        const payload = this.tokenManager.getPayload(token);

        if(!payload){
            throw new BadRequestError('Invalid token.')
        };

        const checkPostDB:PostDB = await this.postDatabase.getPostById(id);

        if(!checkPostDB){
            throw new NotFoundError('Post not found.')
        };

        const commentsDB:GetCommentDB[] = await this.commentDatabase.getCommentsByPostId(id);

        const result:GetCommentsByPostIdOutputDTO[] = commentsDB.map((commentDB) => {
            return{
                id: commentDB.id,
                postId: commentDB.postId,
                content: commentDB.content,
                likes: commentDB.likes,
                dislikes: commentDB.dislikes,
                createdAt: commentDB.createdAt,
                updatedAt: commentDB.updatedAt,
                creator: {
                    id: commentDB.creatorId,
                    name: commentDB.creatorName
                }
            }
        });

        return result
    };

    public likeDislikeComment = async (input:LikeDislikeCommentInputDTO):Promise<void> => {
        const { idPost, idComment, like, token } = input;

        const payload = this.tokenManager.getPayload(token);

        if(!payload){
            throw new BadRequestError('Invalid token.')
        };

        const checkPostDB:PostDB = await this.postDatabase.getPostById(idPost);

        if(!checkPostDB){
            throw new NotFoundError('Post not found.')
        };

        const checkCommentDB:CommentDB = await this.commentDatabase.getCommentById(idComment);

        if(!checkCommentDB){
            throw new NotFoundError('Comment not found.')
        };

        const commentDB = new Comment(
            checkCommentDB.id,
            checkCommentDB.creator_id,
            checkCommentDB.post_id,
            checkCommentDB.content,
            checkCommentDB.likes,
            checkCommentDB.dislikes,
            checkCommentDB.created_at,
            checkCommentDB.updated_at
        );

        const currentLikeCount = commentDB.getLikes();
        const currentDislikeCount = commentDB.getDislikes();

        const [checkLikeDislike] = await this.likesDislikesCommentDatabase.getLike(idComment, payload.id);

        if(!checkLikeDislike){

            const newLikeDislike = new LikesDislikesComment(
                payload.id,
                idComment,
                like? 1 : 0
            );

            await this.likesDislikesCommentDatabase.createComment(newLikeDislike.likeDislikeToDBModel());

            const newLikeDislikeCount:LikesDislikesCommentCountDB = {
                newLikeCount: like? currentLikeCount + 1 : currentLikeCount,
                newDislikeCount: like? currentDislikeCount : currentDislikeCount + 1
            };

            await this.commentDatabase.editCommentLikes(commentDB.getId(), newLikeDislikeCount);

            return
        };

        const likeDislikeDB = new LikesDislikesComment(
            payload.id,
            idComment,
            like? 1 : 0
        ); //CONTINUAR A PARTIR DAQUI

        if(checkLikeDislike.like === 1 && like){ 

            await this.likesDislikesCommentDatabase.deleteComment(likeDislikeDB.getCommentId(), likeDislikeDB.getUserId());

            const newLikeDislikeCount:LikesDislikesCommentCountDB = {
                newLikeCount: currentLikeCount - 1,
                newDislikeCount: currentDislikeCount
            };

            await this.commentDatabase.editCommentLikes(idComment, newLikeDislikeCount);

            return
        };

        if(checkLikeDislike.like === 1 && !like){

            await this.likesDislikesCommentDatabase.editLikes(likeDislikeDB.getCommentId(), likeDislikeDB.getUserId(), likeDislikeDB.getLike());

            const newLikeDislikeCount:LikesDislikesCommentCountDB = {
                newLikeCount: currentLikeCount - 1,
                newDislikeCount: currentDislikeCount + 1
            };

            await this.commentDatabase.editCommentLikes(likeDislikeDB.getCommentId(), newLikeDislikeCount);

            return            
        };

        if(checkLikeDislike.like === 0 && like){

            await this.likesDislikesCommentDatabase.editLikes(likeDislikeDB.getCommentId(), likeDislikeDB.getUserId(), likeDislikeDB.getLike());

            const newLikeDislikeCount:LikesDislikesCommentCountDB = {
                newLikeCount: currentLikeCount + 1,
                newDislikeCount: currentDislikeCount - 1
            };

            await this.commentDatabase.editCommentLikes(likeDislikeDB.getCommentId(), newLikeDislikeCount);

            return
        };

        if(checkLikeDislike.like === 0 && !like){

            await this.likesDislikesCommentDatabase.deleteComment(likeDislikeDB.getCommentId(), likeDislikeDB.getUserId());

            const newLikeDislikeCount:LikesDislikesPostCountDB = {
                newLikeCount: currentLikeCount,
                newDislikeCount: currentDislikeCount - 1
            };

            await this.commentDatabase.editCommentLikes(likeDislikeDB.getCommentId(), newLikeDislikeCount);

            return
        }
    }
}