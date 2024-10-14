import { Test } from '@nestjs/testing'
import { Injectable } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MONGO_URI } from '@common/constants'
import { MongooseModels, User } from '@modules/users/models'
import { CustomInjectModel } from '../custom-inject-model.decorator'

describe('CustomInjectModel', () => {
  it('should inject model', async () => {
    @Injectable()
    class UseExistentModel {
      constructor(@CustomInjectModel(User) public readonly model: Model<User>) {}
    }

    const module = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(MONGO_URI), ...MongooseModels],
      providers: [UseExistentModel]
    }).compile()

    const useModel = module.get(UseExistentModel)

    expect(useModel.model).toBeDefined()

    await module.close()
  })
})
