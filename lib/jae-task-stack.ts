import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime, FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda';

export class JaeTaskStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create lambda functions.
    const fetchFeatureCollection = this.createLambdaFunction('FetchFeatureCollectionLambda', './lib/lambda/index.js');
    const returnTestData = this.createLambdaFunction('ReturnTestDataLambda', './lib/testLambda/index.js');
    
    // Add a URL to the lambda functions.
    this.addLambdaUrl(fetchFeatureCollection, 'FunctionUrlFetchFeatureCollection');
    this.addLambdaUrl(returnTestData, 'FunctionUrlReturnTestData');
  }

  // Create a Node.js lambda function.
  private createLambdaFunction(id: string, entry: string): NodejsFunction {
    return new NodejsFunction(this, id, {
      runtime: Runtime.NODEJS_18_X,
      entry: entry,
      handler: 'handler'
    });
  }

  // Add a URL to a lambda function.
  private addLambdaUrl(nodejsFunction: NodejsFunction, outputName: string) {
    const functionUrl = nodejsFunction.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE
    });
    new cdk.CfnOutput(this, outputName, { value: functionUrl.url });
  }
}
