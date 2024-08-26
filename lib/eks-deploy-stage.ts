import { InfraStack2 } from './infra-stack';
import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class EksDeployStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const service = new InfraStack2(this, "EKS-infra");
  }

}