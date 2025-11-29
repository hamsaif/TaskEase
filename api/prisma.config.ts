// prisma.config.ts
const config = {
  // Other configuration options...
  datasource: {
    db: {
      provider: "postgresql",
      url: process.env.DATABASE_URL,
    },
  },
};

export default config;