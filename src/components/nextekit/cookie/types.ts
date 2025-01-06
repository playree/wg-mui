import { SerializeOptions } from 'cookie'
import { IncomingMessage, ServerResponse } from 'http'

export interface OptionsType extends SerializeOptions {
  res?: ServerResponse
  req?: IncomingMessage & {
    cookies?: { [key: string]: string } | Partial<{ [key: string]: string }>
  }
}
