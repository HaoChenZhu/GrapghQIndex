import { Database, MongoClient } from "mongo";
import { UserSchema } from "./schema.ts";
import "dotenv";

const connectMongoDB = async (): Promise<Database> => {
    if (!Deno.env.get("MONGO_USER") || !Deno.env.get("MONGO_PWD") || !Deno.env.get("MONGO_URI") || !Deno.env.get("DB_NAME")) {
        console.error(
            `Tu necesitas definir MONGO_USR,MONGO_PWD, MONGO_URI, PORT y DB_NAME env variables`,
        );
        throw Error(
            `Tu necesitas definir MONGO_USR,MONGO_PWD, MONGO_URI, PORT y DB_NAME env variables`,
        );
    }

    const client = new MongoClient();
    await client.connect(
        `mongodb+srv://${Deno.env.get("MONGO_USER")}:${Deno.env.get("MONGO_PWD")}${Deno.env.get("MONGO_URI")}${Deno.env.get("DB_NAME")}?authMechanism=SCRAM-SHA-1`,
    );
    const db = client.database(Deno.env.get("DB_NAME"));
    return db;
};
const db = await connectMongoDB();
console.info(`MomgoDb ${Deno.env.get("DB_NAME")} connected`);
export const userCollection = db.collection<UserSchema>("user");

