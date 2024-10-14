import { SchemaOptions, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ConnectionName } from '@common/enums'
import { transformToJson } from '@common/utils'
import { SetSchema } from './set-schema.decorator'

export interface CustomSchemaOptions extends SchemaOptions {
  /**
   * @default ConnectionName.DEFAULT
   */
  connectionName?: ConnectionName
  /**
   * Default is the class name
   */
  modelName?: string
  skipSavingSchema?: boolean
}

export function CustomSchema({
  connectionName = ConnectionName.DEFAULT,
  modelName,
  skipSavingSchema,
  ...options
}: CustomSchemaOptions = {}) {
  return (target: any) => {
    Schema({
      timestamps: true,
      id: true,
      _id: false,
      ...options,
      toJSON: {
        ...options.toJSON,
        transform: (doc, ret, tOptions) => {
          const newRet = transformToJson(ret)
          return typeof options.toJSON?.transform === 'function'
            ? options.toJSON.transform(doc, newRet, tOptions)
            : newRet
        }
      }
    })(target)

    const name = modelName || target.name
    const schema = SchemaFactory.createForClass(target)

    if (!skipSavingSchema) SetSchema({ connectionName, schema, name })(target)
  }
}
