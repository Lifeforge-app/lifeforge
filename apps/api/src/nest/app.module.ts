import type { Request } from 'express'

export class AppModule {}

export async function createAppModule(): Promise<typeof AppModule> {
  const nestCommonPackage = '@nestjs/common'
  const { Controller, Get, Module, Req } = await import(nestCommonPackage)

  class BootstrapHealthController {
    getHealth(request: Request) {
      return {
        status: 'ok',
        ioAvailable: Boolean(request.io)
      }
    }
  }

  const prototype = BootstrapHealthController.prototype
  const descriptor = Object.getOwnPropertyDescriptor(prototype, 'getHealth')

  Req()(prototype, 'getHealth', 0)
  Get('/api/health')(prototype, 'getHealth', descriptor!)
  Controller()(BootstrapHealthController)
  Module({ controllers: [BootstrapHealthController] })(AppModule)

  return AppModule
}
