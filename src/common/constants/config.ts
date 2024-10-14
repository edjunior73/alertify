export const {
  PORT = 4001,
  SECRET = 'secret123',
  NODE_ENV = 'development',
  MONGO_URI = 'mongodb://localhost:27127/alertify',
  SERVER_URL = 'http://localhost:8200',
  SECRET_TOKEN = 'TOKEN_123',
  SERVICE_NAME = 'Alertify',
  ELASTIC_SEARCH_URL = 'http://localhost:9200',
  SENDGRID_SENDER_EMAIL = 'edmar.siqueira@servicefy.io',
  SENDGRID_API_KEY = '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',
  EMAIL_SERVICE = 'sendgrid',
  TWITTER_BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAAL6TwQEAAAAAlK4ja6EEMwMzXU24l3zYw7BoX8A%3DejprLrAXFCC12irBjlB19exInQ5lZhI6oldKez2fZMZS1EQ8DT',
  CLICK_HOUSE_URL = 'http://localhost:8123'
} = process.env

export const IS_PROD = NODE_ENV === 'production'

export const AUTH_HEADER = 'authorization'

export const MAX_POSTS_COUNT = 100000
