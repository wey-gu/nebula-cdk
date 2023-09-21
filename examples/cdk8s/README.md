# CDK8s NebulaGraph Example

ref: [cdk8s/getting-started](https://cdk8s.io/docs/latest/getting-started/)

```bash
npm install -g cdk8s-cli
mkdir -p examples/cdk8s
cd examples/cdk8s
cdk8s init typescript-app
```

Create [`main.ts`](main.ts).

```bash
npm ci
npm run compile && cdk8s synth
```

Then we could get the generated k8s yaml files in `dist` directory, like: [this](dist_example/nebulachart-c8b8cce5.k8s.yaml)
