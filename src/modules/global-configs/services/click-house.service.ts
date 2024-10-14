import { Logger, OnModuleInit } from '@nestjs/common'
import { createClient } from '@clickhouse/client'
import { CLICK_HOUSE_URL } from '@common/constants'
import type { Post } from '@modules/posts/post.model'

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

export class ClickHouseService implements OnModuleInit {
  protected client = createClient({ url: CLICK_HOUSE_URL })

  async onModuleInit() {
    Logger.log('Creating table posts')

    await this.client
      .query({ query: createTableQuery })
      .catch(error => Logger.error('Error creating table posts', error))

    Logger.log('Table posts created')
  }

  createPost(post: Post) {
    return this.client.insert({
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
}
