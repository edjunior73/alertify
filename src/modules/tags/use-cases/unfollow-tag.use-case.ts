import { Injectable } from '@nestjs/common'
import { UseCase } from '@common/classes'
import { ObjectNotFoundError } from '@common/errors'
import { Tag } from '../tag.model'
import { TagRepository } from '../tag.repository'

export interface UnFollowTagArgs {
  tagId: string
  userId: string
}

@Injectable()
export class UnFollowTagUseCase extends UseCase<UnFollowTagArgs, Tag> {
  constructor(private readonly tagRepository: TagRepository) {
    super()
  }

  async execute({ tagId, userId }: UnFollowTagArgs): Promise<Tag> {
    const tag = await this.tagRepository.getByIdAndUserId(tagId, userId)

    if (!tag) {
      throw new ObjectNotFoundError({
        field: 'id',
        objectType: 'Tag'
      })
    }

    return this.tagRepository.deleteOrRemove(tagId, userId)
  }
}
