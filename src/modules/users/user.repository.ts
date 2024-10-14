import { Injectable } from '@nestjs/common'
import { BaseRepositoryMongo } from '@common/classes'
import { User } from './user.model'

@Injectable()
export class UserRepository extends BaseRepositoryMongo<User>(User) {
  getByEmail(email: string): Promise<User | null> {
    return this.getByQuery({ email })
  }

  existsByEmail(email: string): Promise<boolean> {
    return this.exists({ email })
  }
}
