const Query = {
    users(parent, args, {db}, info){
        if (!args.query) {
            return db.users_data
        }

        return users_data.filter((user)=> {
            return user.name.toLowerCase().includes(args.query.toLowerCase())
        })
    },

    posts(parent, args, {db}, info) {
        if (!args.query){
            return db.posts_data
        }

        return db.posts_data.filter((xyz)=> {
            const isTitleMatch =  xyz.title.toLowerCase().includes(args.query.toLowerCase())
            const isBodyMatch =  xyz.body.toLowerCase().includes(args.query.toLowerCase())
            return isTitleMatch || isBodyMatch
        })
    },

    comments(parent, args, {db}, info){
        return db.comments_data
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

export {Query as default}