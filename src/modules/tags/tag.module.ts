import { Global, Module, Provider } from '@nestjs/common'
import { UseCasesList } from './use-cases'
import { TagService } from './tag.service'
import { TagRepository } from './tag.repository'
import { TagController } from './tag.controller'

const exposedProviders: Provider[] = [TagService, TagRepository]

@Global()
@Module({
  providers: [...exposedProviders, ...UseCasesList],
  controllers: [TagController],
  exports: [...exposedProviders]
})
export class TagModule {}
