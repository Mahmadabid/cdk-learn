import client from './ddbClient';

async function updateTodo(todosId: string) {
    const params = {
        TableName: process.env.TODOS_TABLE? process.env.TODOS_TABLE: '',
        key: {
            id: todosId
        }
    }
}