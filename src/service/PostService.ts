import Post from "@/domain/model/Post";
import { PostUploadType } from "@/domain/zod/PostUploadSchema";
import { ClientSession, Types } from "mongoose";

export class PostService{
    async createPost(user:Types.ObjectId, post:PostUploadType,dbSession:ClientSession){
        const newPost = new Post({
            author:user,
            caption: post.caption,
            media: post.media,
        })
        return await newPost.save({ session: dbSession })
    }
}