#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkWritingTestTestStack } from '../lib/cdk-writing-test-test-stack';

const app = new cdk.App();
new CdkWritingTestTestStack(app, 'CdkWritingTestTestStack');
