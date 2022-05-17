let frontendLogger = null

if (process.env.NODE_ENV == 'development') {
  frontendLogger = console // TODO: search for existing logger modules
}

export const logger = frontendLogger
