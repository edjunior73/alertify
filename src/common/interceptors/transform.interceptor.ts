import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface Response<T> {
  data: T
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ReturnModel = Reflect.getMetadata('design:returntype', context.getHandler())

    return next.handle().pipe(
      map(data =>
        ReturnModel
          ? {
              data: Array.isArray(data)
                ? data.map(item => plainToInstance(ReturnModel, item))
                : plainToInstance(ReturnModel, data)
            }
          : data
      )
    )
  }
}
