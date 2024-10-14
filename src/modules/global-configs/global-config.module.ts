import { Global, Module, Provider, ModuleMetadata, DynamicModule } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtModule } from '@nestjs/jwt'
import { ScheduleModule } from '@nestjs/schedule'
import { WinstonModule } from 'nest-winston'
import { MONGO_URI, SECRET, SERVICE_NAME } from '@common/constants'
import { SchemaMetadataStorage } from '@common/storages'
import { getModelDefinitionBySchema, groupByKey } from '@common/utils'
import { WINSTON_CONFIG } from '@common/logger'
import { ConnectionName } from '@common/enums'
import { UseCaseLogger } from '@common/classes'
import * as Services from './services'

type ModuleType = NonNullable<ModuleMetadata['imports']>

const exposedModules: ModuleType = [
  JwtModule.register({
    secret: SECRET,
    signOptions: {
      expiresIn: '7d',
      issuer: SERVICE_NAME,
      noTimestamp: false
    }
  }),
  ScheduleModule.forRoot()
]
const exposedProviders: Provider[] = [...Object.values(Services), UseCaseLogger]

@Global()
@Module({})
export class GlobalConfigModule {
  static register(): DynamicModule {
    const modelsByConnection = groupByKey(SchemaMetadataStorage.schemas, 'connectionName')

    const MongooseModels = Object.entries(modelsByConnection).map(([connectionName, models]) => {
      return MongooseModule.forFeature(
        models.map(model => getModelDefinitionBySchema(model.schema, model.name)),
        connectionName
      )
    })

    return {
      imports: [
        ...exposedModules,
        MongooseModule.forRoot(MONGO_URI, {
          connectionName: ConnectionName.DEFAULT
        }),
        ...MongooseModels,
        WinstonModule.forRoot(WINSTON_CONFIG)
      ],
      providers: [...exposedProviders],
      exports: [...exposedModules, ...exposedProviders, ...MongooseModels],
      module: GlobalConfigModule
    }
  }
}
