import { Injectable } from '@nestjs/common'
import { UseCase } from '@common/classes'
import { PaginatedList } from '@common/models'
import { Post } from '../post.model'
import { GetPostsDto } from '../dto'
import { PostRepository } from '../post.repository'

@Injectable()
export class GetPostsUseCase extends UseCase<GetPostsDto, PaginatedList<Post>> {
  constructor(private readonly postRepository: PostRepository) {
    super()
  }

  execute(input: GetPostsDto): Promise<PaginatedList<Post>> {
    return this.postRepository.getMany(input)
  }
}
