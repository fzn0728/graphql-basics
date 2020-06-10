const User = {
    posts(parent, args, {db}, info){
        return db.posts_data.filter((post)=>{
            return db.post.author === parent.id
        })
    },
    comments(parent, args, {db}, info){
        return db.comments_data.filter((comment)=>{ // filter is for iterable field, like array []
            return comment.author_id === parent.id
        })
    }
}

export {User as default}