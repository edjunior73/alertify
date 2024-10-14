import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { PaginationParams as Pagination } from '@common/types'

export const GetPagination = createParamDecorator((data, ctx: ExecutionContext): Pagination => {
  const req: Request = ctx.switchToHttp().getRequest()

  const paginationParams: Pagination = {
    page: 1,
    pageSize: 10
  }

  paginationParams.page = req.query.page ? Number.parseInt(req.query.page.toString()) : 1
  paginationParams.pageSize = req.query.pageSize
    ? Number.parseInt(req.query.pageSize.toString())
    : 10

  return paginationParams
})
