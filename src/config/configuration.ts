export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  frontendUrl: process.env.FRONTEND_URL,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  kakaoRestAPIKey: process.env.KAKAO_REST_API_KEY,
  kakaoRedirectUri: process.env.KAKAO_REDIRECT_URI,
});
