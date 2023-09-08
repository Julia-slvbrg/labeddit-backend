import express from "express";
import { PostController } from "../controller/posts/PostController";
import { PostBusiness } from "../business/posts/PostBusiness";
import { PostDatabase } from "../database/posts/PostDatabase";
import { TokenManager } from "../services/TokenManager";
import { IdGenerator } from "../services/IdGenerator";
import { LikesDislikesDatabase } from "../database/likesDislikes/LikesDislikesDatabase";


export const postRouter = express.Router();

const postController = new PostController(
    new PostBusiness(
        new PostDatabase(),
        new LikesDislikesDatabase(),
        new TokenManager(),
        new IdGenerator()
    )
);

postRouter.post('/', postController.createPost);
postRouter.get('/', postController.getPosts);
postRouter.put('/:id', postController.updatePost);
postRouter.delete('/:id', postController.deletePost);
postRouter.put('/:id/like', postController.likeDislikePost)
