# CDK NebulaGraph Example

ref: [cdk/v2/guide/hello_world](https://docs.aws.amazon.com/cdk/v2/guide/hello_world.html)

```bash
mkdir -p examples/cdk
cd examples/cdk
cdk init app --language typescript
```

Create [`lib/cdk-stack.ts`](lib/cdk-stack.ts).

```bash
npm run build
cdk synth
```

Then we could get the generated CloudFormation template in `cdk.out` directory.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
