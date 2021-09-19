import { DynamoDB } from 'aws-sdk'; 

const client = new DynamoDB.DocumentClient;

type AppSyncEvent = {
  info: {
    fieldName: String
  },
  arguments: {
    product: Product
  }
}

type Product = {
  id: String,
  name: String,
  price: Number
}

exports.handler = async(event: AppSyncEvent) => {
  if (event.info.fieldName == 'hello') {
    return 'hello world'
  }
  else if (event.info.fieldName == 'addProduct') {

    event.arguments.product.id = 'key-' + Math.random();

    const params = {
      TableName: process.env.TABLE_NAME || 'product',
      Item: event.arguments.product
    }

    const data = await client.put(params).promise();
    console.log(data);
    
    return event.arguments.product;
    
  }
  else {
    return 'Not found'
  }
}