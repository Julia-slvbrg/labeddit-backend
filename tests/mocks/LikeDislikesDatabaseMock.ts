import { BaseDatabase } from "../../src/database/BaseDatabase";
import { LikesDislikesDB } from "../../src/models/LikesDislikes";

export const likesDislikesMock:LikesDislikesDB[] = [
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

export class LikeDislikesDatabaseMock extends BaseDatabase{
    public TABLE_NAME = 'likes_dislikes'

    public async getLike(postId:string, userId:string):Promise<LikesDislikesDB[]>{
        return likesDislikesMock.filter((likeDislike) => likeDislike.user_id === userId && likeDislike.post_id === postId)
    };

    public async createPost(newLikeDislike:LikesDislikesDB):Promise<void>{

    };

    public async editLikes(postId:string, userId:string, like:number):Promise<void>{

    };

    public async deletePost(postId:string, userId:string):Promise<void>{

    }
}