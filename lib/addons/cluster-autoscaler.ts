import { Construct } from 'constructs';
import { Aws, aws_iam as iam, StackProps } from 'aws-cdk-lib';
import { aws_eks as eks } from 'aws-cdk-lib';

export interface ClusterAutoscalerProps extends StackProps {
  cluster: eks.Cluster
}

export class ClusterAutoscaler extends Construct {
  private namespace: string;
  constructor(scope: Construct, id: string, props: ClusterAutoscalerProps) {
    super(scope, id);

    this.namespace = 'cluster-autoscaler';

    // Create namespace for CA
    const ns = props.cluster.addManifest('CANamespace',
      {
        apiVersion: 'v1',
        kind: 'Namespace',
        metadata: {
          name: this.namespace
        } 
      }
    );

    // IRSA setup
    const sa = props.cluster.addServiceAccount('cluster-autoscaler', {
      namespace: this.namespace
    });

    sa.node.addDependency(ns);

    const caPolicy = new iam.Policy(this, 'CAPolicy', {
      roles: [sa.role],
      statements: [
        new iam.PolicyStatement({
          actions: [
            'autoscaling:DescribeAutoScalingGroups',
            'autoscaling:DescribeAutoScalingInstances',
            'autoscaling:DescribeLaunchConfigurations',
            'autoscaling:DescribeTags',
            'ec2:DescribeLaunchTemplateVersions'
          ],
          resources: ['*']
        }),
        new iam.PolicyStatement({
          actions: [
            'autoscaling:SetDesiredCapacity',
            'autoscaling:TerminateInstanceInAutoScalingGroup',
            'autoscaling:UpdateAutoScalingGroup'
          ],
          resources: ['*'],
          conditions: {
            'StringEquals': {
              'autoscaling:ResourceTag/k8s.io/cluster-autoscaler/enabled': 'true'
            }
          }
        })
      ]
    });

    // const chart = props.cluster.addHelmChart('CAHelm', {
    //   chart: 'cluster-autoscaler-chart',
    //   release: 'ca',
    //   repository: 'https://kubernetes.github.io/autoscaler',
    //   namespace: this.namespace,
    //   createNamespace: false,
    //   values: {
    //     'autoDiscovery': {
    //       'clusterName': `${props.cluster.clusterName}`
    //     },
    //     'awsRegion': Aws.REGION,
    //     'rbac': {
    //       'serviceAccount': {
    //         'create': false,
    //         'name': sa.serviceAccountName,
    //         'annotations': {
    //           'eks.amazonaws.com/role-arn': sa.role.roleArn
    //         }
    //       }
    //     },
    //     'podDisruptionBudget': {
    //       'create': false  // Disable PodDisruptionBudget creation
    //     }
    //   }
    // });
    // chart.node.addDependency(ns);
  }
}