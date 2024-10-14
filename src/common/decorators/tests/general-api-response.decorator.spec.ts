import * as NestSwagger from '@nestjs/swagger'
import { ApiResponseMetadata } from '@nestjs/swagger'
import { GeneralResponse } from '@common/models'
import { GeneralApiResponse } from '../general-api-response.decorator'

jest.mock<typeof import('@nestjs/swagger')>('@nestjs/swagger', () => {
  return {
    ...jest.requireActual('@nestjs/swagger'),
    ApiNotFoundResponse: jest.fn(),
    ApiForbiddenResponse: jest.fn(),
    ApiOkResponse: jest.fn(),
    ApiBadRequestResponse: jest.fn(),
    ApiQuery: jest.fn(),
    ApiProperty: jest.fn(() => jest.fn),
    ApiPropertyOptional: jest.fn(() => jest.fn),
    ApiOperation: jest.fn(),
    ApiResponseMetadata: jest.fn(),
    ApiUnauthorizedResponse: jest.fn(),
    ApiUnprocessableEntityResponse: jest.fn(),
    ApiInternalServerErrorResponse: jest.fn(),
    ApiGoneResponse: jest.fn(),
    ApiBasicAuth: jest.fn(),
    ApiBody: jest.fn()
  }
})

jest.mock<typeof import('@common/errors')>('@common/errors', () => {
  return {
    ...jest.requireActual('@common/errors'),
    UnauthenticatedError: jest.fn() as any
  }
})

describe('GeneralApiResponse', () => {
  it('should call swagger decorators if no options is passed', () => {
    const swaggerSpy = jest.spyOn(NestSwagger, 'ApiOkResponse')

    class Test {
      @GeneralApiResponse()
      test() {
        return true
      }
    }

    expect(Test).toBeDefined()
    expect(swaggerSpy).toHaveBeenCalled()
  })

  it('should call swagger decorators if body is passed', () => {
    const swaggerSpy = jest.spyOn(NestSwagger, 'ApiBody')

    class Test {
      @GeneralApiResponse({
        body: 'test',
        query: 'test',
        summary: 'test',
        includes: {
          BAD_REQUEST: true,
          UNPROCESSABLE_ENTITY: true,
          INTERNAL_SERVER_ERROR: true,
          GONE: true
        }
      })
      test() {
        return true
      }
    }

    expect(Test).toBeDefined()
    expect(swaggerSpy).toHaveBeenCalled()
  })

  it('should use description in Gone', () => {
    const goneSpy = jest.spyOn(NestSwagger, 'ApiGoneResponse')

    class Test {
      @GeneralApiResponse({
        summary: 'test',
        includes: {
          GONE: { description: 'description' }
        }
      })
      test() {
        return true
      }
    }

    expect(Test).toBeDefined()
    expect(goneSpy.mock.calls[0][0]).toHaveProperty('description', 'description')
  })

  it('should call swagger api ok response with response passed', () => {
    const swaggerSpy = jest.spyOn(NestSwagger, 'ApiOkResponse')
    const forbiddenSpy = jest.spyOn(NestSwagger, 'ApiForbiddenResponse')

    class Example {
      id: string
    }

    class Test {
      @GeneralApiResponse({
        data: Example,
        summary: 'test',
        requiresAuth: false,
        includes: { BAD_REQUEST: false, FORBIDDEN: false, NOT_FOUND: false }
      })
      test() {
        return true
      }
    }

    expect(Test).toBeDefined()
    expect((swaggerSpy.mock.calls[0][0] as ApiResponseMetadata).type).toHaveProperty(
      'name',
      'ExampleResponse'
    )
    expect(forbiddenSpy).not.toHaveBeenCalled()
  })

  it('should call swagger api ok response with response passed and use array', () => {
    const forbiddenSpy = jest.spyOn(NestSwagger, 'ApiForbiddenResponse')

    class Example {
      id: string
    }

    class Test {
      @GeneralApiResponse({
        data: [Example],
        summary: 'test',
        requiresAuth: false,
        includes: { BAD_REQUEST: false, FORBIDDEN: false, NOT_FOUND: false }
      })
      test() {
        return true
      }
    }

    expect(Test).toBeDefined()
    expect(forbiddenSpy).not.toHaveBeenCalled()
  })

  it('should not call api operation', () => {
    const swaggerSpy = jest.spyOn(NestSwagger, 'ApiOkResponse')
    const apiOperationSpy = jest.spyOn(NestSwagger, 'ApiOperation')

    class Example {
      id: string
    }

    class Test {
      @GeneralApiResponse({
        data: Example,
        requiresAuth: false,
        includes: { BAD_REQUEST: false, FORBIDDEN: false, NOT_FOUND: false }
      })
      test() {
        return true
      }
    }

    expect(Test).toBeDefined()
    expect((swaggerSpy.mock.calls[0][0] as ApiResponseMetadata).type).toHaveProperty(
      'name',
      'ExampleResponse'
    )
    expect(apiOperationSpy).not.toHaveBeenCalled()
  })

  it('should not create api response if class extended from GeneralResponse', () => {
    const swaggerSpy = jest.spyOn(NestSwagger, 'ApiOkResponse')

    class Example extends GeneralResponse {
      id: string
    }

    class Test {
      @GeneralApiResponse({
        data: Example,
        requiresAuth: false,
        includes: { BAD_REQUEST: false, FORBIDDEN: false, NOT_FOUND: false }
      })
      test() {
        return true
      }
    }

    expect(Test).toBeDefined()
    expect((swaggerSpy.mock.calls[0][0] as ApiResponseMetadata).type).toHaveProperty(
      'name',
      'Example'
    )
  })
})
