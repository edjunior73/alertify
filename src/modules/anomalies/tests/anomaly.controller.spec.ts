import { Test, TestingModule } from '@nestjs/testing'
import { AuthGuard } from '@common/guards'
import { AnomalyController } from '../anomaly.controller'
import { AnomalyService } from '../anomaly.service'
import { GetAnomaliesDto } from '../dto'
import { Anomaly } from '../anomaly.model'

describe('AnomalyController', () => {
  let controller: AnomalyController
  let anomalyService: AnomalyService

  const mockAnomaliesService = {
    getAnomalies: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnomalyController],
      providers: [
        {
          provide: AnomalyService,
          useValue: mockAnomaliesService
        }
      ]
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn(() => true)
      })
      .compile()

    controller = module.get<AnomalyController>(AnomalyController)
    anomalyService = module.get<AnomalyService>(AnomalyService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
    expect(anomalyService).toBeDefined()
  })

  it('should return a paginated list of anomalies', async () => {
    const mockAnomalies: Anomaly[] = [
      {
        anomalyRule: { comparatorNumber: 1, timeWindow: 60 },
        tag: 'test-tag',
        ocurredAt: new Date()
      } as Anomaly,
      {
        anomalyRule: { comparatorNumber: 2, timeWindow: 120 },
        tag: 'another-tag',
        ocurredAt: new Date()
      } as Anomaly
    ]

    const dto: GetAnomaliesDto = { page: 1, pageSize: 10 }

    mockAnomaliesService.getAnomalies.mockResolvedValue(mockAnomalies)

    const result = await controller.getAnomalies(dto)

    expect(result).toEqual(mockAnomalies)
    expect(anomalyService.getAnomalies).toHaveBeenCalledWith(dto)
  })

  it('should call getAnomalies with correct parameters', async () => {
    const dto: GetAnomaliesDto = {
      page: 1,
      pageSize: 10,
      before: new Date('2024-10-01'),
      after: new Date('2024-09-01')
    }

    await controller.getAnomalies(dto)

    expect(anomalyService.getAnomalies).toHaveBeenCalledWith(dto)
  })
})
