import { Injectable } from '@nestjs/common'
import { UseCase } from '@common/classes'
import { Post } from '../post.model'
import { PostRepository, CreatePostInput } from '../post.repository'

@Injectable()
export class CreatePostUseCase extends UseCase<CreatePostInput, Post> {
  constructor(private readonly postRepository: PostRepository) {
    super()
  }

  execute(post: CreatePostInput): Promise<Post> {
    return this.postRepository.create(post)
  }
}
