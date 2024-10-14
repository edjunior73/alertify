import { Test } from '@nestjs/testing'
import { createMock } from '@golevelup/nestjs-testing'
import { Response } from 'express'
import { Request } from '@common/types'
import { AUTH_HEADER } from '@common/constants'
import { jwtModule } from '@modules/global-configs'
import { AuthService } from '@modules/users/services'
import { createTestUser } from '@modules/users/fixtures'
import { AuthMiddleware } from '../auth.middleware'

describe('AuthMiddleware', () => {
  let authMiddleware: AuthMiddleware
  let authService: AuthService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [jwtModule],
      providers: [AuthMiddleware, AuthService]
    }).compile()

    authMiddleware = await module.get(AuthMiddleware)
    authService = await module.get(AuthService)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(authMiddleware).toBeDefined()
    expect(authService).toBeDefined()
  })

  describe('use', () => {
    it('should define user and tokenStatus in request', () => {
      const user = createTestUser()
      const token = authService.generateUserToken(user)

      const req = createMock<Request>({
        headers: {
          [AUTH_HEADER]: `Bearer ${token}`
        }
      })
      const res = createMock<Response>()
      const next = jest.fn()

      authMiddleware.use(req, res, next)

      expect(req.tokenStatus).toBeDefined()
      expect(req.user).toBeDefined()
      expect(next).toHaveBeenCalled()
    })
  })
})
