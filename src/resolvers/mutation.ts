import { ObjectId } from "mongo";
import { commentCollection, postCollection, userCollection } from "../mongoDB/db.ts";
import { CommentSchema, PostSchema, UserSchema } from "../mongoDB/schema.ts";
import { createJWT, verifyJWT } from "../lib/jwt.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import "dotenv";
import { User } from "../type.ts";
interface Context {
    token: string
    // lang:string
}
export const Mutation = {
    register: async (
        _: unknown,
        args: {
            username: string;
            email: string;
            password: string;
            name: string;
            surname: string;
        }
    ): Promise<UserSchema & { token: string }> => {
        try {
            const user: UserSchema | undefined = await userCollection.findOne({
                username: args.username,
            });

            if (user) throw new Error("User already exists");

            const hashedPassword = await bcrypt.hash(args.password);
            const _id = new ObjectId();

            /* const _id :ObjectId = await userCollection.insertOne({
                ...args
            }) */
            const token = await createJWT(
                {
                    username: args.username,
                    email: args.email,
                    name: args.name,
                    surname: args.surname,
                    id: _id.toString(),
                },
                Deno.env.get("JWT_SECRET")!
            );
            const newUser: UserSchema = {
                _id,
                username: args.username,
                email: args.email,
                password: hashedPassword,
                name: args.name,
                surname: args.surname,
            };
            await userCollection.insertOne(newUser);

            return {
                ...newUser,
                token,
            };
        } catch (error) {
            throw new Error(error);
        }
    },
    login: async (
        parent: unknown,
        args: {
            username: string;
            password: string;
        }
    ): Promise<string> => {
        try {
            const user: UserSchema | undefined = await userCollection.findOne({
                username: args.username,
            });
            if (!user) {
                throw new Error("User does not exist");
            }
            const validPassword = await bcrypt.compare(args.password, user.password!);
            if (!validPassword) {
                throw new Error("Invalid password");
            }
            const token = await createJWT(
                {
                    username: user.username,
                    email: user.email,
                    name: user.name,
                    surname: user.surname,
                    id: user._id.toString(),
                },
                Deno.env.get("JWT_SECRET")!
            );
            return token;
        } catch (e) {
            throw new Error(e);
        }
    },
    post: async (_: unknown, args: { title: string, content: string }, ctx: Context): Promise<PostSchema> => {
        const token = ctx.token
        const { title, content } = args;
        if (!token) throw new Error("Acceso denegado")
        const user: User = (await verifyJWT(
            token,
            Deno.env.get("JWT_SECRET")!
        )) as User;
        if (!user) throw new Error("Token incorrecto")
        const post = await postCollection.insertOne({
            title: title,
            content: content,
            author: new ObjectId(user.id),
            comments: []
        })
        return {
            _id: post,
            title,
            content,
            author: new ObjectId(user.id),
            comments: []
        }
    },
    comment: async (_: unknown, args: { postId: string, comment: string }, ctx: Context): Promise<CommentSchema> => {
        const token = ctx.token
        const { postId, comment } = args;
        if (!token) throw new Error("Acceso denegado")
        const user: User = (await verifyJWT(
            token,
            Deno.env.get("JWT_SECRET")!
        )) as User;
        if (!user) throw new Error("Token incorrecto")
        const id = new ObjectId();
        const post = await postCollection.updateOne({
            _id: new ObjectId(postId)
        }, {
            $push: { comments: { $each: [id] } }
        })
        if (!post) throw new Error("No existe ese post")
        const content = await commentCollection.insertOne({
            _id: id,
            content: comment,
            author: new ObjectId(user.id)
        })
        return {
            _id: id,
            content: comment,
            author: new ObjectId(id)
        };
    }
}