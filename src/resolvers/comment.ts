import { userCollection } from "../mongoDB/db.ts";
import { CommentSchema, UserSchema } from "../mongoDB/schema.ts";
import { ObjectId } from "mongo"

export const Comment = {
    id: (parent: CommentSchema): string => parent._id.toString(),
    author: async (parent: CommentSchema): Promise<UserSchema> => {
        try {
            const author = await userCollection.findOne({
                _id: parent.author
            })
            if (!author) throw console.error("No existe author coment");
            return author;
        } catch (e) {
            throw new Error(e);
        }
    }
}