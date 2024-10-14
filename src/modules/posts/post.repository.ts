import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { FilterQuery } from 'mongoose'
import { formatDate } from 'date-fns'
import { BaseRepositoryMongo } from '@common/classes'
import { PaginatedList } from '@common/models'
import { MAX_POSTS_COUNT } from '@common/constants'
import { GetPostsDto } from './dto'
import { Post } from './post.model'

export type CreatePostInput = Omit<Post, '_id' | 'createdAt' | 'updatedAt' | 'id'>

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS posts (
    id String,
    createdAt DateTime,
    updatedAt DateTime,
    content String,
    authorUsername String,
    platform String,
    externalId String,
    tags Array(String)
  ) 
  ENGINE = MergeTree()
  ORDER BY id
`

@Injectable()
export class PostRepository extends BaseRepositoryMongo<Post>(Post) implements OnModuleInit {
  async onModuleInit() {
    Logger.log('Creating table posts')

    await this.clickHouseClient
      .query({ query: createTableQuery })
      .catch(error => Logger.error('Error creating table posts', error))

    Logger.log('Table posts created')
  }

  async create(input: CreatePostInput): Promise<Post> {
    const post = await super.create(input)

    this.createInClickHouse(post).catch(error =>
      Logger.error('Error creating post in ClickHouse', error)
    )

    return post
  }

  private createInClickHouse(post: Post) {
    return this.clickHouseClient.insert({
      table: 'posts',
      values: {
        id: post.id,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        content: post.content,
        authorUsername: post.authorUsername,
        platform: post.platform,
        externalId: post.externalId,
        tags: post.tags
      },
      clickhouse_settings: {
        date_time_input_format: 'best_effort'
      },
      format: 'JSONEachRow'
    })
  }

  async getPostsByTags(tags: string[], after: Date): Promise<Post[]> {
    const tagsList = tags.map(tag => `'${tag}'`).join(', ')
    const query = `
    SELECT tags 
    FROM posts 
    WHERE hasAny(tags, [${tagsList}])
    AND createdAt > '${formatDate(after, 'yyyy-MM-dd HH:mm:ss')}'
  `

    const result = await this.clickHouseClient.query({
      query,
      clickhouse_settings: {
        date_time_input_format: 'best_effort'
      }
    })
    const { data } = await result.json()

    return data as Post[]
  }

  getMany({
    tags,
    before,
    after,
    page = 0,
    pageSize = 10
  }: GetPostsDto): Promise<PaginatedList<Post>> {
    const query: FilterQuery<Post> = {}

    if (tags && tags.length > 0) {
      query.tags = { $in: tags }
    }

    if (before) {
      query.createdAt = { ...query.createdAt, $lt: before }
    }
    if (after) {
      query.createdAt = { ...query.createdAt, $gt: after }
    }

    return this.getPaginatedByQuery(query, { page, pageSize })
  }

  async deleteOldPosts() {
    const total = await this.count()

    if (total <= MAX_POSTS_COUNT) {
      Logger.log('No posts to delete')
      return
    }

    const posts = await this.getManyByQuery(
      {},
      { _id: 1 },
      { sort: { createdAt: 1 }, limit: total - MAX_POSTS_COUNT }
    )
    const postIds = posts.map(post => post.id)

    const { deletedCount } = await this.deleteMany({ _id: { $in: postIds } })

    Logger.log(`Deleted ${deletedCount} out of ${total} posts`)
  }
}
