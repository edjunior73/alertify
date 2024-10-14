import { ExecutionContext } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Reflector } from '@nestjs/core'
import { createMock } from '@golevelup/nestjs-testing'
import faker from 'faker'
import { InvalidTokenError, UnauthenticatedError, ForbiddenError } from '@common/errors'
import { JUser, Role } from '@common/types'
import { UserService } from '@modules/users/user.service'
import { AuthGuard } from '../auth.guard'

const TEST_ROLE = 'TEST_ROLE'

describe('AuthGuard', () => {
  let guard: AuthGuard
  let userService: UserService
  let reflector: Reflector

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: UserService,
          useValue: {
            existsUserById: jest.fn()
          }
        }
      ]
    }).compile()

    guard = module.get<AuthGuard>(AuthGuard)
    userService = module.get<UserService>(UserService)
    reflector = module.get<Reflector>(Reflector)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(guard).toBeDefined()
    expect(reflector).toBeDefined()
  })

  it('should throw an error if token is invalid', async () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          tokenStatus: 'invalid',
          user: null
        })
      })
    })

    await expect(guard.canActivate(context)).rejects.toThrow(InvalidTokenError)
  })

  it('should throw an error if user is not found', async () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          user: null
        })
      })
    })

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthenticatedError)
  })

  it('should throw an error if token is missing', async () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          user: null,
          tokenStatus: 'missing'
        })
      })
    })

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthenticatedError)
  })

  it('should throw an error if user does not exist', async () => {
    const user = { id: faker.datatype.uuid() }
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          user,
          tokenStatus: 'valid'
        })
      })
    })

    jest.spyOn(userService, 'existsUserById').mockResolvedValue(false)

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthenticatedError)
  })

  it('should return true if user exists', async () => {
    const user = { id: faker.datatype.uuid() }
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          user,
          tokenStatus: 'valid'
        })
      })
    })

    jest.spyOn(userService, 'existsUserById').mockResolvedValue(true)

    await expect(guard.canActivate(context)).resolves.toBe(true)
  })

  it('should return true with auth if no role was defined', async () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          user: {
            email: faker.internet.email(),
            role: TEST_ROLE
          } as unknown as JUser
        })
      })
    })

    await expect(guard.canActivate(context)).resolves.toBe(true)
  })

  it('should return true with auth specifying the role', async () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          user: {
            email: faker.internet.email(),
            role: Role.USER
          } as JUser
        })
      })
    })

    jest.spyOn(reflector, 'get').mockReturnValue([Role.USER])

    await expect(guard.canActivate(context)).resolves.toBe(true)
  })
})
