
const users = [
    {
        id: 1,
        email: 'dhouha@gmail.com',
        password: 'password123',
        name: 'Dhouha Hidouri'
    },
    {
        id: 2,
        email: 'Basma@gmail.com',
        password: 'hello456',
        name: 'Basma Hidouri'
    }
];


let todos = [
    { id: 1, text: 'Learn React', userId: 1 },
    { id: 2, text: 'Connect to backend', userId: 1 },
];

let nextTodoId = 3;

module.exports = {
    users,
    todos,
    nextTodoId
};

