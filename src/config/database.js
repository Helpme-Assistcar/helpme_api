require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

module.exports = isProduction
  ? {
      dialect: "postgres",
      use_env_variable: "DATABASE_URL",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: false,
    }
  : {
      dialect: "mysql",
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      dialectOptions: { decimalNumbers: true },
      logging: false,
    };
