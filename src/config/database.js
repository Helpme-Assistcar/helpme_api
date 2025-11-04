require("dotenv").config();

module.exports = {
  dialect: "mysql",
  // dialect: "postgres",
  dialectOptions: {
    decimalNumbers: true,
  },
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  pool: {
    max: 20,
    min: 0,
    idle: 300000,
    acquire: 60000,
  },
  logging: false,
};
