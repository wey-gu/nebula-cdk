# NebulaGraph CDK

## Installation

```bash
npm install -g aws-cdk
npm install nebula-cdk
```

## CDK8s

```ts
import { App } from 'cdk8s';
import { NebulaGraph, NebulaGraphProps } from 'nebula-cdk';

const app = new App();
new NebulaGraph(app, 'NebulaGraph', {
  namespace: 'nebula',
  graphdLogVolumeClaimStorageClassName: 'efs-sc',
  storagedLogVolumeClaimStorageClassName: 'efs-sc',
  storagedDataVolumeClaimsStorageClassName: 'efs-sc',
  metadLogVolumeClaimStorageClassName: 'efs-sc',
  metadDataVolumeClaimStorageClassName: 'efs-sc',
});
app.synth();
```

## EKS

```ts
import { App, Stack } from '@aws-cdk/core';
import { Cluster } from '@aws-cdk/aws-eks';
import { NebulaGraphAws, NebulaGraphAwsProps } from 'nebula-cdk';

const app = new App();
const stack = new Stack(app, 'NebulaGraphAwsStack');
const cluster = new Cluster(stack, 'EksCluster');

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
app.synth();
```

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
