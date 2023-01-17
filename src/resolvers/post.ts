import { commentCollection, userCollection } from "../mongoDB/db.ts";
import { CommentSchema, PostSchema, UserSchema } from "../mongoDB/schema.ts";
import { ObjectId } from "mongo"

export const Post = {
    id: (parent: PostSchema): string => parent._id.toString(),
    author: async (
        parent: PostSchema
    ): Promise<UserSchema> => {
        try {
            const author = await userCollection.findOne({
                _id: parent.author
            })
            if (!author) throw console.error("No existe author");
            return author;
        } catch (e) {
            throw new Error(e);
        }
    },
    comments: async (parent: PostSchema): Promise<CommentSchema[]> => {
        try {
            const postComments = parent.comments;
            const comments = await commentCollection.find({
                _id: { $in: parent.comments }
            }).toArray()
            if (!comments) throw new Error("NO hay nada")
            return comments
        } catch (e) {
            throw new Error(e);

        }
    }
}