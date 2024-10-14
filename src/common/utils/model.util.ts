import { DynamicModule, Type } from '@nestjs/common'
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose'
import { isFunction } from 'lodash'
import { SchemaMetadataStorage, TypedSchema } from '@common/storages'
import { groupByKey } from './array.util'
import { getKeys } from './object.util'

export function getModelDefinitionBySchema(schema: TypedSchema, name: string): ModelDefinition {
  return {
    name,
    schema,
    collection: schema.options.collectionName
  }
}

export function getMongooseModels(exportedValues: any): DynamicModule[] {
  const registeredSchemas = groupByKey(SchemaMetadataStorage.schemas, model => model.target.name)
  const modelsName = Object.keys(registeredSchemas)
  const foundModels = (
    Object.values(exportedValues).filter(
      entity => isFunction(entity) && modelsName.includes(entity.name)
    ) as Type<any>[]
  ).map(entity => entity.name)

  const modelsMetadata = Object.values(getKeys(registeredSchemas, foundModels)).flat()

  const modelsByConnection = groupByKey(modelsMetadata, 'connectionName')

  return Object.entries(modelsByConnection).map(([connectionName, models]) => {
    return MongooseModule.forFeature(
      models.map(model => getModelDefinitionBySchema(model.schema, model.name)),
      connectionName
    )
  })
}
