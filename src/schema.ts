export const typeDefs = `#graphql

  type Book {
    title: String
    author: String
  }
  type Query {
    books: [Book]
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    published: Boolean!
    user: User!
  }

  type {
    User
    [Post]
  }

  type Profile {
    User
  }
`;