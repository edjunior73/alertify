import { Test, TestingModule } from '@nestjs/testing'
import { AnomalyRange } from '@common/enums'
import { UseCaseLogger } from '@common/classes'
import { TagRepository } from '@modules/tags/tag.repository'
import { PostRepository } from '@modules/posts/post.repository'
import { UserRepository } from '@modules/users/user.repository'
import { EmailAdapter } from '@modules/global-configs'
import {
  AnomalyDetectionContext,
  DynamicRangeStrategy,
  ThresholdStrategy
} from '@modules/anomalies/strategies'
import { AnomalyRepository } from '@modules/anomalies/anomaly.repository'

import { CheckAnomaliesUseCase } from '../check-anomalies.use-case'

describe('CheckAnomaliesUseCase', () => {
  let useCase: CheckAnomaliesUseCase
  let detectionContext: AnomalyDetectionContext

  const mockAnomalyRepository = {
    createMany: jest.fn()
  }

  const mockTagRepository = {
    getAll: jest.fn()
  }

  const mockPostRepository = {
    getPostsByTags: jest.fn()
  }

  const mockUserRepository = {
    getByIds: jest.fn()
  }

  const mockEmailAdapter = {
    sendEmail: jest.fn()
  }

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckAnomaliesUseCase,
        { provide: AnomalyRepository, useValue: mockAnomalyRepository },
        { provide: TagRepository, useValue: mockTagRepository },
        { provide: PostRepository, useValue: mockPostRepository },
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: EmailAdapter, useValue: mockEmailAdapter },
        { provide: UseCaseLogger, useValue: mockLogger },
        AnomalyDetectionContext
      ]
    }).compile()

    useCase = module.get<CheckAnomaliesUseCase>(CheckAnomaliesUseCase)
    detectionContext = module.get<AnomalyDetectionContext>(AnomalyDetectionContext)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('setStrategy', () => {
    it('should set the strategy correctly', () => {
      useCase.setStrategy(AnomalyRange.DYNAMIC_RANGE)

      expect(detectionContext.strategy).toBeInstanceOf(DynamicRangeStrategy)

      useCase.setStrategy()

      expect(detectionContext.strategy).toBeInstanceOf(ThresholdStrategy)
    })
  })

  describe('execute', () => {
    it('should create anomalies and send emails when anomalies are detected', async () => {
      const timeWindow = 60000
      const comparatorNumber = 1

      const mockTags = [{ tag: 'test', userIds: ['user1'] }]
      const mockPosts = [{ tags: ['test'] }, { tags: ['test'] }]
      const mockUsers = [{ id: 'user1', email: 'user1@example.com', tags: ['test'] }]

      mockTagRepository.getAll.mockResolvedValue(mockTags)
      mockPostRepository.getPostsByTags.mockResolvedValue(mockPosts)
      mockUserRepository.getByIds.mockResolvedValue(mockUsers)

      await useCase.execute({ timeWindow, comparatorNumber })

      expect(mockAnomalyRepository.createMany).toHaveBeenCalled()
      expect(mockEmailAdapter.sendEmail).toHaveBeenCalledWith({
        to: 'user1@example.com',
        subject: 'Alertify - An anomaly has been detected for your hashtags',
        body: 'An anomaly has been detected for the following hashtags: test'
      })
    })

    it('should not create anomalies if no anomalies are detected', async () => {
      const timeWindow = 60000
      const comparatorNumber = 10

      const mockTags = [{ tag: 'test', userIds: ['user1'] }]
      const mockPosts = [{ tags: ['test'] }]
      const mockUsers = [{ id: 'user1', email: 'user1@example.com', tags: [] }]

      mockTagRepository.getAll.mockResolvedValue(mockTags)
      mockPostRepository.getPostsByTags.mockResolvedValue(mockPosts)
      mockUserRepository.getByIds.mockResolvedValue(mockUsers)

      await useCase.execute({ timeWindow, comparatorNumber })

      expect(mockAnomalyRepository.createMany).not.toHaveBeenCalled()
      expect(mockEmailAdapter.sendEmail).not.toHaveBeenCalled()
    })
  })
})
