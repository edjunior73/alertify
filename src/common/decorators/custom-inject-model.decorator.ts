import { Type } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { SchemaMetadataStorage } from '@common/storages'

export function CustomInjectModel<T>(model: Type<T>) {
  const { name } = model

  const metadata = SchemaMetadataStorage.getSchemaMetadata(name)

  if (!metadata) {
    throw new Error(`Model ${name} not found`)
  }

  return InjectModel(name, metadata.connectionName)
}
