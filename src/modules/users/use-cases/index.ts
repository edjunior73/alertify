import { getCqrsHandlers } from '@common/utils'

export * from './sign-up.use-case'
export * from './login.use-case'

export const UseCasesList = getCqrsHandlers(exports, 'useCase')
