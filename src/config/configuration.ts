export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  frontendUrl: process.env.FRONTEND_URL,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  kakaoId: process.env.KAKAO_CLIENT_ID,
  kakaoSecret: process.env.KAKAO_CLIENT_SECRET,
});
