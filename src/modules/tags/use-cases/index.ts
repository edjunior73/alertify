import { getCqrsHandlers } from '@common/utils'

export * from './follow-tag.use-case'
export * from './unfollow-tag.use-case'

export const UseCasesList = getCqrsHandlers(exports, 'useCase')
