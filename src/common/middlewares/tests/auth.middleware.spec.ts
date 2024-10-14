/* eslint-disable jest/no-conditional-in-test */
import { Response, Request } from 'express'
import { AnyFunction, TokenStatus } from '@common/types'
import { AuthService } from '@modules/users/services'
import { AuthMiddleware } from '../auth.middleware'

const AUTH_HEADER = 'authorization'

interface CustomRequest extends Request {
  tokenStatus: TokenStatus
  user?: any
}

describe('AuthMiddleware', () => {
  let authMiddleware: AuthMiddleware
  let authService: AuthService
  let mockRequest: Partial<CustomRequest>
  let mockResponse: Partial<Response>
  let nextFunction: AnyFunction

  beforeEach(() => {
    authService = {
      getTokenFromHeader: jest.fn()
    } as unknown as AuthService

    authMiddleware = new AuthMiddleware(authService)
    mockRequest = {
      headers: {}
    } as Partial<CustomRequest>

    mockResponse = {} as Partial<Response>
    nextFunction = jest.fn()
  })

  it('should call next() when there is no auth header', () => {
    authMiddleware.use(mockRequest as CustomRequest, mockResponse as Response, nextFunction)

    expect(authService.getTokenFromHeader).not.toHaveBeenCalled()
    expect(nextFunction).toHaveBeenCalled()
  })

  it('should extract token and user from the auth header if present', () => {
    const tokenStatus = 'valid'
    const user = { id: 1, name: 'John Doe' }
      ; (authService.getTokenFromHeader as jest.Mock).mockReturnValue({ tokenStatus, user })

    if (mockRequest.headers) mockRequest.headers[AUTH_HEADER] = 'Bearer some-token'

    authMiddleware.use(mockRequest as CustomRequest, mockResponse as Response, nextFunction)

    expect(authService.getTokenFromHeader).toHaveBeenCalledWith('Bearer some-token')
    expect(mockRequest.tokenStatus).toBe(tokenStatus)
    expect(mockRequest.user).toBe(user)
    expect(nextFunction).toHaveBeenCalled()
  })

  it('should handle invalid token without breaking the request flow', () => {
    ; (authService.getTokenFromHeader as jest.Mock).mockReturnValue({
      tokenStatus: 'invalid',
      user: null
    })

    if (mockRequest.headers) mockRequest.headers[AUTH_HEADER] = 'Bearer invalid-token'

    authMiddleware.use(mockRequest as CustomRequest, mockResponse as Response, nextFunction)

    expect(authService.getTokenFromHeader).toHaveBeenCalledWith('Bearer invalid-token')
    expect(mockRequest.tokenStatus).toBe('invalid')
    expect(mockRequest.user).toBeNull()
    expect(nextFunction).toHaveBeenCalled()
  })
})
