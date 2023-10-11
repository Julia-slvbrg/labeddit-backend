import { BaseDatabase } from "../../src/database/BaseDatabase";
import { GetPostDB, PostDB } from "../../src/models/Post";
import { LikesDislikesPostCountDB } from "../../src/models/LikesDislikesPost";
import { CommentDB } from "../../src/models/Comment";

const postsMock: PostDB[] = [
    {
        id: 'post001',
        creator_id: 'id-mock-normUser',
        content: "normUser's first post",
        likes: 1,
        dislikes: 0,
        comments: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 'post002',
        creator_id: 'id-mock-normUser',
        content: "normUser's second post",
        likes: 0,
        dislikes: 0,
        comments: 7,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 'post003',
        creator_id: 'id-mock-adminUser',
        content: "adminUser's first post",
        likes: 1,
        dislikes: 1,
        comments: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
]

export class PostDatabaseMock extends BaseDatabase{
    public TABLE_NAME = 'posts'

    public async createPost(newPost:PostDB):Promise<void>{

    };

    public async getPosts():Promise<GetPostDB[]>{
        const posts = postsMock.map((post) =>( 
            {
                id: post.id,
                content: post.content,
                likes: post.likes,
                dislikes: post.dislikes,
                comments: post.comments,
                createdAt: post.created_at,
                updatedAt: post.updated_at,
                creatorId: post.creator_id,
                creatorName: post.creator_id === 'id-mock-normUser'? 'NormUser' : 'AdminUser'
            }
        ));
        return posts
    };

    public async getPostById(id:string):Promise<PostDB>{
        return postsMock.filter((post) => post.id === id)[0]
    };

    public async getPostDataById(id:string):Promise<GetPostDB[]>{
        const postMock = postsMock.filter((post) => post.id === id);
        const result = postMock.map((post) =>( 
            {
                id: post.id,
                content: post.content,
                likes: post.likes,
                dislikes: post.dislikes,
                comments: post.comments,
                createdAt: post.created_at,
                updatedAt: post.updated_at,
                creatorId: post.creator_id,
                creatorName: post.creator_id === 'id-mock-normUser'? 'NormUser' : 'AdminUser'
            }
        ));
        return result
    }; 

    public async updatePost(editedPost:PostDB):Promise<void>{
        
    };

    public async deletePost(id:string):Promise<void>{

    };

    public async editPostLikes(postId:string, newLikeDislikeCount:LikesDislikesPostCountDB):Promise<void>{

    };

    public async createComment(newComment:CommentDB):Promise<void>{

    }
}
