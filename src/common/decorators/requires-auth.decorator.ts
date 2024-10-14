import { applyDecorators, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@common/guards'

export function RequiresAuth() {
  return applyDecorators(UseGuards(AuthGuard))
}
