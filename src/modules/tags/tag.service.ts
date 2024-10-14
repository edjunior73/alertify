import { Injectable } from '@nestjs/common'
import { FollowTagUseCase, UnFollowTagUseCase } from './use-cases'
import { TagRepository } from './tag.repository'

@Injectable()
export class TagService {
  constructor(
    private readonly followTagUseCase: FollowTagUseCase,
    private readonly unFollowTagUseCase: UnFollowTagUseCase,
    private readonly tagRepository: TagRepository
  ) {}

  getAllTags() {
    return this.tagRepository.getAll()
  }

  getAllTagsByUserId(userId: string) {
    return this.tagRepository.getTagsByUserId(userId)
  }

  followTag(tag: string, userId: string) {
    return this.followTagUseCase.execute({ tag, userId })
  }

  unFollowTag(tagId: string, userId: string) {
    return this.unFollowTagUseCase.execute({ tagId, userId })
  }
}
