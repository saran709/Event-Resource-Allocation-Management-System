function generateCloudFormationTemplate({ region, environment, dbInstanceType, appInstanceCount, authType }) {
  const env = environment || 'production';
  const dbSize = dbInstanceType || 'db.t4g.medium';
  const capacity = appInstanceCount || 2;
  const auth = authType || 'Cognito';

  return `AWSTemplateFormatVersion: '2010-09-09'
Description: 'AWS Cloud Infrastructure for Event Resource Allocation Management System (APEX - ${env} environment)'

Parameters:
  EnvironmentName:
    Type: String
    Default: '${env}'
  AppTaskCount:
    Type: Number
    Default: ${capacity}
  DBInstanceClass:
    Type: String
    Default: '${dbSize}'
  AuthMode:
    Type: String
    Default: '${auth}'

Resources:
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: '10.0.0.0/16'
      EnableDnsSupport: true
      EnableDnsHostnames: true
      Tags:
        - Key: Name
          Value: !Sub '\${EnvironmentName}-apex-vpc'

  PublicSubnetA:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      AvailabilityZone: !Sub '\${AWS::Region}a'
      CidrBlock: '10.0.1.0/24'

  PublicSubnetB:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      AvailabilityZone: !Sub '\${AWS::Region}b'
      CidrBlock: '10.0.2.0/24'

  InternetGateway:
    Type: AWS::EC2::InternetGateway

  AttachGateway:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      VpcId: !Ref VPC
      InternetGatewayId: !Ref InternetGateway

  AppLoadBalancer:
    Type: AWS::ElasticLoadBalancingV2::LoadBalancer
    Properties:
      Name: !Sub '\${EnvironmentName}-apex-alb'
      Scheme: internet-facing
      Subnets:
        - !Ref PublicSubnetA
        - !Ref PublicSubnetB
      Type: application

  ECSCluster:
    Type: AWS::ECS::Cluster
    Properties:
      ClusterName: !Sub '\${EnvironmentName}-apex-cluster'

  ECSService:
    Type: AWS::ECS::Service
    Properties:
      Cluster: !Ref ECSCluster
      DesiredCount: ${capacity}
      LaunchType: FARGATE
      TaskDefinition: !Ref TaskDefinition
      NetworkConfiguration:
        AwsvpcConfiguration:
          AssignPublicIp: ENABLED
          Subnets:
            - !Ref PublicSubnetA
            - !Ref PublicSubnetB

  S3StaticBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub '\${EnvironmentName}-apex-frontend-\${AWS::AccountId}'
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true

  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Enabled: true
        DefaultRootObject: index.html
        Origins:
          - DomainName: !GetAtt S3StaticBucket.RegionalDomainName
            Id: S3Origin
            S3OriginConfig:
              OriginAccessIdentity: ''
        DefaultCacheBehavior:
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          AllowedMethods: [GET, HEAD, OPTIONS]

Outputs:
  CloudFrontEndpoint:
    Description: 'Global CDN URL for the APEX Web App'
    Value: !GetAtt CloudFrontDistribution.DomainName
  ALBDNSName:
    Description: 'DNS Name of the Application Load Balancer'
    Value: !GetAtt AppLoadBalancer.DNSName
`;
}

function calculateEstimatedMonthlyCost({ environment, dbInstanceType, appInstanceCount }) {
  const env = environment || 'production';
  const count = Number(appInstanceCount) || 2;
  const dbType = dbInstanceType || 'db.t4g.medium';

  // Pricing modeling (USD/month baseline)
  const dbRates = {
    'db.t4g.micro': 15,
    'db.t4g.small': 30,
    'db.t4g.medium': 60,
    'db.m6g.large': 140,
    'db.r6g.xlarge': 320
  };

  const ecsCostPerTask = 24.50; // 0.5 vCPU + 1GB RAM Fargate baseline
  const albBaseCost = 22.00;
  const s3CloudFrontCost = 8.50;
  const cognitoCost = 5.00;
  const rdsCost = dbRates[dbType] || 60;
  const ecsTotal = count * ecsCostPerTask;

  const totalMonthly = ecsTotal + albBaseCost + s3CloudFrontCost + cognitoCost + rdsCost;

  return {
    currency: 'USD',
    environment: env,
    estimatedMonthlyTotal: Math.round(totalMonthly * 100) / 100,
    breakdown: [
      { service: 'Amazon ECS Fargate', detail: `${count} Tasks (0.5 vCPU, 1GB RAM)`, monthlyCost: ecsTotal },
      { service: 'Application Load Balancer', detail: 'Single Multi-AZ ALB + LCU usage', monthlyCost: albBaseCost },
      { service: 'Amazon RDS (PostgreSQL)', detail: `Instance type: ${dbType}`, monthlyCost: rdsCost },
      { service: 'Amazon S3 + CloudFront', detail: 'Static hosting & global CDN cache', monthlyCost: s3CloudFrontCost },
      { service: 'Amazon Cognito & CloudWatch', detail: 'User Pool MFA & log ingestion', monthlyCost: cognitoCost }
    ]
  };
}

module.exports = {
  generateCloudFormationTemplate,
  calculateEstimatedMonthlyCost
};
