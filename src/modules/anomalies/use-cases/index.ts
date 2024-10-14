import { getCqrsHandlers } from '@common/utils'

export * from './get-anomalies.use-case'
export * from './check-anomalies.use-case'

export const UseCasesList = getCqrsHandlers(exports, 'useCase')
