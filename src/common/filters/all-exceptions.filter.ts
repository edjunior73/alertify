import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { snakeCase } from 'lodash'
import { DomainError } from '@common/errors'

export abstract class ErrorResponse {
  status: false

  abstract statusCode: number

  message: string

  errorMessage: string

  code: string

  subCode?: string

  metadata?: any
}

const httpStatusMap = Object.fromEntries(
  Object.entries(HttpStatus).map(([key, value]) => [value, key])
)

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()

    const isHttpException = exception instanceof HttpException
    const isDomainError = exception instanceof DomainError
    const isExpectedError = isHttpException || isDomainError

    if (!isExpectedError) {
      Logger.error(exception, exception.stack, 'AllExceptionsFilter')
    }

    const httpStatus = isHttpException
      ? exception.getStatus()
      : isDomainError
        ? exception.status
        : HttpStatus.INTERNAL_SERVER_ERROR

    const responseBody: ErrorResponse = {
      statusCode: httpStatus,
      status: false,
      code: isExpectedError ? this.getExceptionCode(exception, httpStatus) : 'unknown',
      message: isExpectedError
        ? exception.message
        : 'Something unexpected happened. Please try again',
      errorMessage: exception.message as string
    }

    if (isDomainError) {
      responseBody.metadata = exception.metadata
      responseBody.subCode = exception.subCode
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
  }

  private getExceptionCode(exception: any, statusCode: HttpStatus): string {
    if (exception.code) return exception.code

    return snakeCase(httpStatusMap[statusCode])
  }
}
