import { getCqrsHandlers } from '@common/utils'

export * from './create-post.use-case'
export * from './get-posts.use-case'

export const UseCasesList = getCqrsHandlers(exports, 'useCase')
