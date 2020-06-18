import uuidv4 from 'uuid/v4'
import { PubSub } from 'graphql-yoga'

const Mutation = {
    createUser(parent, args, {db}, info){
        const emailTaken = db.users_data.some((user) => {
            return user.email === args.data.email
        })
        if (emailTaken){
            throw new Error('Email taken.')
        }

        const user = {
            id: uuidv4(),
            ...args.data
        }

        db.users_data.push(user)

        return user
    },

    deleteUser(parent, args, {db}, info){
        const userIndex = db.users_data.findIndex((user)=> user.id===args.id)

        if (userIndex===-1){
            throw new Error('User not Found')
        }

        // if we find user to delete, we should delete both user but attached comment and post
        const deletedUser = db.users_data.splice(userIndex, 1)

        db.posts_data = db.posts_data.filter((post)=>{
            const match = post.author === args.id
            
            if (match) {
                db.comments_data = db.comments_data.filter((comment)=> comment.post_id !== post.id
                )
            }
            return !match
        })

        db.comments_data = db.comments_data.filter((comment)=> comment.author_id !== args.id)

        // console.log(db.comments_data)

        return deletedUser[0]
    },

    updateUser(parent, args, { db }, info){

        const {id, data} = args
        const user = db.users_data.find((user) => user.id === args.id)

        if (!user) {
            throw new Error('User not found')
        }

        if (typeof data.email === 'string'){
            const emailTaken = db.users.some((user)=>user.email = data.email)

            if (emailTaken){
                throw new Error('Email taken')
            }

            user.email = data.email
        }

        if (typeof data.name === 'string'){
            user.name = data.name
        }

        if (typeof data.age !== 'undefined'){
            user.age = data.age
        }

        return user
    },


    createPost(parent, args, {db, pubsub}, info){
        const userExists = db.users_data.some((user)=>{
            return user.id === args.data.author
        })

        if (!userExists) {
            throw new Error('User not found')
        }

        const post = {
            id: uuidv4(), 
            ...args.data
        }

        db.posts_data.push(post)

        if (args.data.published) {
            pubsub.publish('post', {  // make sure the channel name is the same as resolver definition
                post:{
                    mutation: 'CREATED',
                    data: post
                } } )
        }
    
        return post
    },

    
    deletePost(parent, args, { db, pubsub}, info) {
        const postIndex = db.posts_data.findIndex((post)=> post.id===args.id)

        if (postIndex===-1){
            throw new Error('Post not found')
        }

        const [post] = db.posts_data.splice(postIndex,1)

        db.comments_data = db.comments_data.filter((comment)=> comment.post_id!==args.id)

        if (post.published){
            pubsub.publish('post', {
                post:{
                mutation: "DELETED",
                data: post}
            })
        }
        return post
    },

    updatePost(parent, args, { db, pubsub}, info){
        const {id,data} = args
        const post = db.posts_data.find((post)=> post.id === id)
        const originalPost = {... post}

        if (!post) {
            throw new Error('Post not found')
        }

        if (typeof data.title === 'string' ){
            post.title = data.title
        }

        if (typeof data.body === 'string'){
            post.body = data.body
        }

        if (typeof data.published === 'boolean'){
            post.published = data.published
        

        if (originalPost.published && !post.published){
            // deleted
            pubsub.publish('post', {
                post:{
                    mutation: 'DELETED',
                    data: originalPost
                }
            })
        } else if (!originalPost.publish && post.published) {
            // created
            pubsub.publish('post', {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            })
        } 

        }else if (post.published){
            // updated
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }

        return post
    },


    createComment(parent, args, { db, pubsub}, info){
        const userExists = db.users_data.some((user)=> user.id === args.data.author_id )
        const postExists = db.posts_data.some((post)=> post.id === args.data.post_id && post.published)

        if (!userExists || !postExists) {
            throw new Error('Not able to find user and post')
        }

        const comment = {
            id: uuidv4(),
            text: args.data.text,
            author_id: args.data.author_id,
            post_id: args.data.post_id
        }

        db.comments_data.push(comment)
        pubsub.publish(`comment ${args.data.post_id}`, { comment })
        return comment
    },

    deleteComment(parent, args, {db}, info){
        const commentIndex = db.comments_data.findIndex((comment)=> comment.id===args.id)

        if (commentIndex === -1){
            throw new Error ('Comment not found')
        }

        const deleteComment = db.comments_data.splice(commentIndex,1)

        return deleteComment[0]

    },

    updateComment(parent, args, {db}, info){
        const {id,data} = args
        const comment = db.comments_data.find((comment)=> comment.id === id)

        if (!comment) {
            throw new Error('Comment not found')
        }

        if (typeof data.text === 'string' ){
            comment.text = data.text
        }

        return comment
    },
}

export {Mutation as default}