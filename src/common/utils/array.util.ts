import { isString } from 'lodash'
import { Obj } from '@common/types'

export function groupByKey<T extends Obj, K extends keyof T, U = T>(
  items: T[],
  key: K,
  transform?: (item: T) => U
): Record<string, U[]>
export function groupByKey<T extends Obj, K extends string, U = T>(
  items: T[],
  getKey: (item: T) => K,
  transform?: (item: T) => U
): Record<string, U[]>
export function groupByKey<T extends Obj, K extends string, U = T>(
  items: T[],
  key: (item: T) => K | string,
  transform?: (item: T) => U
): Record<string, U[]> {
  const result: Record<string, U[]> = {}
  const getKey = isString(key) ? (item: T) => item[key as unknown as keyof T] : key

  items.forEach(item => {
    const keyValue = getKey(item)

    if (Array.isArray(keyValue)) {
      const arr = keyValue as string[]
      arr.forEach(keyValueItem => {
        if (!result[keyValueItem]) {
          result[keyValueItem] = []
        }

        result[keyValueItem].push((transform ? transform(item) : item) as U)
      })
      return
    }
    if (!result[keyValue]) {
      result[keyValue] = []
    }

    result[keyValue].push((transform ? transform(item) : item) as U)
  })
  return result
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const groupKey = item[key] as unknown as string
      if (!result[groupKey]) {
        result[groupKey] = []
      }
      result[groupKey].push(item)
      return result
    },
    {} as Record<string, T[]>
  )
}

export function addToSet<T>(array: T[], value: T): T[] {
  return [...new Set([...array, value])]
}
