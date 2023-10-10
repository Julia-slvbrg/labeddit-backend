import { BaseDatabase } from "../../src/database/BaseDatabase";
import { CommentDB, GetCommentDB } from "../../src/models/Comment";
import { LikesDislikesCommentCountDB } from "../../src/models/LikesDislikesComments";

const commentsMock: CommentDB[] = [
    {
        id: 'comment001',
        creator_id: 'id-mock-normUser',
        post_id: 'post002',
        content: 'first comment',
        likes: 2,
        dislikes: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 'comment002',
        creator_id: 'id-mock-adminUser',
        post_id: 'post002',
        content: 'second comment',
        likes: 0,
        dislikes: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 'comment003',
        creator_id: 'id-mock-adminUser',
        post_id: 'post001',
        content: 'third comment',
        likes: 0,
        dislikes: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
]

export class CommentDatabaseMock extends BaseDatabase{
    public TABLE_NAME = 'comments'

    public async createComment(newComment:CommentDB):Promise<void>{
    
    };

    public async getCommentById(id:string):Promise<CommentDB>{
        const [commentDB]:CommentDB[] = await super.findById(id);

        return commentDB
    };

    public async getCommentsByPostId(id:string):Promise<GetCommentDB[]>{
        const commentMock = commentsMock.filter((comment) => comment.post_id === id);
        const result = commentMock.map((comment) =>( 
            {
                id: comment.id,
                postId: comment.post_id,
                content: comment.content,
                likes: comment.likes,
                dislikes: comment.dislikes,
                createdAt: comment.created_at,
                updatedAt: comment.updated_at,
                creatorId: comment.creator_id,
                creatorName: comment.creator_id === 'id-mock-normUser'? 'NormUser' : 'AdminUser'
            }
        ));
        return result
    };

    public async editCommentLikes(commentId:string, newLikeDislikeCount:LikesDislikesCommentCountDB):Promise<void>{
       
    }
}