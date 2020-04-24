import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as CdkWritingTestTest from '../lib/cdk-writing-test-test-stack';

import * as iam from '@aws-cdk/aws-iam'

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CdkWritingTestTest.CdkWritingTestTestStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});

test('default group', () => {
  const app = new cdk.App()

  const stack = new cdk.Stack(app, 'TestRolesStack')

  const role1 = new iam.Role(stack, 'Admin', {
    assumedBy: new iam.ArnPrincipal('admin arn')
  })

  const ec2FullAccess = iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2FullAccess')

  const eksFullAccess = new iam.PolicyStatement({
    resources: ['*'],
    actions: ['eks:*']
  })

  const inlinePolicy = new iam.Policy(stack, 'InlinePolicy', {
    statements: [eksFullAccess]
  })

  role1.addManagedPolicy(ec2FullAccess)
  role1.attachInlinePolicy(inlinePolicy)

  const developer1 = new iam.ArnPrincipal('developer 1 arn')

  const role2 = new iam.Role(stack, 'Developer', {
    assumedBy: new iam.CompositePrincipal(developer1)
  })

  new cdk.CfnOutput(stack, 'Role1Arn', {
    value: role1.roleArn
  })

  new cdk.CfnOutput(stack, 'Role2Arn', {
    value: role2.roleArn
  })

  expectCDK(stack).to(matchTemplate({
    "Resources": {
      "AdminC75D2A91": {
        "Type": "AWS::IAM::Role",
        "Properties": {
          "AssumeRolePolicyDocument": {
            "Statement": [
              {
                "Action": "sts:AssumeRole",
                "Effect": "Allow",
                "Principal": {
                  "AWS": "admin arn"
                }
              }
            ],
            "Version": "2012-10-17"
          },
          "ManagedPolicyArns": [
            {
              "Fn::Join": [
                "",
                [
                  "arn:",
                  {
                    "Ref": "AWS::Partition"
                  },
                  ":iam::aws:policy/AmazonEC2FullAccess"
                ]
              ]
            }
          ]
        }
      },
      "InlinePolicy51297574": {
        "Type": "AWS::IAM::Policy",
        "Properties": {
          "PolicyDocument": {
            "Statement": [
              {
                "Action": "eks:*",
                "Effect": "Allow",
                "Resource": "*"
              }
            ],
            "Version": "2012-10-17"
          },
          "PolicyName": "InlinePolicy51297574",
          "Roles": [
            {
              "Ref": "AdminC75D2A91"
            }
          ]
        }
      },
      "Developer08C05065": {
        "Type": "AWS::IAM::Role",
        "Properties": {
          "AssumeRolePolicyDocument": {
            "Statement": [
              {
                "Action": "sts:AssumeRole",
                "Effect": "Allow",
                "Principal": {
                  "AWS": "developer 1 arn"
                }
              }
            ],
            "Version": "2012-10-17"
          }
        }
      }
    },
    "Outputs": {
      "Role1Arn": {
        "Value": {
          "Fn::GetAtt": [
            "AdminC75D2A91",
            "Arn"
          ]
        }
      },
      "Role2Arn": {
        "Value": {
          "Fn::GetAtt": [
            "Developer08C05065",
            "Arn"
          ]
        }
      }
    }
  }, MatchStyle.EXACT))
});
