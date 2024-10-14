import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthUser, GeneralApiResponse, RequiresAuth } from '@common/decorators'
import { TokenUser } from '@common/types'
import { TagService } from './tag.service'
import { Tag } from './tag.model'
import { FollowTagDto } from './dto'

@ApiTags('Tags')
@Controller('tags')
@RequiresAuth()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @GeneralApiResponse({ data: [Tag], summary: 'Get all tags from user' })
  getTagsFromUser(@AuthUser() user: TokenUser) {
    return this.tagService.getAllTagsByUserId(user.id)
  }

  @Post()
  @GeneralApiResponse({ data: Tag, summary: 'Follow tag' })
  followTag(@Body() input: FollowTagDto, @AuthUser() user: TokenUser) {
    return this.tagService.followTag(input.tag, user.id)
  }

  @Delete(':tagId')
  @GeneralApiResponse({ data: Tag, summary: 'Unfollow Tag' })
  unFollowTag(@Param('tagId') tagId: string, @AuthUser() user: TokenUser) {
    return this.tagService.unFollowTag(tagId, user.id)
  }
}
