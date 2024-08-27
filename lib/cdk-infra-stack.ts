import * as cdk from 'aws-cdk-lib';
import { Repository } from "aws-cdk-lib/aws-codecommit";
import { Construct } from 'constructs';
import { CodeBuildStep, CodePipeline, CodePipelineSource } from "aws-cdk-lib/pipelines";
import { EksDeployStage } from "./eks-deploy-stage";

export class CDKInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // CC deprecated -- use GitHub
    // const repo = new Repository(this, "WorkshopRepo", {
    //   repositoryName: "eks-flux-repo",
    // });

    const pipeline = new CodePipeline(this, "Pipeline", {
      pipelineName: "eks-flux-pipeline",
      synth: new CodeBuildStep("SynthStep", {
        input: CodePipelineSource.gitHub('annguyen36/eks-infra', "main"),
        commands: ["npm ci", "npm run build", "npx cdk synth"],
      }),
    });

    const deploy = new EksDeployStage(this, "EksDeploy");
    const deployStage = pipeline.addStage(deploy);
  }
}
