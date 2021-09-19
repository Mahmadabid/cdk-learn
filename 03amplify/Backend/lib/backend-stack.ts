import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const api = new appsync.GraphqlApi(this, 'Todo Graphql Api', {
      name: 'Todo App',
      schema: appsync.Schema.fromAsset('schema/schema.gql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365))
          }
        }
      }
    });

    const todosLambda = new lambda.Function(this, 'todoslambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'main.handle'
    })

    const lambdaDataSource = api.addLambdaDataSource('todos', todosLambda);

    lambdaDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'getTodos'
    })

    lambdaDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'createTodo'
    })

    lambdaDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'delTodo'
    })

    lambdaDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'updateTodos'
    })

  }
}
