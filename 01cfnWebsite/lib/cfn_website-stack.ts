import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';

export class CfnWebsiteStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const myWebsiteBucket = new s3.Bucket(this, 'MyS3Bucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true
    })

    const distribution = new cloudfront.Distribution(this, 'cfn My website', {
      defaultBehavior: { origin: new origins.S3Origin(myWebsiteBucket) }
    })

    new cdk.CfnOutput(this, 'cfn domain', {
      value: distribution.domainName
    })

    new s3deploy.BucketDeployment(this, 'My web Bucket', {
      sources: [s3deploy.Source.asset('./website')],
      destinationBucket: myWebsiteBucket,
      distribution
    })

  }
}
