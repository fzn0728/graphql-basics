import {GraphQLServer} from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

// Scalar types - String, Boolean, Int, Float, ID 

// Demo user data
const users_data = [{
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

const posts_data = [{
    id: '01',
    title:'How to learn GraphQL',
    body: 'Learning GraphQL contains abc step, step_1, step_2, step_3',
    published: true,
    author:'1'
},{
    id: '02',
    title:'How to learn Python',
    body: 'That is pretty easy...,',
    published: true,
    author:'1'
},
{
    id: '03',
    title:'How to learn apollo',
    body: 'We will learn that later',
    published: false ,
    author:'2'
}
]

const comments_data = [{
    id:'001',
    text:'That is pretty interesting',
    author:'1',
    posts:'01'
},{
    id:'002',
    text:'OK, fine',
    author:'1',
    posts:'02'
},{
    id:'003',
    text:'Could you tell me more about this?',
    author:'2',
    posts:'03'
},{
    id:'004',
    text:'sth',
    author: '3',
    posts:'01'
}]

// Type definition (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        me: User!
        post: Post!
        comments: [Comment!]!
    }

    type Mutation {
        createUser(name: String!, email: String!, age:Int): User!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments:[Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments:[Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        posts: Post!
    }
`

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info){
            if (!args.query) {
                return users_data
            }

            return users_data.filter((user)=> {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },

        posts(parent, args, ctx, info) {
            if (!args.query){
                return posts_data
            }

            return posts_data.filter((xyz)=> {
                const isTitleMatch =  xyz.title.toLowerCase().includes(args.query.toLowerCase())
                const isBodyMatch =  xyz.body.toLowerCase().includes(args.query.toLowerCase())
                return isTitleMatch || isBodyMatch
            })
        },

        comments(parent, args, ctx, info){
            return comments_data
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

    Mutation: {
        createUser(parent, args, ctx, info){
            const emailTaken = users_data.some((user) => {
                return user.email === args.email
            })
            if (emailTaken){
                throw new Error('Email taken.')
            }

            const user = {
                id: uuidv4(),
                name: args.name,
                email: args.email,
                age:args.age
            }

            users_data.push(user)

            return user
        }
    },

    Post:{
        author(parent, args, ctx, info){
            return users_data.find((user) =>{ // finle is for non-iterable filed, like single user String
                return user.id === parent.author
             })
        },
        comments(parent, args, ctx, info){
            return comments_data.filter((comment)=>{
                return comment.posts === parent.id
            })
        }
    },

    User: {
        posts(parent, args, ctx, info){
            return posts_data.filter((post)=>{
                return post.author === parent.id
            })
        },
        comments(parent, args, ctx, info){
            return comments_data.filter((comment)=>{ // filter is for iterable field, like array []
                return comment.author === parent.id
            })
        }
    },

    Comment: {
        author(parent, args, ctx, info){
            return users_data.find((user) => {
                return user.id === parent.author
            })
        },
        posts(parent, args, ctx, info){
            return posts_data.find((post)=>{
                return post.id === parent.posts
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