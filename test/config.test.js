require('dotenv').config();

module.exports = {
  LOG_LEVEL: process.env.LOG_LEVEL,
  API_KEY: process.env.API_KEY,
  SECRECT: process.env.SECRET_KEY,
  BASE_URL: process.env.BASE_URL,
  AUTH_URL: process.env.AUTH_URL,
};