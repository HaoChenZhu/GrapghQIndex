import { ObjectId } from "mongo"
import { Comment, Post, User } from "../type.ts";

export type UserSchema = Omit<User, "id" | "token" | "post"> & {
    _id: ObjectId,
}

export type PostSchema = Omit<Post, "id" | "author" | "comments"> & {
    _id: ObjectId,
    author: ObjectId,
    comments: ObjectId[]
}

export type CommentSchema = Omit<Comment, "id" | "author"> & {
    _id: ObjectId,
    author: ObjectId
}
