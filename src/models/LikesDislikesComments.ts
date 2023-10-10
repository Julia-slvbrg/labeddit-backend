export class LikesDislikesComment{
    constructor(
        private userId: string,
        private commentId: string,
        private like: number
    ){};

    public getUserId():string{
        return this.userId
    };
    public getCommentId():string{
        return this.commentId
    };
    public getLike():number{
        return this.like
    };
    public setLike(like:number):void{
        this.like = like
    };

    public likeDislikeToDBModel(){
        return{
            user_id: this.userId,
            comment_id: this.commentId,
            like: this.like
        }
    }
};

export interface LikesDislikesCommentDB{
    user_id: string,
    comment_id: string,
    like: number
};

export interface LikesDislikesCommentCountDB{
    newLikeCount: number,
    newDislikeCount: number
}