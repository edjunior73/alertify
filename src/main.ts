import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { Logger } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import apm from 'elastic-apm-node'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { PORT, SERVICE_NAME, SERVER_URL, SECRET_TOKEN, IS_PROD } from '@common/constants'
import { AppModule } from './app.module'

if (SERVICE_NAME) {
  apm.start({
    serverUrl: SERVER_URL,
    serviceName: SERVICE_NAME,
    secretToken: SECRET_TOKEN,
    active: true
  })
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))

  app.useBodyParser('json', { limit: '10mb' })

  if (!IS_PROD) {
    const config = new DocumentBuilder()
      .setTitle('Alertify API Docs')
      .setDescription('API documentation for Alertify API')
      .setVersion('1.0')
      .addBearerAuth()
      .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, document)
  }

  await app.listen(PORT, () => {
    Logger.log(`Server running at: http://localhost:${PORT}`)
    Logger.log(`Swagger docs running at: http://localhost:${PORT}/docs`)
  })
}

bootstrap()
