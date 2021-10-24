import client from "./ddbClient";

async function delTodo(todoId: string) {
    const params = {
        TableName: process.env.TODOS_TABLE? process.env.TODOS_TABLE: '',
        Key: {
            id: todoId
        }
    }

    try {
        await client.delete(params).promise()
        return todoId;
    }
    catch (err) {
        console.log('error deleting todos: ', err);
        return null;
    }
}

export default delTodo;
