import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { IUseCase, Obj } from '@common/types'
import { UseCaseLogger } from './use-case-logger.class'

@Injectable()
export abstract class UseCase<T = any, TRes = any> implements IUseCase<T, TRes>, OnModuleInit {
  @Inject()
  protected readonly logger: UseCaseLogger

  onModuleInit() {
    this.logger.setContext(this.constructor.name)
  }

  abstract execute(args: T): Promise<TRes>
}
