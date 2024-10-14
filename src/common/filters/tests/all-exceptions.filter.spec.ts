import { Test } from '@nestjs/testing'
import { ArgumentsHost, Logger, UnauthorizedException } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { createMock } from '@golevelup/nestjs-testing'
import { ForbiddenError } from '@common/errors'
import { AllExceptionsFilter, ErrorResponse } from '../all-exceptions.filter'

describe('AllExceptionsFilter', () => {
  let allExceptionsFilter: AllExceptionsFilter
  let httpReply: jest.Mock<HttpAdapterHost['httpAdapter']['reply']>

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AllExceptionsFilter,
        {
          provide: HttpAdapterHost,
          useValue: createMock<HttpAdapterHost>({
            httpAdapter: createMock<HttpAdapterHost['httpAdapter']>({
              reply: jest.fn()
            })
          })
        }
      ]
    }).compile()

    allExceptionsFilter = await module.get(AllExceptionsFilter)
    const httpAdapterHost = module.get(HttpAdapterHost)

    httpReply = httpAdapterHost.httpAdapter.reply as any
  })

  it('should be defined', () => {
    expect(allExceptionsFilter).toBeDefined()
    expect(httpReply).toBeDefined()
  })

  describe('catch', () => {
    it('should catch domain error', () => {
      const host = createMock<ArgumentsHost>({
        switchToHttp: () => ({
          getResponse: () => ({})
        })
      })
      const error = new ForbiddenError('some_code')
      allExceptionsFilter.catch(error, host)

      expect(httpReply.mock.calls[0][1]).toMatchObject({
        statusCode: 403,
        subCode: 'some_code',
        code: 'forbidden'
      } as Partial<ErrorResponse>)
    })

    it('should catch http exception', () => {
      const host = createMock<ArgumentsHost>({
        switchToHttp: () => ({
          getResponse: () => ({})
        })
      })
      const error = new UnauthorizedException('some message')
      allExceptionsFilter.catch(error, host)

      expect(httpReply.mock.calls[0][1]).toMatchObject({
        statusCode: 401,
        message: 'some message',
        code: 'unauthorized'
      } as Partial<ErrorResponse>)
    })

    it('should catch unknown error', () => {
      const host = createMock<ArgumentsHost>({
        switchToHttp: () => ({
          getResponse: () => ({})
        })
      })
      jest.spyOn(Logger, 'error').mockImplementationOnce(() => {})
      const error = new Error('some error')
      allExceptionsFilter.catch(error, host)

      expect(Logger.error).toHaveBeenCalledWith(error, error.stack, 'AllExceptionsFilter')
      expect(httpReply.mock.calls[0][1]).toMatchObject({
        statusCode: 500,
        message: 'Something unexpected happened. Please try again',
        errorMessage: 'some error',
        code: 'unknown'
      } as Partial<ErrorResponse>)
    })
  })
})
