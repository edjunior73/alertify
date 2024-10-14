import { Logger } from '@nestjs/common'

interface ILog {
  document: any
  action: string
  requestId: string
}

export const logInfo = ({ action, document, requestId }: ILog) =>
  Logger.log(`Request ID: ${requestId} Requested ${action} with details ${JSON.stringify(document)}`)

export const logSuccess = ({ action, requestId }: Omit<ILog, 'document'>) =>
  Logger.log(`Request ID: ${requestId} Successfully processed in action: ${action}`)

export const logWarn = ({ action, document, requestId }: ILog) =>
  Logger.warn(
    `Request ID: ${requestId} Warning occurred in action: ${action}! ${JSON.stringify(document)}`
  )

export const logError = ({ action, document, requestId }: ILog) =>
  Logger.error(
    `Request ID: ${requestId} Something went wrong in action: ${action}! ${JSON.stringify(document)}`
  )
