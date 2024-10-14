import { Obj } from './utils.type'

export interface IUseCase<T = any, TRes = any> {
  execute(params: T): Promise<TRes>
}
