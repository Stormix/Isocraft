import { APP_NAME } from '../config/constants'
import { Service } from 'diod'

type LogLevelType = 'debug' | 'error' | 'info' | 'log' | 'warn'

@Service()
export default class Logger {
  log(level: LogLevelType, ...args: any[]): void {
    console[level](`%c ${APP_NAME}:`, 'color: #499ceb', ...args, '|', new Date().toUTCString())
  }

  info(...args: any[]): void {
    this.log('info', ...args)
  }
  debug(...args: any[]): void {
    this.log('debug', ...args)
  }
  warn(...args: any[]): void {
    this.log('warn', ...args)
  }
  error(...args: any[]): void {
    this.log('error', ...args)
  }
}
