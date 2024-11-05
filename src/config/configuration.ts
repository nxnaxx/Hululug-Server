export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  frontendUrl: process.env.FRONTEND_URL,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  kakaoRestAPIKey: process.env.KAKAO_REST_API_KEY,
  kakaoRedirectUri: process.env.KAKAO_REDIRECT_URI,
  awsS3BucketName: process.env.AWS_S3_BUCKET_NAME,
  awsS3AccessKey: process.env.AWS_S3_ACCESS_KEY,
  awsS3SecretKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  awsRegion: process.env.AWS_REGION,
  awsCloudFront: process.env.AWS_CLOUDFRONT,
});
