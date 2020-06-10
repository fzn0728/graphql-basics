const Post = {
    author(parent, args, {db}, info){
        return db.users_data.find((user) =>{ // finle is for non-iterable filed, like single user String
            return user.id === parent.author
         })
    },
    comments(parent, args, {db}, info){
        return db.comments_data.filter((comment)=>{
            return comment.post_id === parent.id
        })
    }
}

export {Post as default}