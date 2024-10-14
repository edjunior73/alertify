import { Global, Module, Provider } from '@nestjs/common'
import { FakeTwitterProvider } from '@common/mechanisms'
import { UseCasesList } from './use-cases'
import { PostService } from './post.service'
import { PostRepository } from './post.repository'
import { PostController } from './post.controller'

const exposedProviders: Provider[] = [PostRepository]

@Global()
@Module({
  providers: [...exposedProviders, PostService, FakeTwitterProvider, ...UseCasesList],
  controllers: [PostController],
  exports: [...exposedProviders]
})
export class PostModule {}
