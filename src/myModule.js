// Named expoert - Has a name. Have as many as needed. 

const message = 'Some message from myModule.js'
const name  = 'Chandler'
const location = 'NYC'

const getGreeting = (name) => {

    return 'Welcome to the course ${name}'
}

export {

    message,
    name,
    getGreeting,
    location as default
}