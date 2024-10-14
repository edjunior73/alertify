import { Type } from '@nestjs/common/interfaces'
import { isFunction } from 'lodash'

/**
 * @param exportedValues pass the exports
 * @param searchStr
 * @example
 * ```ts
 * export * from './command1'
 * export * from './command2'
 *
 * export const CommandHandlers = getCqrsHandlers(exports)
 * ```
 */
export const getCqrsHandlers = (exportedValues: any, searchStr: string): Type<any>[] => {
  return Object.values(exportedValues).filter(
    handler => isFunction(handler) && new RegExp(searchStr, 'i').test(handler.name)
  ) as Type<any>[]
}
