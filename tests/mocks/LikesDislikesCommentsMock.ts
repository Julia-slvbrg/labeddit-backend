import { BaseDatabase } from "../../src/database/BaseDatabase"
import { LikesDislikesCommentDB } from "../../src/models/LikesDislikesComments"

export const LikesDislikesCommentMock:LikesDislikesCommentDB[] = [
    {
        user_id: 'id-mock-adminUser',
        comment_id: 'com001',
        like: 1
    },
    {
        user_id: 'id-mock-adminUser',
        comment_id: 'com003',
        like: 0
    },
    {
        user_id: 'id-mock-normUser',
        comment_id: 'com003',
        like: 0
    }
]

export class LikesDislikesCommentDatabaseMock extends BaseDatabase{
    public TABLE_NAME = 'comments_likes_dislikes'

    public async getLike(commentId:string, userId:string):Promise<LikesDislikesCommentDB[]>{
        return LikesDislikesCommentMock.filter((likeDislike) => likeDislike.user_id === userId && likeDislike.comment_id === commentId)
    };

    public async createComment(newLikeDislike:LikesDislikesCommentDB):Promise<void>{

    };

    public async editLikes(commentId:string, userId:string, like:number):Promise<void>{

    };

    public async deleteComment(commentId:string, userId:string):Promise<void>{

    }
}