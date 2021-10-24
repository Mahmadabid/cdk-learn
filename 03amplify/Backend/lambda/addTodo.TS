import client from "./ddbClient";
import Todo from './Todo';

async function addTodo(todo: Todo) {
    const params= {
        TableName: process.env.TODOS_TABLE,
        Item: todo
    }

    try {
        await client.put(params).promise();
        return todo
    }
    catch (err) {
        console.log('error adding todo: ', err);
        return null
    }
}

export default addTodo;