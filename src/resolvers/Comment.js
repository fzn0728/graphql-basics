const Comment = {
    author(parent, args, {db}, info){
        return db.users_data.find((user) => {
            return user.id === parent.author_id
        })
    },
    post(parent, args, {db}, info){
        return db.posts_data.find((post)=>{
            return post.id === parent.post_id
        })
    }
}

export {Comment as default}