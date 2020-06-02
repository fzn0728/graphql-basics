import {GraphQLServer} from 'graphql-yoga'

// String, Boolean, Int, Float, ID 



// Type definition (schema)
const typeDefs = `
    type Query {
        greeting(name: String, position: String): String!
        add(a: Float!, b: Float!): Float!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`

// Resolvers
const resolvers = {
    Query: {
        greeting(parent, args, ctx, info){
            if (args.name && args.position){
                return `Hello, ${args.name} and my favorite ${args.position}!`
            } else{
                return `Hello!`
        } 
        },

        add(parent, args, ctx, info){
            return args.a + args.b
        },

        me() {
            return {
                id: '123456',
                name: 'Chandler',
                email: 'xxxemail',


            }
        },

        post() {
            return {
                id: '213456',
                title: 'Story1',
                body: 'Here is the main body',
                published: true
            }
        }
        
    }

}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is up!')
}) 