import { gql } from "graphql_tag";

export const typeDefs = gql`

type User {
    id: ID!
    username: String!
    email: String!
    name: String!
    surname: String!
    token: String
  }

type Query {
    Me(token: String!): User!
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
}
`