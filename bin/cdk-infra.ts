#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CDKInfraStack } from '../lib/cdk-infra-stack';
// import { InfraStack2 } from '../lib/infra-stack';

const app = new cdk.App();
new CDKInfraStack(app, 'CDKInfraStack', {});
// new InfraStack2(app, 'InfraStack2');