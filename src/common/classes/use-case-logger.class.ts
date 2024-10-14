import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class UseCaseLogger extends Logger {
  setContext(context: string) {
    this.context = context
  }
}
