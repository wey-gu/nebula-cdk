import { App, Stack } from '@aws-cdk/core';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as eks from '@aws-cdk/aws-eks';
import { NebulaGraphAws, NebulaGraphAwsProps } from '../../../src/nebulagraph-aws';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const app = new App();
    const stack = new Stack(app, 'NebulaGraphAwsStack');

    // Create an EKS cluster
    const cluster = new eks.Cluster(stack, 'EksCluster', {
      version: eks.KubernetesVersion.V1_20,
    });

    // Create NebulaGraphAws stack
    const nebulaGraphAwsProps: NebulaGraphAwsProps = {
      cluster: cluster,
      nebulaGraphProps: {
        namespace: 'nebula',
        graphdLogVolumeClaimStorageClassName: 'efs-sc',
        storagedLogVolumeClaimStorageClassName: 'efs-sc',
        storagedDataVolumeClaimsStorageClassName: 'efs-sc',
        metadLogVolumeClaimStorageClassName: 'efs-sc',
        metadDataVolumeClaimStorageClassName: 'efs-sc',
      },
    };
    new NebulaGraphAws(stack, 'NebulaGraphAws', nebulaGraphAwsProps);
  }
}

