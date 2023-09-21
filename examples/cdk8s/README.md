# CDK8s NebulaGraph Example

```bash
npm install -g cdk8s-cli
mkdir examples/cdk8s
cd examples/cdk8s
cdk8s init typescript-app
```

Create [`main.ts`](main.ts).

```bash
npm ci
npm run compile && cdk8s synth
```

Then we could get the generated k8s yaml files in `dist` directory, like: [this](dist_example/nebulachart-c8b8cce5.k8s.yaml)
