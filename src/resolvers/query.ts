import { verifyJWT } from "../lib/jwt.ts";
import { User } from "../type.ts";
interface Context {
    token: string
    // lang:string
}
export const Query = {
    Me: async (parent: unknown, args: { token: string }, ctx: Context) => {
        try {
            const token = ctx.token
            if (token) {
                const user: User = (await verifyJWT(
                    token,
                    Deno.env.get("JWT_SECRET")!
                )) as User;
                return user;
            }
        } catch (e) {
            throw new Error(e);
        }
    },
    hello: () => "Hello World!",
};

