import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { AllExceptionsFilter } from '@common/filters'
import { ValidationPipe } from '@common/pipes'
import { TransformInterceptor, LoggingInterceptor } from '@common/interceptors'
import { AuthMiddleware } from '@common/middlewares'
import { UserModule } from '@modules/users'
import { GlobalConfigModule } from '@modules/global-configs'
import { HealthModule } from '@modules/health'
import { TagModule } from '@modules/tags'
import { PostModule } from '@modules/posts'
import { AnomalyModule } from '@modules/anomalies'

@Module({
  imports: [
    GlobalConfigModule.register(),
    UserModule,
    HealthModule,
    TagModule,
    PostModule,
    AnomalyModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*')
  }
}
