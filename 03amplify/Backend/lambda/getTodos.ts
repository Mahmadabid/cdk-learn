import client from "./ddbClient";

async function getTodos() {
    const params = {
        TableName: process.env.TODOS_TABLE? process.env.TODOS_TABLE: ''
    }

    try {
        const data = await client.scan(params).promise();
        return data.Items
    }
    catch(err) {
        console.log('error getting todos: ', err);
        return null;
    }
}

export default getTodos;