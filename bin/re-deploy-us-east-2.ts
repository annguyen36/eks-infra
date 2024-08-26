#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ReDeployUsEast2Stack } from '../lib/re-deploy-us-east-2-stack';
// import { InfraStack2 } from '../lib/infra-stack';

const app = new cdk.App();
new ReDeployUsEast2Stack(app, 'ReDeployUsEast2Stack', {});
// new InfraStack2(app, 'InfraStack2');