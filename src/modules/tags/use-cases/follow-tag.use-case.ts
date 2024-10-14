import { Injectable } from '@nestjs/common'
import { UseCase } from '@common/classes'
import { Tag } from '../tag.model'
import { FollowTagDto } from '../dto'
import { TagRepository } from '../tag.repository'

export interface FollowTagArgs extends FollowTagDto {
  userId: string
}

@Injectable()
export class FollowTagUseCase extends UseCase<FollowTagArgs, Tag> {
  constructor(private readonly tagRepository: TagRepository) {
    super()
  }

  execute({ tag, userId }: FollowTagArgs): Promise<Tag> {
    return this.tagRepository.createOrUpdate(tag, userId)
  }
}
