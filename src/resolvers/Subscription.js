const Subscription = {
    comment: {
        subscribe(parent, { postId }, { db, pubsub }, info){
            // Verify postID is a real id
            const postExist = db.posts_data.find((post)=> post.id === postId && post.published)
            
            if (!postExist){
                throw new Error('Post not found')
            }

            return pubsub.asyncIterator(`comment ${postId}`)
        }
    },

    post: {
        subscribe(parent, args, {pubsub}, info){
            return pubsub.asyncIterator('post')
        }
    }
}

export {Subscription as default}