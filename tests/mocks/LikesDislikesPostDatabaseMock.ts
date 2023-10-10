import { BaseDatabase } from "../../src/database/BaseDatabase";
import { LikesDislikesPostDB } from "../../src/models/LikesDislikesPost";

export const likesDislikesPostMock:LikesDislikesPostDB[] = [
    {
        user_id: 'id-mock-adminUser',
        post_id: 'post001',
        like: 1
    },
    {
        user_id: 'id-mock-adminUser',
        post_id: 'post003',
        like: 1
    },
    {
        user_id: 'id-mock-normUser',
        post_id: 'post003',
        like: 0
    }
]

export class LikesDislikesPostDatabaseMock extends BaseDatabase{
    public TABLE_NAME = 'likes_dislikes'

    public async getLike(postId:string, userId:string):Promise<LikesDislikesPostDB[]>{
        return likesDislikesPostMock.filter((likeDislike) => likeDislike.user_id === userId && likeDislike.post_id === postId)
    };

    public async createPost(newLikeDislike:LikesDislikesPostDB):Promise<void>{

    };

    public async editLikes(postId:string, userId:string, like:number):Promise<void>{

    };

    public async deletePost(postId:string, userId:string):Promise<void>{

    }
}