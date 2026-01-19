interface Configuration {
  port: number;
  jwtSecret: string;
  jwtRefreshSecret: string;
  mongoUri: string;
  redisUri: string;
  redisPort: number;
  encryptionKey: string;
  throttleTTL: number;
  throttleLimit: number;
}

export default (): Configuration => {
  const {
    PORT,
    JWT_SECRET,
    JWT_REFRESH_SECRET,
    MONGO_URI,
    REDIS_HOST,
    REDIS_PORT,
    ENCRYPTION_KEY,
    THROTTLE_TTL,
    THROTTLE_LIMIT,
  } = process.env;
  if (
    !PORT ||
    !JWT_SECRET ||
    !JWT_REFRESH_SECRET ||
    !MONGO_URI ||
    !REDIS_HOST ||
    !REDIS_PORT ||
    !ENCRYPTION_KEY ||
    !THROTTLE_TTL ||
    !THROTTLE_LIMIT
  ) {
    throw new Error('Missing environment variables');
  }

  return {
    port: Number(PORT),
    encryptionKey: ENCRYPTION_KEY,
    jwtSecret: JWT_SECRET,
    jwtRefreshSecret: JWT_REFRESH_SECRET,
    mongoUri: MONGO_URI,
    redisUri: REDIS_HOST,
    redisPort: Number(REDIS_PORT),
    throttleTTL: Number(THROTTLE_TTL),
    throttleLimit: Number(THROTTLE_LIMIT),
  };
};
