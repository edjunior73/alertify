import { NonNullKeys, Obj } from '@common/types'

export function getKeys<
  T extends Record<string, any>,
  K extends keyof T extends never ? string[] : (keyof T)[]
>(obj: T, filter: K): Pick<T, K[number]> {
  const newObj: Partial<Pick<T, K[number]>> = {}

  filter.forEach(key => {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key]
    }
  })

  return newObj as Pick<T, K[number]>
}

export function mapByKey<T extends Obj, K extends keyof T>(arr: T[], key: K): Record<T[K], T> {
  const result: Record<K, T> = {} as Record<K, T>

  arr.forEach(item => {
    result[item[key]] = item
  })

  return result
}

export const getNonNullKeys = <T extends { [key: string]: any }>(obj: T): NonNullKeys<T> =>
  Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value != null && value !== '')
  ) as NonNullKeys<T>

export function transformToJson(ret: any) {
  if (!ret) return null

  if (ret.toJSON) return ret.toJSON()

  const newObj = {
    ...ret
  }
  delete newObj.__v
  newObj.id = newObj._id
  return newObj
}
