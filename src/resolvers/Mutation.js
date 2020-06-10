import uuidv4 from 'uuid/v4'

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


    createPost(parent, args, {db}, info){
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
        return post
    },

    
    deletePost(parent, args, {db}, info) {
        const postIndex = db.posts_data.findIndex((post)=> post.id===args.id)

        if (postIndex===-1){
            throw new Error('Post not found')
        }

        const deletedPost = db.posts_data.splice(postIndex,1)

        db.comments_data = db.comments_data.filter((comment)=> comment.post_id!==args.id)

        return deletedPost[0]
    },

    createComment(parent, args, {db}, info){
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
        return comment
    },

    deleteComment(parent, args, {db}, info){
        const commentIndex = db.comments_data.findIndex((comment)=> comment.id===args.id)

        if (commentIndex === -1){
            throw new Error ('Comment not found')
        }

        const deleteComment = db.comments_data.splice(commentIndex,1)

        return deleteComment[0]

    }
}

export {Mutation as default}