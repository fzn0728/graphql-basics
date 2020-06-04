import {GraphQLServer} from 'graphql-yoga'

// Scalar types - String, Boolean, Int, Float, ID 

// Demo user data
const users = [{
    id: '1',
    name: 'fzn',
    email:'fzn@example.com',
    age:27
},{
    id:'2',
    name:'Sarah',
    email:'sarah@exmpale.com'
},{
    id:'3',
    name:'Mike',
    email:'mike@example.com',
    age: 19
}]

const posts = [{
    id: '001',
    title:'How to learn GraphQL',
    body: 'Learning GraphQL contains abc step, step_1, step_2, step_3',
    published: true,
    author:'1'
},{
    id: '002',
    title:'How to learn Python',
    body: 'That is pretty easy...,',
    published: true,
    author:'1'
},
{
    id: '003',
    title:'How to learn apollo',
    body: 'We will learn that later',
    published: false ,
    author:'2'
}
]

// Type definition (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
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
        author: User!
    }
`

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info){
            if (!args.query) {
                return users
            }

            return users.filter((user)=> {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },

        posts(parent, args, ctx, info) {
            if (!args.query){
                return posts
            }

            return posts.filter((xyz)=> {
                const isTitleMatch =  xyz.title.toLowerCase().includes(args.query.toLowerCase())
                const isBodyMatch =  xyz.body.toLowerCase().includes(args.query.toLowerCase())
                return isTitleMatch || isBodyMatch
            })
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
        
    },

    Post:{
        author(parent, args, ctx, info){
            return users.find((user) =>{
                return user.id === parent.author
             })
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