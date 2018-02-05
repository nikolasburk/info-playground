const { graphql } = require('graphql')
const { makeExecutableSchema } = require('graphql-tools')


/**
 * SAMPLE DATA
 */

const post1 = {
  id: 'post-1',
  title: 'My first post',
  author: '123',
}

const posts = [post1]

const users = [
  {
    id: 'user-1',
    username: 'nikolas',
    posts: [post1],
  },
]


/**
 * SCHEMA DEFINITION (SDL)
 */

const typeDefs = `
type User {
  id: ID!
  username: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  author: User!
}

type Query {
  author(id: ID!): User!
  feed: [Post!]!
}
`


/**
 * RESOLVERS
 */

const resolvers = {
  Query: {
    author: (root, { id }, context, info) => {
      console.log(`Query.author - info: `, JSON.stringify(info))
      return users.find(u => u.id === id)
    },
    feed: (root, args, context, info) => {
      console.log(`Query.feed - info: `, JSON.stringify(info))
      return posts
    },
  },
  Post: {
    // this actually not required as graphql-js can infer the value
    title: (root, args, context, info) => {
      console.log(`Post.title - info: `, JSON.stringify(info))
      return root.title
    },
  },
}


/**
 * QUERY
 */

 // without variables
// const queryString = `
// query AuthorWithPosts {
//   author(id: "user-1") {
//     username
//     posts {
//       id
//       title
//     }
//   }
// }
// `

// with variables
const queryString = `
query AuthorWithPosts($userId: ID!) {
  author(id: $userId) {
    username
    posts {
      id
      title
    }
  }
}
`
const variables = { userId: 'user-1' }


/**
 * EXECUTION
 */

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

// without variables
// graphql(executableSchema, queryString, null, null).then(result =>
//   console.log(JSON.stringify(result)),
// )

// with variables
graphql(executableSchema, queryString, null, null, variables).then(result =>
  console.log(JSON.stringify(result)),
)
