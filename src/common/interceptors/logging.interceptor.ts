import {
  CallHandler,
  ContextType,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import isObject from 'lodash/isObject'
import cloneDeep from 'lodash/cloneDeep'
import { catchError, tap } from 'rxjs'
import { Request } from 'express'
import { logError, logInfo, logSuccess } from '@common/logger'
import { generateNanoId } from '@common/utils'
import { Obj } from '@common/types'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private privateFields = ['password']

  intercept(context: ExecutionContext, next: CallHandler) {
    let document
    const requestId = generateNanoId()

    const action = context.getHandler().name

    // Don't log health check
    if (action === 'getHealthInfo') return next.handle()

    switch (context.getType() as ContextType) {
      case 'http': {
        const req = context.switchToHttp().getRequest<Request>()
        document = { body: req.body, query: req.query, params: req.params }
        break
      }
    }

    document = this.cleanDocument(cloneDeep(document))

    logInfo({ action, document, requestId })

    return next.handle().pipe(
      catchError(error => {
        logError({ action, document: error, requestId })
        throw error
      }),
      tap(() => {
        logSuccess({ action, requestId })
      })
    )
  }

  private cleanDocument<T>(document: T): T {
    if (!document || !isObject(document)) return document

    const cleanedDocument: Obj = cloneDeep(document)

    this.privateFields.forEach(field => {
      delete cleanedDocument[field]
    })

    Object.keys(cleanedDocument).forEach(key => {
      if (isObject(cleanedDocument[key])) {
        cleanedDocument[key] = this.cleanDocument(cleanedDocument[key])
      }
    })

    return cleanedDocument as T
  }
}
