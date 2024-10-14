import { applyDecorators, HttpCode, HttpStatus, Type } from '@nestjs/common'
import * as NestSwagger from '@nestjs/swagger'
import {
  ApiResponse as SwaggerApiResponse,
  ApiOkResponse,
  ApiResponseMetadata,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiProperty,
  ApiBearerAuth
} from '@nestjs/swagger'
import { pascalCase } from 'change-case'
import { GeneralResponse, ApiResponse } from '@common/models'
import { ErrorResponse } from '@common/filters'
import { getKeys } from '@common/utils'
import { PascalCase } from '@common/types'

type ResponseData = ApiResponseMetadata['type']

export const statusErrorCodes = getKeys(HttpStatus, [
  'NOT_FOUND',
  'FORBIDDEN',
  'BAD_REQUEST',
  'UNPROCESSABLE_ENTITY',
  'INTERNAL_SERVER_ERROR',
  'GONE'
])

export type StatusErrorCodes = keyof typeof statusErrorCodes

const statusErrorMap = Object.fromEntries(
  Object.entries(statusErrorCodes).map(([key, value]) => {
    const name = pascalCase(key) as PascalCase<StatusErrorCodes>
    const decorator = (params: NestSwagger.ApiResponseOptions) =>
      NestSwagger[`Api${name}Response`](params)

    return [
      key,
      {
        custom: (description?: string) =>
          decorator({ description, type: createErrorResponse(value, `${name}ErrorResponse`) }),
        default: () => decorator({ type: createErrorResponse(value, `${name}ErrorResponse`) })
      }
    ]
  })
)

type IncludeErrorResponses = Partial<Record<StatusErrorCodes, boolean | { description: string }>>

export interface GeneralApiResponseOptions {
  data?: ResponseData
  dataName?: string
  body?: ResponseData
  query?: ResponseData
  /**
   * @default true
   */
  requiresAuth?: boolean
  summary?: string
  /**
   * @default { NOT_FOUND: true, FORBIDDEN: true }
   */
  includes?: IncludeErrorResponses
  /**
   * @default HttpStatus.OK
   */
  defaultStatus?: HttpStatus
}

export function addErrorResponses(includes: IncludeErrorResponses) {
  const decorators: ReturnType<typeof SwaggerApiResponse>[] = []

  Object.entries(includes).forEach(([key, value]) => {
    if (typeof value === 'object') {
      decorators.push(statusErrorMap[key].custom(value.description))
    } else if (value) {
      decorators.push(statusErrorMap[key].default())
    }
  })

  return decorators
}

function getModelFlat<T extends Type>(Model: T): T {
  const isArray = Array.isArray(Model)
  const ModelFlat = isArray ? Model[0] : Model
  return ModelFlat
}

export function createApiResponse<T extends Type>(
  Model: T,
  dataName?: string
): Type<ApiResponse<T>> {
  const isArray = Array.isArray(Model)
  const ModelFlat = getModelFlat(Model)
  const isFromGeneralResponse = new ModelFlat() instanceof GeneralResponse
  if (isFromGeneralResponse) return Model

  class ApiResponseData extends ApiResponse<T> {
    @ApiProperty({ type: ModelFlat, isArray })
    /* v8 ignore next */
    data: T
  }

  Object.defineProperty(ApiResponseData, 'name', {
    value: dataName || `${ModelFlat.name}${isArray ? 'List' : ''}Response`
  })

  return ApiResponseData
}

export function createErrorResponse(status: number, name: string): Type<ErrorResponse> {
  class ErrorResponseData extends ErrorResponse {
    @ApiProperty({ default: status })
    statusCode: number
  }

  Object.defineProperty(ErrorResponseData, 'name', { value: name })

  return ErrorResponseData
}

export function GeneralApiResponse({
  data,
  dataName,
  body,
  requiresAuth = true,
  query,
  summary,
  includes: _includes,
  defaultStatus = HttpStatus.OK
}: GeneralApiResponseOptions = {}) {
  const includes = {
    NOT_FOUND: true,
    FORBIDDEN: true,
    ..._includes
  }

  const addReturnType: MethodDecorator = (_target, _key, descriptor) => {
    if (data) {
      // @ts-expect-error - This is to set the return type of the method
      Reflect.defineMetadata('design:returntype', getModelFlat(data as Type), descriptor.value)
    }
  }

  const decorators = [
    summary ? ApiOperation({ summary }) : null,
    ...(requiresAuth
      ? [
          ApiBearerAuth(),
          ApiUnauthorizedResponse({
            type: createErrorResponse(HttpStatus.UNAUTHORIZED, 'UnauthorizedErrorResponse')
          })
        ]
      : []),
    query ? ApiQuery({ type: query }) : null,
    ApiOkResponse({ type: data ? createApiResponse(data as Type, dataName) : GeneralResponse }),
    body ? ApiBody({ type: body }) : null,
    HttpCode(defaultStatus),
    addReturnType,
    ...addErrorResponses(includes)
  ].filter(Boolean) as MethodDecorator[]

  return applyDecorators(...decorators)
}
