import z from 'zod'

import forge from '../forge'

export const toggle = forge
  .mutation()
  .description('Toggle dev mode for a module')
  .input({
    body: z.object({
      moduleName: z.string().min(1)
    })
  })
  .callback(async ({ body: { moduleName }, core: { tempFile } }) => {
    const devModeFile = new tempFile('module_dev_mode.json', 'array')

    const modules = (devModeFile.read() as string[]) || []

    const index = modules.indexOf(moduleName)

    if (index === -1) {
      modules.push(moduleName)
    } else {
      modules.splice(index, 1)
    }

    devModeFile.write(JSON.stringify(modules))

    return { success: true, isDevMode: index === -1 }
  })
