import { Schema } from 'mongoose'
import { ConnectionName } from '@common/enums'
import { AnyFunction } from '@common/types'

export type TypedSchema<T = any> = Schema<T> & { options: { collectionName: string } }

export interface SchemaMetadata {
  target: AnyFunction
  schema: TypedSchema
  connectionName: ConnectionName
  name: string
}

export class SchemaStorageHost {
  schemas = [] as SchemaMetadata[]

  addSchemaMetadata(metadata: SchemaMetadata) {
    this.schemas.push(metadata)
  }

  getSchemaMetadata(name: string): SchemaMetadata | undefined {
    return this.schemas.find(schema => schema.name === name)
  }
}

const globalRef = globalThis as any
export const SchemaMetadataStorage: SchemaStorageHost =
  globalRef.SchemaMetadataStorage || (globalRef.SchemaMetadataStorage = new SchemaStorageHost())
