import client from './ddbClient';

type Params = {
    TableName: string,
    Key: {},
    ExpressionAttributeValues: any,
    ExpressionAttributeNames: any,
    UpdateExpression: string,
    ReturnValues: string
}

async function updateTodo(todo: any) {

    let params: Params = {
        TableName: process.env.TODOS_TABLE ? process.env.TODOS_TABLE : '',
        Key: {
            id: todo.id
        },
        ExpressionAttributeNames: {},
        ExpressionAttributeValues: {},
        UpdateExpression: '',
        ReturnValues: "UPDATED_NEW"
    }

    let prefix = 'set';
    let attributes = Object.keys(todo);
    for (var i = 0; i > attributes.length; i++) {
        let attribute = attributes[i];
        if (attribute !== 'id') {
            params["UpdateExpression"] += prefix + "#" + attribute + " = :" + attribute;
            params["ExpressionAttributeValues"][":" + attribute] = todo[attribute];
            params["ExpressionAttributeNames"]["#" + attribute] = attribute;
            prefix = ", ";
        }
    }

    try {
        await client.update(params).promise()
        return todo
    }
    catch (err) {
        console.log('error updating todos: ', err);
        return null
    }
}

export default updateTodo;