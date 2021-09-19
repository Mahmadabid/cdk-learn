import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as appSync from '@aws-cdk/aws-appsync';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class DynamoLambdaAppsyncStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const api = new appSync.GraphqlApi(this, 'Api', {
      name: 'GraphQL testing',
      schema: appSync.Schema.fromAsset('schema/schema.gql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appSync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365))
          }
        },
      },
    });

    const DynamoAppsyncLambda = new lambda.Function(this, 'Dynamo Lambda Appsync function', {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'DynamoLambdaAppsync.handler'
    });

    const lambdaDataSource = api.addLambdaDataSource('LambdaFunction', DynamoAppsyncLambda);

    lambdaDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'hello'
    });

    lambdaDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'addProduct'
    })

    const productTable = new dynamodb.Table(this, 'ProductTable', {
      tableName: 'ProductTable',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
    })

    productTable.grantFullAccess(DynamoAppsyncLambda);

    DynamoAppsyncLambda.addEnvironment('TABLE_NAME', productTable.tableName);

    //prints out graphql Api url
    new cdk.CfnOutput(this, 'Graphql Url', {
      value: api.graphqlUrl
    })

    //prints out graphql Api key
    new cdk.CfnOutput(this, 'Graphql Key', {
      value: api.apiKey || ''
    })

    //prints out stack region
    new cdk.CfnOutput(this, 'Stack Region', {
      value: this.region
    })

  }
}
