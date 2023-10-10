import { LikesDislikesCommentDB } from "../../../models/LikesDislikesComments";
import { BaseDatabase } from "../../BaseDatabase";

export class LikesDislikesCommentDatabase extends BaseDatabase{
    TABLE_NAME = 'comments_likes_dislikes'

    public async getLike(commentId:string, userId:string):Promise<LikesDislikesCommentDB[]>{
        const result:LikesDislikesCommentDB[] = await BaseDatabase.connection(this.TABLE_NAME)
            .where({user_id: userId})
            .andWhere({comment_id: commentId})
        
        return result
    };

    public async createComment(newLikeDislike:LikesDislikesCommentDB):Promise<void>{
        await BaseDatabase.connection(this.TABLE_NAME)
            .insert(newLikeDislike)
    };

    public async editLikes(commentId:string, userId:string, like: number):Promise<void>{
        await BaseDatabase.connection(this.TABLE_NAME)
            .update({
                like: like
            })
            .where({user_id: userId})
            .andWhere({comment_id: commentId})
    };

    public async deleteComment(commentId:string, userId:string):Promise<void>{
        await BaseDatabase.connection(this.TABLE_NAME)
            .del()
            .where({user_id: userId})
            .andWhere({comment_id: commentId})
    }
}