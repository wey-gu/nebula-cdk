import { Testing, Chart } from 'cdk8s';
import { NebulaGraph, NebulaGraphProps } from '../src/nebulagraph';
import { NebulaGraphAws } from '../src/nebulagraph-aws';
import * as cdk from '@aws-cdk/core';
import * as eks from '@aws-cdk/aws-eks';

describe('NebulaGraphAws', () => {
  test('should create a NebulaGraphAws stack with default values', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test-stack');
    const clusterProps: eks.ClusterProps = {
      version: eks.KubernetesVersion.V1_20,
    };
    const cluster = new eks.Cluster(stack, 'test-cluster', clusterProps);
    new NebulaGraphAws(stack, 'NebulaGraphAws', { cluster });
    const synthesizedStack = app.synth().getStackArtifact(stack.artifactId).template;
    expect(synthesizedStack).toMatchSnapshot();
    expect(synthesizedStack.Resources).toBeDefined();
    expect(Object.keys(synthesizedStack.Resources)).toContain('testclustermanifestNebulaGraphManifest837CCD15');
  });
});

describe('NebulaGraph', () => {
  test('should create a NebulaGraph cluster with default values', () => {
    const app = Testing.app();
    const chart = new Chart(app, 'test-chart');
    new NebulaGraph(
        chart,
        'NebulaGraph',
        {
            namespace: 'nebula',
        },
        chart
        );

    const results = Testing.synth(chart);
    const nebulaGraphResource = results.find((resource: any) => resource.kind === 'NebulaCluster');
    expect(results).toMatchSnapshot();
    expect(nebulaGraphResource).toBeDefined();
    expect(nebulaGraphResource.spec).toBeDefined();
    expect(nebulaGraphResource.spec.graphd.replicas).toBe(1);
  });
});