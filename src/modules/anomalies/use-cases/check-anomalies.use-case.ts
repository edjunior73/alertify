import { Injectable, Logger } from '@nestjs/common'
import { UseCase } from '@common/classes'
import { groupByKey } from '@common/utils'
import { AnomalyRange } from '@common/enums'
import { TagRepository } from '@modules/tags/tag.repository'
import { PostRepository } from '@modules/posts/post.repository'
import { UserRepository } from '@modules/users/user.repository'
import { EmailAdapter } from '@modules/global-configs'
import { AnomalyRepository } from '../anomaly.repository'
import { Anomaly } from '../anomaly.model'
import {
  AnomalyDetectionContext,
  DynamicRangeStrategy,
  PercentageIncreaseStrategy,
  ThresholdStrategy,
  SpikeStrategy
} from '../strategies'
import { AnomalyDetectionStrategy } from '../interfaces'

@Injectable()
export class CheckAnomaliesUseCase extends UseCase<
  { timeWindow: number; comparatorNumber: number },
  void
> {
  constructor(
    private readonly anomalyRepository: AnomalyRepository,
    private readonly tagRepository: TagRepository,
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly detectionContext: AnomalyDetectionContext,
    private readonly emailAdapter: EmailAdapter
  ) {
    super()
    this.setStrategy()
  }

  setStrategy(strategyName = AnomalyRange.THRESHOLD) {
    const strategyMap: Record<string, AnomalyDetectionStrategy> = {
      dynamic_range: new DynamicRangeStrategy(20),
      threshold: new ThresholdStrategy(),
      percentage_increase: new PercentageIncreaseStrategy(50),
      spike: new SpikeStrategy(1000)
    }

    this.detectionContext.setStrategy(strategyMap[strategyName] ?? strategyMap.threshold)
  }

  async execute({ timeWindow, comparatorNumber }: { timeWindow: number; comparatorNumber: number }) {
    const after = new Date(Date.now() - timeWindow)
    const tagsByUserId: Record<string, string[]> = {}
    const tags = await this.tagRepository.getAll()

    const allTags = tags.map(tag => tag.tag)

    const posts = await this.postRepository.getPostsByTags(allTags, after)

    Logger.log(`Checking ${posts.length} posts for anomalies...`)

    const groupedPosts = groupByKey(posts, 'tags')
    const anomalies: Omit<Anomaly, '_id' | 'createdAt' | 'updatedAt' | 'id'>[] = []
    tags.forEach(tagItem => {
      const tagPosts = groupedPosts[tagItem.tag]
      if (!this.detectionContext.detectAnomaly(tagPosts.length, comparatorNumber)) {
        return
      }

      anomalies.push({
        anomalyRule: { comparatorNumber, timeWindow },
        ocurredAt: new Date(),
        tag: tagItem.tag
      })

      tagItem.userIds.forEach(userId => {
        const userTags = tagsByUserId[userId] || []
        userTags.push(tagItem.tag)
        tagsByUserId[userId] = userTags
      })
    })

    if (anomalies.length > 0) {
      await this.anomalyRepository.createMany(anomalies)

      const userIds = Object.keys(tagsByUserId)
      const foundTagUsers = await this.userRepository.getByIds(userIds)
      await Promise.all(
        foundTagUsers.map(async user => {
          const userTags = tagsByUserId[user.id]

          Logger.log(
            `An anomaly has been detected for tag: ${userTags?.join(',')} for user ${user.email}`
          )
          await this.emailAdapter.sendEmail({
            to: user.email,
            subject: `Alertify - An anomaly has been detected for your hashtags`,
            body: `An anomaly has been detected for the following hashtags: ${userTags?.join(', ')}`
          })
        })
      )
    }
  }
}
