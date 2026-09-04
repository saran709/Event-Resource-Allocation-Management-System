// AWS Cloud Architecture Configuration for Production & Staging
module.exports = {
  region: process.env.AWS_REGION || 'us-east-1',
  ec2: {
    instanceType: process.env.AWS_EC2_TYPE || 't4g.small',
    keyName: process.env.AWS_KEY_NAME || 'apex-production-keypair',
    securityGroup: process.env.AWS_SECURITY_GROUP || 'sg-apex-backend'
  },
  rds: {
    engine: 'postgres',
    engineVersion: '16.2',
    instanceClass: process.env.AWS_RDS_CLASS || 'db.t4g.medium',
    allocatedStorage: 50, // GB
    multiAZ: process.env.NODE_ENV === 'production',
    dbName: 'apex_events_db'
  },
  s3: {
    bucketName: process.env.AWS_S3_BUCKET || 'apex-event-assets-prod',
    uploadsPrefix: 'uploads/',
    reportsPrefix: 'reports/'
  },
  cloudfront: {
    distributionId: process.env.AWS_CLOUDFRONT_ID || 'E1APEXDISTRIBUTION',
    defaultTtl: 86400 // 24 hours
  },
  ses: {
    senderEmail: process.env.AWS_SES_SENDER || 'notifications@apexevents.com'
  }
};
