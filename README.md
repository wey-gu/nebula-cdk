# NebulaGraph CDK

[![for NebulaGraph](https://img.shields.io/badge/Toolchain-NebulaGraph-blue)](https://github.com/vesoft-inc/nebula) [![AWS CDK](https://img.shields.io/badge/AWS--CDK-Supported-brightgreen)](https://docs.aws.amazon.com/cdk/) [![CDK8s](https://img.shields.io/badge/CDK8s-Supported-brightgreen)](https://cdk8s.io/) [![GitHub release (latest by date)](https://img.shields.io/github/v/release/wey-gu/nebula-cdk?label=Version)](https://github.com/wey-gu/nebula-cdk/releases) [![npm](https://img.shields.io/npm/v/nebula-cdk.svg)](https://www.npmjs.com/package/nebula-cdk)

## Installation

```bash
npm install -g aws-cdk cdk8s-cli
npm install nebula-cdk
```

## CDK8s

See [examples/cdk8s](examples/cdk8s)

## EKS

See [examples/cdk](examples/cdk)

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
