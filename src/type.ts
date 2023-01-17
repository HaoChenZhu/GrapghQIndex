export type User = {
    id: string;
    username: string;
    email: string;
    password?: string;
    name: string;
    surname: string;
    token?: string;
    posts?: [Post]
}


export type Post = {
    id: string;
    title: string;
    content: string;
    author: User;
    comments: [Comment]
}

export type Comment = {
    id: string;
    content: string;
    author: User;
}