import * as winston from 'winston'
import TransportStream = require('winston-transport')
import { WinstonModuleOptions } from 'nest-winston'
import { IS_PROD } from '@common/constants'

const transports: TransportStream[] = [
  new winston.transports.Console({
    format: IS_PROD
      ? winston.format.json()
      : winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.simple()
        )
  })
]

export const WINSTON_CONFIG: WinstonModuleOptions = {
  level: 'info',
  transports
}
