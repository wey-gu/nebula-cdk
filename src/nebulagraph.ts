import { Construct } from 'constructs';
import { Chart } from 'cdk8s';
import { ApiObject, Helm } from 'cdk8s';
import * as kplus from 'cdk8s-plus-25';

export interface NebulaGraphProps {
    namespace?: string; // default to 'default'
    // Graphd properties
    graphdResourcesRequestsCpu?: string;
    graphdResourcesRequestsMemory?: string;
    graphdResourcesLimitsCpu?: string;
    graphdResourcesLimitsMemory?: string;
    graphdReplicas?: number;
    graphdImage?: string;
    graphdVersion?: string;
    graphdServiceType?: string;
    graphdExternalTrafficPolicy?: string;
    graphdLogVolumeClaimResourcesRequestsStorage?: string;
    graphdLogVolumeClaimStorageClassName?: string;
    // Metad properties
    metadResourcesRequestsCpu?: string;
    metadResourcesRequestsMemory?: string;
    metadResourcesLimitsCpu?: string;
    metadResourcesLimitsMemory?: string;
    metadReplicas?: number;
    metadImage?: string;
    metadVersion?: string;
    metadDataVolumeClaimResourcesRequestsStorage?: string;
    metadDataVolumeClaimStorageClassName?: string;
    metadLogVolumeClaimResourcesRequestsStorage?: string;
    metadLogVolumeClaimStorageClassName?: string;
    // Storaged properties
    storagedResourcesRequestsCpu?: string;
    storagedResourcesRequestsMemory?: string;
    storagedResourcesLimitsCpu?: string;
    storagedResourcesLimitsMemory?: string;
    storagedReplicas?: number;
    storagedImage?: string;
    storagedVersion?: string;
    storagedDataVolumeClaimsResourcesRequestsStorage?: string;
    storagedDataVolumeClaimsStorageClassName?: string;
    storagedLogVolumeClaimResourcesRequestsStorage?: string;
    storagedLogVolumeClaimStorageClassName?: string;
    // agent and exporter properties
    agentImage?: string;
    agentVersion?: string;
    agentResourcesRequestsCpu?: string;
    agentResourcesRequestsMemory?: string;
    agentResourcesLimitsCpu?: string;
    agentResourcesLimitsMemory?: string;
    exporterImage?: string;
    exporterVersion?: string;
    exporterReplicas?: number;
    exporterMaxRequests?: number;
    // other properties
    logRotateCounts?: number;
    logRotateSize?: string;
    referenceName?: string;
    referenceVersion?: string;
    imagePullPolicy?: string;
    topologySpreadConstraintstopologyKey?: string;
    topologySpreadConstraintswhenUnsatisfiable?: string;
    schedulerName?: string;
}
export class NebulaGraph extends Construct {
    constructor(scope: Construct, id: string, props: NebulaGraphProps = {}, chart: Chart) {
        super(scope, id);

        const namespace = props.namespace || 'default';

        // Set default values for graphd properties
        const graphdDefaults = {
            graphdResourcesRequestsCpu: '500m',
            graphdResourcesRequestsMemory: '500Mi',
            graphdResourcesLimitsCpu: '1',
            graphdResourcesLimitsMemory: '1Gi',
            graphdReplicas: 1,
            graphdImage: 'vesoft/nebula-graphd',
            graphdVersion: 'v3.6.0',
            graphdServiceType: 'NodePort',
            graphdExternalTrafficPolicy: 'Local',
            graphdLogVolumeClaimResourcesRequestsStorage: '1Gi',
        };
        // Set default values for metad properties
        const metadDefaults = {
            metadResourcesRequestsCpu: '500m',
            metadResourcesRequestsMemory: '500Mi',
            metadResourcesLimitsCpu: '1',
            metadResourcesLimitsMemory: '1Gi',
            metadReplicas: 1,
            metadImage: 'vesoft/nebula-metad',
            metadVersion: 'v3.6.0',
            metadDataVolumeClaimResourcesRequestsStorage: '5Gi',
            metadLogVolumeClaimResourcesRequestsStorage: '1Gi',
        };
        // Set default values for storaged properties
        const storagedDefaults = {
            storagedResourcesRequestsCpu: '500m',
            storagedResourcesRequestsMemory: '500Mi',
            storagedResourcesLimitsCpu: '1',
            storagedResourcesLimitsMemory: '1Gi',
            storagedReplicas: 3,
            storagedImage: 'vesoft/nebula-storaged',
            storagedVersion: 'v3.6.0',
            storagedDataVolumeClaimsResourcesRequestsStorage: '10Gi',
            storagedLogVolumeClaimResourcesRequestsStorage: '1Gi',
        };
        // Set default values for agent and exporter properties
        const agentExporterDefaults = {
            agentImage: 'vesoft/nebula-agent',
            agentVersion: 'latest',
            agentResourcesRequestsCpu: '100m',
            agentResourcesRequestsMemory: '128Mi',
            agentResourcesLimitsCpu: '200m',
            agentResourcesLimitsMemory: '256Mi',
            exporterImage: 'vesoft/nebula-stats-exporter',
            exporterVersion: 'v3.3.0',
            exporterReplicas: 1,
            exporterMaxRequests: 20,
        };
        // Set default values for other properties
        const otherDefaults = {
            logRotateCounts: 5,
            logRotateSize: '100M',
            referenceName: 'statefulsets.apps',
            referenceVersion: 'v1',
            imagePullPolicy: 'Always',
            topologySpreadConstraintstopologyKey: 'kubernetes.io/hostname',
            topologySpreadConstraintswhenUnsatisfiable: 'ScheduleAnyway',
        };
        // Merge user-provided props with default values
        const graphdProps = { ...graphdDefaults, ...props };
        const metadProps = { ...metadDefaults, ...props };
        const storagedProps = { ...storagedDefaults, ...props };
        const agentExporterProps = { ...agentExporterDefaults, ...props };
        const otherProps = { ...otherDefaults, ...props };

        // Create the namespace if it doesn't exist
        new kplus.Namespace(chart, 'NebulaNamespace', {
            metadata: {
                name: namespace,
            },
        });

        // Install the NebulaGraph Operator using Helm
        const operatorNamespace = 'nebula-operator-system';
        const chartVersion = '1.6.0';

        new Helm(chart, 'NebulaOperator', {
            chart: 'nebula-operator',
            repo: 'https://vesoft-inc.github.io/nebula-operator/charts',
            namespace: operatorNamespace,
            version: chartVersion,
        });

        // Create a NebulaGraph Cluster with CRD
        // Reference: https://github.com/vesoft-inc/nebula-operator/blob/master/config/samples/apps_v1alpha1_nebulacluster.yaml
        new ApiObject(chart, 'NebulaCluster', {
            apiVersion: 'apps.nebula-graph.io/v1alpha1',
            kind: 'NebulaCluster',
            metadata: {
                name: 'nebula',
                namespace: namespace,
            },
            spec: {
                graphd: {
                    resources: {
                        requests: {
                            cpu: graphdProps.graphdResourcesRequestsCpu,
                            memory: graphdProps.graphdResourcesRequestsMemory,
                        },
                        limits: {
                            cpu: graphdProps.graphdResourcesLimitsCpu,
                            memory: graphdProps.graphdResourcesLimitsMemory,
                        },
                    },
                    replicas: graphdProps.graphdReplicas,
                    image: graphdProps.graphdImage,
                    version: graphdProps.graphdVersion,
                    service: {
                        type: graphdProps.graphdServiceType,
                        externalTrafficPolicy: graphdProps.graphdExternalTrafficPolicy,
                    },
                    logVolumeClaim: {
                        resources: {
                            requests: {
                                storage: graphdProps.graphdLogVolumeClaimResourcesRequestsStorage,
                            },
                        },
                        storageClassName: graphdProps.graphdLogVolumeClaimStorageClassName,
                    },
                },
                metad: {
                    resources: {
                        requests: {
                            cpu: metadProps.metadResourcesRequestsCpu,
                            memory: metadProps.metadResourcesRequestsMemory,
                        },
                        limits: {
                            cpu: metadProps.metadResourcesLimitsCpu,
                            memory: metadProps.metadResourcesLimitsMemory,
                        },
                    },
                    replicas: metadProps.metadReplicas,
                    image: metadProps.metadImage,
                    version: metadProps.metadVersion,
                    dataVolumeClaim: {
                        resources: {
                            requests: {
                                storage: metadProps.metadDataVolumeClaimResourcesRequestsStorage,
                            },
                        },
                        storageClassName: metadProps.metadDataVolumeClaimStorageClassName,
                    },
                    logVolumeClaim: {
                        resources: {
                            requests: {
                                storage: metadProps.metadLogVolumeClaimResourcesRequestsStorage,
                            },
                        },
                        storageClassName: metadProps.metadLogVolumeClaimStorageClassName,
                    },
                },
                storaged: {
                    resources: {
                        requests: {
                            cpu: storagedProps.storagedResourcesRequestsCpu,
                            memory: storagedProps.storagedResourcesRequestsMemory,
                        },
                        limits: {
                            cpu: storagedProps.storagedResourcesLimitsCpu,
                            memory: storagedProps.storagedResourcesLimitsMemory,
                        },
                    },
                    replicas: storagedProps.storagedReplicas,
                    image: storagedProps.storagedImage,
                    version: storagedProps.storagedVersion,
                    dataVolumeClaims: [
                        {
                            resources: {
                                requests: {
                                    storage: storagedProps.storagedDataVolumeClaimsResourcesRequestsStorage,
                                },
                            },
                            storageClassName: storagedProps.storagedDataVolumeClaimsStorageClassName,
                        },
                    ],
                    logVolumeClaim: {
                        resources: {
                            requests: {
                                storage: storagedProps.storagedLogVolumeClaimResourcesRequestsStorage,
                            },
                        },
                        storageClassName: storagedProps.storagedLogVolumeClaimStorageClassName,
                    },
                },
                exporter: {
                    image: agentExporterProps.exporterImage,
                    version: agentExporterProps.exporterVersion,
                    replicas: agentExporterProps.exporterReplicas,
                    maxRequests: agentExporterProps.exporterMaxRequests,
                },
                agent: {
                    image: agentExporterProps.agentImage,
                    version: agentExporterProps.agentVersion,
                    resources: {
                        requests: {
                            cpu: agentExporterProps.agentResourcesRequestsCpu,
                            memory: agentExporterProps.agentResourcesRequestsMemory,
                        },
                        limits: {
                            cpu: agentExporterProps.agentResourcesLimitsCpu,
                            memory: agentExporterProps.agentResourcesLimitsMemory,
                        },
                    },
                },
                reference: {
                    name: otherProps.referenceName,
                    version: otherProps.referenceVersion,
                },
                schedulerName: otherProps.schedulerName,
                logRotate: {
                    rotate: otherProps.logRotateCounts,
                    size: otherProps.logRotateSize,
                },
                imagePullPolicy: otherProps.imagePullPolicy,
                topologySpreadConstraints: [
                    {
                        topologyKey: otherProps.topologySpreadConstraintstopologyKey,
                        whenUnsatisfiable: otherProps.topologySpreadConstraintswhenUnsatisfiable,
                    },
                ],
            },
        });
    }
}