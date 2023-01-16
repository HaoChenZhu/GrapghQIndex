import { ObjectId } from "mongo"
import { User } from "../type.ts";

export type UserSchema = Omit<User, "id" | "token"> & {
    _id: ObjectId,
}
