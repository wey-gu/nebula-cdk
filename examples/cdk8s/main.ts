import { App, Chart } from 'cdk8s';
import { NebulaGraph } from '../../src/nebulagraph';

const app = new App();
const chart = new Chart(app, 'NebulaChart');

new NebulaGraph(chart, 'NebulaGraph', {
  namespace: 'nebula',
  graphdLogVolumeClaimStorageClassName: 'efs-sc',
  storagedLogVolumeClaimStorageClassName: 'efs-sc',
  storagedDataVolumeClaimsStorageClassName: 'efs-sc',
  metadLogVolumeClaimStorageClassName: 'efs-sc',
  metadDataVolumeClaimStorageClassName: 'efs-sc',
}, chart);

app.synth();