import { Schema } from 'mongoose'
import { SchemaMetadataStorage, TypedSchema } from '@common/storages'
import { ConnectionName } from '@common/enums'

export interface SetSchemaOptions {
  schema: Schema | Schema<any, any, undefined>
  /**
   * Default will be the class name
   */
  name?: string

  /**
   * @default ConnectionName.DEFAULT
   */
  connectionName?: ConnectionName
}

export function SetSchema({
  schema,
  name,
  connectionName = ConnectionName.DEFAULT
}: SetSchemaOptions): ClassDecorator {
  return (target: any) => {
    SchemaMetadataStorage.addSchemaMetadata({
      target,
      schema: schema as TypedSchema,
      connectionName,
      name: name || target.name
    })
  }
}
