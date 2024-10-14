import { Injectable } from '@nestjs/common'
import { BaseRepositoryMongo } from '@common/classes'
import { Tag } from './tag.model'

@Injectable()
export class TagRepository extends BaseRepositoryMongo<Tag>(Tag) {
  createOrUpdate(tag: string, userId: string): Promise<Tag> {
    return this.updateByQuery(
      { tag },
      { $addToSet: { userIds: userId }, $setOnInsert: { tag } },
      { upsert: true }
    )
  }

  async deleteOrRemove(tagId: string, userId: string): Promise<Tag> {
    const tag = await this.updateByQuery({ _id: tagId }, { $pull: { userIds: userId } })

    if (tag?.userIds.length === 0) {
      return this.delete(tagId)
    }

    return tag
  }

  getByIdAndUserId(tagId: string, userId: string): Promise<Tag | null> {
    return this.getByQuery({ _id: tagId, userIds: userId })
  }

  getAll(): Promise<Tag[]> {
    return this.getManyByQuery({})
  }

  getTagsByUserId(userId: string): Promise<Tag[]> {
    return this.getManyByQuery({ userIds: userId })
  }
}
