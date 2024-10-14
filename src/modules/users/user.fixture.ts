import faker from 'faker'
import { buildModelFixtureResponse } from '@common/test/test.util'
import { User } from './user.model'

export const createTestUser = (params?: Partial<User>) => {
  return buildModelFixtureResponse(
    User,
    {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    },
    params
  )
}
