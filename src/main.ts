import { App } from 'cdk8s';
import { NebulaGraph } from './nebulagraph';

const app = new App();
new NebulaGraph(app, 'NebulaGraph', { namespace: 'nebula' });
app.synth();