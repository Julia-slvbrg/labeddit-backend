import { LikesDislikesPostDB } from "../../../models/LikesDislikesPost";
import { BaseDatabase } from "../../BaseDatabase";

export class LikesDislikesPostDatabase extends BaseDatabase{
    TABLE_NAME = 'likes_dislikes'

    public async getLike(postId:string, userId:string):Promise<LikesDislikesPostDB[]>{
        const result:LikesDislikesPostDB[] = await BaseDatabase.connection(this.TABLE_NAME)
            .where({user_id: userId})
            .andWhere({post_id: postId})
        
        return result
    };

    public async createPost(newLikeDislike:LikesDislikesPostDB):Promise<void>{
        await BaseDatabase.connection(this.TABLE_NAME)
            .insert(newLikeDislike)
    };

    public async editLikes(postId:string, userId:string, like: number):Promise<void>{
        await BaseDatabase.connection(this.TABLE_NAME)
            .update({
                like: like
            })
            .where({user_id: userId})
            .andWhere({post_id: postId})
    };

    public async deletePost(postId:string, userId:string):Promise<void>{
        await BaseDatabase.connection(this.TABLE_NAME)
            .del()
            .where({user_id: userId})
            .andWhere({post_id: postId})
    }
}