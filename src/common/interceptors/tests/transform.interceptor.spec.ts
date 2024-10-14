/* eslint-disable jest/no-done-callback */
import { ExecutionContext, CallHandler } from '@nestjs/common'
import { of } from 'rxjs'
import { plainToInstance } from 'class-transformer'
import { TransformInterceptor } from '../transform.interceptor'

jest.mock('class-transformer', () => ({
  plainToInstance: jest.fn()
}))

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<any>
  let context: ExecutionContext
  let next: CallHandler

  beforeEach(() => {
    interceptor = new TransformInterceptor()
    context = {
      getHandler: jest.fn()
    } as unknown as ExecutionContext

    next = {
      handle: jest.fn()
    } as unknown as CallHandler
  })

  it('should transform single objects if ReturnModel is present', done => {
    const returnModel = class TestModel { }
    jest.spyOn(Reflect, 'getMetadata').mockReturnValue(returnModel)
    const mockData = { key: 'value' }
    const transformedData = { key: 'transformedValue' }

      ; (plainToInstance as jest.Mock).mockReturnValue(transformedData)
      ; (next.handle as jest.Mock).mockReturnValue(of(mockData))

    interceptor.intercept(context, next).subscribe((result: any) => {
      expect(plainToInstance).toHaveBeenCalledWith(returnModel, mockData)
      expect(result).toEqual({ data: transformedData })

      done()
    })
  })

  it('should transform arrays if ReturnModel is present', done => {
    const returnModel = class TestModel { }
    jest.spyOn(Reflect, 'getMetadata').mockReturnValue(returnModel)
    const mockArray = [{ key: 'value1' }, { key: 'value2' }]
    const transformedArray = [{ key: 'transformedValue1' }, { key: 'transformedValue2' }]

      ; (plainToInstance as jest.Mock).mockImplementation((model, item) => {
        return { key: `transformedValue${item.key.slice(-1)}` }
      })
      ; (next.handle as jest.Mock).mockReturnValue(of(mockArray))

    interceptor.intercept(context, next).subscribe((result: any) => {
      expect(plainToInstance).toHaveBeenCalledTimes(2)
      expect(result).toEqual({ data: transformedArray })

      done()
    })
  })

  it('should return original data if ReturnModel is not present', done => {
    jest.spyOn(Reflect, 'getMetadata').mockReturnValue(null)
    const mockData = { key: 'value' }

      ; (next.handle as jest.Mock).mockReturnValue(of(mockData))

    interceptor.intercept(context, next).subscribe((result: any) => {
      expect(plainToInstance).not.toHaveBeenCalled()
      expect(result).toEqual(mockData)

      done()
    })
  })
})
