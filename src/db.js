
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
    author_id:'3',
    post_id:'01'
},{
    id:'002',
    text:'OK, fine',
    author_id:'1',
    post_id:'03'
},{
    id:'003',
    text:'Could you tell me more about this?',
    author_id:'2',
    post_id:'02'
},{
    id:'004',
    text:`OK, that's cool`,
    author_id: '3',
    post_id:'01'
}]


const db = {
    users_data,
    posts_data,
    comments_data
}

export {db as default}