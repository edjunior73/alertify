export const {
  PORT = 4001,
  SECRET = 'secret123',
  NODE_ENV = 'development',
  MONGO_URI = 'mongodb://localhost:27127/alertify',
  SERVER_URL = 'http://localhost:8200',
  SECRET_TOKEN = 'TOKEN_123',
  SERVICE_NAME = 'Alertify',
  ELASTIC_SEARCH_URL = 'http://localhost:9200',
  SENDGRID_SENDER_EMAIL,
  SENDGRID_API_KEY, 
  EMAIL_SERVICE ,
  TWITTER_BEARER_TOKEN ,
  CLICK_HOUSE_URL,
} = process.env

export const IS_PROD = NODE_ENV === 'production'

export const AUTH_HEADER = 'authorization'

export const MAX_POSTS_COUNT = 100000
