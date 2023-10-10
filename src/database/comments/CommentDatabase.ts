import { CommentDB, GetCommentDB } from "../../models/Comment";
import { LikesDislikesCommentCountDB } from "../../models/LikesDislikesComments";
import { BaseDatabase } from "../BaseDatabase";

export class CommentDatabase extends BaseDatabase {
    TABLE_NAME = 'comments'

    public async createComment(newComment:CommentDB):Promise<void>{
        await BaseDatabase.connection(this.TABLE_NAME)
            .insert(newComment)
    };

    public async getCommentById(id:string):Promise<CommentDB>{
        const [commentDB]:CommentDB[] = await super.findById(id);

        return commentDB
    };

    public async getCommentsByPostId(id:string):Promise<GetCommentDB[]>{
        const result:GetCommentDB[] = await BaseDatabase.connection(this.TABLE_NAME)
            .select(
                'comments.id',
                'comments.post_id as postId',
                'comments.content',
                'comments.likes',
                'comments.dislikes',
                'comments.created_at as createdAt',
                'comments.updated_at as updatedAt',
                'comments.creator_id as creatorId',
                'users.name as creatorName'
            )
            .innerJoin('users', 'users.id', '=', 'comments.creator_id')
            .where({post_id: id});

        return result
    };

    public async editCommentLikes(commentId:string, newLikeDislikeCount:LikesDislikesCommentCountDB):Promise<void>{
        await BaseDatabase.connection(this.TABLE_NAME)
            .update(
                {
                    likes: newLikeDislikeCount.newLikeCount,
                    dislikes: newLikeDislikeCount.newDislikeCount
                }
            ).where({id: commentId})
    }
}