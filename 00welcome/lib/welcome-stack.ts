import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda';

export class WelcomeStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);

      // The code that defines your stack goes here

      const Welcome_Lambda = new lambda.Function(this, 'Welcome', {
        runtime: lambda.Runtime.NODEJS_10_X,
        code: lambda.Code.fromAsset('lambda'),
        handler: 'welcome.handler'
      })
    }
}