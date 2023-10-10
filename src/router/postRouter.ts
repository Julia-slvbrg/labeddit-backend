import express from "express";
import { PostController } from "../controller/posts/PostController";
import { PostBusiness } from "../business/posts/PostBusiness";
import { PostDatabase } from "../database/posts/PostDatabase";
import { TokenManager } from "../services/TokenManager";
import { IdGenerator } from "../services/IdGenerator";
import { LikesDislikesPostDatabase } from "../database/posts/likesDislikes/LikesDislikesPostDatabase";
import { CommentDatabase } from "../database/comments/CommentDatabase";
import { LikesDislikesCommentDatabase } from "../database/comments/likesDislikes/LikesDislikesCommentDatabase";


export const postRouter = express.Router();

const postController = new PostController(
    new PostBusiness(
        new PostDatabase(),
        new LikesDislikesPostDatabase(),
        new LikesDislikesCommentDatabase(),
        new CommentDatabase(),
        new TokenManager(),
        new IdGenerator()
    )
);

postRouter.post('/', postController.createPost);
postRouter.get('/', postController.getPosts);
postRouter.get('/:id', postController.GetPostById);
postRouter.put('/:id', postController.updatePost);
postRouter.delete('/:id', postController.deletePost);
postRouter.put('/:id/like', postController.likeDislikePost);
postRouter.post('/:id/comment', postController.createComment);
postRouter.get('/:id/comments', postController.getCommentsByPostId)
postRouter.put('/:idPost/comments/:idComment/like', postController.likeDislikeComment)
