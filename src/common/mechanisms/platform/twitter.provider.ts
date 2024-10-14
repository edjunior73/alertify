import { EventEmitter } from 'events'
import { Injectable, Logger } from '@nestjs/common'
import faker from 'faker'
import { generateId } from '@common/utils'
import { Tweet } from './interfaces'

@Injectable()
export class FakeTwitterProvider {
  private readonly currentHashtags: string[] = []

  private readonly tags: string[] = []

  private readonly eventEmitter = new EventEmitter()

  startSimulatedStream(): void {
    setInterval(() => {
      const fakeTweet = this.generateFakeTweet()
      this.eventEmitter.emit('tweet', fakeTweet)
    }, 100)
  }

  private generateFakeTweet(): Tweet {
    const hashtags = this.getRandomHashtag()
    const hashtagsStr = hashtags.map(tag => `#${tag}`).join(' ')

    const tweet = {
      id: generateId(),
      text: `${faker.lorem.sentence()} ${hashtagsStr}`,
      author: faker.internet.userName(),
      hashtags,
      createdAt: new Date().toISOString()
    }

    return tweet
  }

  private getRandomHashtag(): string[] {
    const hashtags = [...this.tags].sort(() => 0.5 - Math.random()).slice(0, this.pickNumber())
    return hashtags
  }

  private pickNumber() {
    return Math.floor(Math.random() * 3) + 1
  }

  onTweet(callback: (tweet: Tweet) => unknown): void {
    this.eventEmitter.on('tweet', callback)
  }

  setStreamRules(hashtags: string[]): void {
    this.tags.length = 0
    this.tags.push(...hashtags)
    Logger.log(`Stream rules set for hashtags: ${hashtags.join(', ')}`)
  }

  clearStreamRules(): void {
    this.currentHashtags.length = 0
    Logger.log('Cleared existing stream rules')
  }

  restartStream(hashtags: string[]): void {
    this.clearStreamRules()
    this.setStreamRules(hashtags)
  }
}
