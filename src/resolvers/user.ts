import { postCollection } from "../mongoDB/db.ts";
import { PostSchema, UserSchema } from "../mongoDB/schema.ts";

export const User = {
    id: (parent: UserSchema): string => parent._id.toString(),
    posts: async (parent: UserSchema): Promise<PostSchema[]> => {
        const post = await postCollection.find({
            author: parent._id
        }).toArray();
        return post;
    }
}