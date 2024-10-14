import { Type } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { MakeOptionalWithPrefix } from '@common/types'
import { generateId } from '@common/utils'

export const buildModelFixtureResponse = <T extends { _id?: string; id?: string }>(
  model: Type<T>,
  defaultInput: MakeOptionalWithPrefix<T, 'id' | 'createdAt' | 'updatedAt'>,
  params?: Partial<T>
): T => {
  const id = params?._id || params?.id || generateId()
  const date = new Date()

  const instance = plainToInstance(
    model,
    {
      id,
      _id: id,
      createdAt: date,
      updatedAt: date,
      _createdAt: date,
      _updatedAt: date,
      ...defaultInput,
      ...params
    },
    { excludeExtraneousValues: true }
  ) as T & { id?: string; _id?: string }

  if (instance._id) {
    instance.id = instance._id
  }

  return instance
}
