import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { GeneralApiResponse, GetPagination, RequiresAuth } from '@common/decorators'
import { PaginationParams } from '@common/types'
import { createPaginatedList } from '@common/models'
import { PostService } from './post.service'
import { Post } from './post.model'
import { GetPostsDto } from './dto'

@ApiTags('Posts')
@Controller('posts')
@RequiresAuth()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @GeneralApiResponse({ data: createPaginatedList(Post), summary: 'Get filtered posts for user' })
  getPosts(@Query() input: GetPostsDto, @GetPagination() paginationParams: PaginationParams) {
    return this.postService.getPosts({ ...input, ...paginationParams })
  }
}
