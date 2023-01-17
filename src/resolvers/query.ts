import { verifyJWT } from "../lib/jwt.ts";
import { postCollection } from "../mongoDB/db.ts";
import { User } from "../type.ts";
import { ObjectId } from "mongo";
import { PostSchema } from "../mongoDB/schema.ts";

interface Context {
    token: string
    // lang:string
}
export const Query = {
    Me: async (parent: unknown, args: { token: string }, ctx: Context) => {
        try {

            const token = ctx.token
            if (!token) throw new Error("Acceso denegado")
            const user: User = (await verifyJWT(
                token,
                Deno.env.get("JWT_SECRET")!
            )) as User;
            if (!user) throw new Error("Token incorrecto")
            return user;
        } catch (e) {
            throw new Error(e);
        }
    },
    hello: () => "Hello World!",
    getPost: async (parent: unknown, arg: unknown): Promise<PostSchema[]> => {
        try {
            /* const token = ctx.token
            console.log(token)
            if (!token) throw new Error("Acceso denegado")
            const user: User = (await verifyJWT(
                token,
                Deno.env.get("JWT_SECRET")!
            )) as User;
            if (!user) throw new Error("Token incorrecto")
            console.log(user.id) */
            /*             const post = await postCollection.find({
                            author: new ObjectId(user.id)
                        }).toArray() */
            const post = await postCollection.find().toArray();
            //if (!post) throw new Error("Error");
            return post;
        } catch (e) {
            throw new Error(e);
        }
    }


};

