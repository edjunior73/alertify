import { Injectable, OnModuleInit, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { FakeTwitterProvider } from '@common/mechanisms'
import { Tweet } from '@common/mechanisms/platform/interfaces'
import { Platform } from '@common/enums'
import { PaginatedList } from '@common/models'
import { TagService } from '@modules/tags/tag.service'
import { CreatePostUseCase, GetPostsUseCase } from './use-cases'
import { CreatePostInput, PostRepository } from './post.repository'
import { GetPostsDto } from './dto'
import { Post } from './post.model'

@Injectable()
export class PostService implements OnModuleInit {
  constructor(
    private readonly fakeTwitterProvider: FakeTwitterProvider,
    private readonly tagService: TagService,
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly getPostsUseCase: GetPostsUseCase,
    private readonly postRepository: PostRepository
  ) { }

  async onModuleInit() {
    const foundTags = await this.tagService.getAllTags()
    const tags = foundTags.map(({ tag }) => tag)

    this.startTwitterStream(tags)
  }

  startTwitterStream(tags: string[]) {
    Logger.log(`Starting Twitter stream for hashtags: ${tags.join(', ')}`)
    this.fakeTwitterProvider.onTweet(this.handleTweet.bind(this))
    try {
      this.fakeTwitterProvider.setStreamRules(tags)
      this.fakeTwitterProvider.startSimulatedStream()
    } catch (error) {
      Logger.error('Error starting Twitter stream:', error)
    }
  }

  async handleTweet(tweet: Tweet) {
    const post = this.mapTweetToPost(tweet)
    await this.createPostUseCase.execute(post)
    // Logger.log(`New tweet received: ${tweet.text}`)
  }

  private mapTweetToPost(tweet: Tweet): CreatePostInput {
    return {
      content: tweet.text,
      authorUsername: tweet.author,
      platform: Platform.TWITTER,
      externalId: tweet.id,
      tags: tweet.hashtags
    }
  }

  getPosts(input: GetPostsDto): Promise<PaginatedList<Post>> {
    return this.getPostsUseCase.execute(input)
  }

  @Cron('*/30 * * * *')
  async handleArchivePosts() {
    await this.postRepository.deleteOldPosts()
  }
}
