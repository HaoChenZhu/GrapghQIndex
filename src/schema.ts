import { gql } from "graphql_tag";

/* 
post:
titulo:String
descripcion:string
author:author
comentario:comentario[]

comentario:
author:author
contenido:string

user

*/

export const typeDefs = gql`

type User {
    id: ID!
    username: String!
    email: String!
    name: String!
    surname: String!
    token: String
    posts: [Post!]
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  comments: [Comment!]
}
type Comment{
  id: ID!
  content: String!
  author: User!
}

type Query {
    Me(token: String!): User!
    getPost:[Post!]
    hello: String
  }
type Mutation{
    login(username: String!, password: String!): String!
    register(
      username: String!,
      email: String!,
      password: String!,
      name: String!,
      surname: String!
    ): User!
    post(title: String!,content: String!):Post!
    deletePost(postId: String!): String!
    deleteComment(postId: String!, commentId: String!): String!
    updatePost(postId: String!,title:String, content:String):String!
    comment(postId: String!, comment: String!): Comment!
    updateComment(commentId: String!,content:String!):String!
} 
`