import { Test, TestingModule } from '@nestjs/testing'
import { Logger } from '@nestjs/common'
import { PaginatedList } from '@common/models'
import { AnomalyService } from '../anomaly.service'
import { CheckAnomaliesUseCase, GetAnomaliesUseCase } from '../use-cases'
import { Anomaly } from '../anomaly.model'
import { GetAnomaliesDto } from '../dto'

describe('AnomalyService', () => {
  let anomalyService: AnomalyService

  let checkAnomaliesUseCase: CheckAnomaliesUseCase

  const mockGetAnomaliesUseCase = {
    execute: jest.fn()
  }

  const mockCheckAnomaliesUseCase = {
    setStrategy: jest.fn(),
    execute: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnomalyService,
        { provide: GetAnomaliesUseCase, useValue: mockGetAnomaliesUseCase },
        { provide: CheckAnomaliesUseCase, useValue: mockCheckAnomaliesUseCase }
      ]
    }).compile()

    anomalyService = module.get<AnomalyService>(AnomalyService)
    checkAnomaliesUseCase = module.get<CheckAnomaliesUseCase>(CheckAnomaliesUseCase)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getAnomalies', () => {
    it('should return a paginated list of anomalies', async () => {
      const input: GetAnomaliesDto = {}
      const mockResponse: PaginatedList<Anomaly> = {
        items: [],
        count: 0,
        pageInfo: {
          currentPage: 0,
          perPage: 0,
          itemCount: 0,
          pageCount: 0,
          hasNextPage: false,
          hasPreviousPage: false
        }
      }

      mockGetAnomaliesUseCase.execute.mockResolvedValue(mockResponse)

      const result = await anomalyService.getAnomalies(input)

      expect(result).toEqual(mockResponse)
      expect(mockGetAnomaliesUseCase.execute).toHaveBeenCalledWith(input)
    })
  })

  describe('checkAnomalies', () => {
    it('should check for anomalies and set the strategy', async () => {
      const logSpy = jest.spyOn(Logger, 'log').mockImplementation(() => { })

      await anomalyService.checkAnomalies()

      expect(logSpy).toHaveBeenCalledWith('Checking anomalies...')
      expect(checkAnomaliesUseCase.setStrategy).toHaveBeenCalled()
      expect(checkAnomaliesUseCase.execute).toHaveBeenCalledWith({
        timeWindow: 600000,
        comparatorNumber: 10
      })

      logSpy.mockRestore()
    })
  })
})
