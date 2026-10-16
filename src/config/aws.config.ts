export const awsConfig = () => ({
  aws: {
    region: process.env.AWS_REGION ?? 'sa-east-1',

    s3: {
      bucketName: process.env.S3_BUCKET_NAME ?? '',
    },
  },
});
