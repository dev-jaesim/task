import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class JaeTaskStack extends cdk.Stack {
  private fetchFeatureCollection: NodejsFunction;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.createLambdaFunction();
    this.addLambdaUrl();
  }

  private createLambdaFunction() {
    this.fetchFeatureCollection = new NodejsFunction(this, 'FetchFeatureCollectionLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: './lib/lambda/index.js',
      handler: 'handler'
    });
  }

  private addLambdaUrl() {
    const fetchFeatureCollectionUrl = this.fetchFeatureCollection.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE
    });

    new cdk.CfnOutput(this, 'FunctionUrl', { value: fetchFeatureCollectionUrl.url });
  }
}
