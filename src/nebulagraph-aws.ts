import { App, Chart } from 'cdk8s';
import { NebulaGraph, NebulaGraphProps } from './nebulagraph';
import * as cdk from '@aws-cdk/core';
import * as eks from '@aws-cdk/aws-eks';

export interface NebulaGraphAwsProps extends cdk.StackProps {
    cluster: eks.Cluster;
    nebulaGraphProps?: NebulaGraphProps;
}

export class NebulaGraphAws extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: NebulaGraphAwsProps) {
        super(scope, id, props);

        const app = new App();
        const chart = new Chart(app, 'NebulaGraphChart');
        new NebulaGraph(chart, 'NebulaGraph', props.nebulaGraphProps, chart);
        const k8sManifests = App._synthChart(chart);

        props.cluster.addManifest('NebulaGraphManifest', ...k8sManifests);
    }
}