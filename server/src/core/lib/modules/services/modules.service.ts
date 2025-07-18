import ClientError from '@functions/ClientError'
import fs from 'fs'
import JSZip from 'jszip'
import _ from 'lodash'
import path from 'path'
import PocketBase from 'pocketbase'

function traverse(path: string, rootPath: string, zip: JSZip) {
  const listing = fs.readdirSync(path)

  for (const item of listing) {
    const itemPath = `${path}/${item}`

    const isDirectory = fs.lstatSync(itemPath).isDirectory()

    if (isDirectory) {
      const childZip = zip.folder(item)

      traverse(itemPath, rootPath, childZip!)
    } else {
      zip.file(item, fs.readFileSync(itemPath))
    }
  }
}

export const toggleModule = async (pb: PocketBase, id: string) => {
  const user = pb.authStore.record

  if (!user) {
    throw new ClientError('Unauthorized to toggle module')
  }

  const modules = user.enabledModules || []

  if (!modules.includes(id)) {
    modules.push(id)
  } else {
    const index = modules.indexOf(id)

    if (index > -1) {
      modules.splice(index, 1)
    }
  }

  await pb.collection('users').update(user.id, {
    enabledModules: modules
  })
}

export const listAppPaths = (): string[] => {
  const appsDir = path.resolve(process.cwd(), 'src/apps')

  if (!fs.existsSync(appsDir)) {
    throw new Error('Apps directory does not exist')
  }

  const appFolders = fs
    .readdirSync(appsDir)
    .filter(file => fs.statSync(path.join(appsDir, file)).isDirectory())

  return appFolders
}

export const packageModule = async (id: string) => {
  const appDir = path.resolve(process.cwd(), 'src/apps')

  const moduleDir = path.join(appDir, id)

  if (!fs.existsSync(moduleDir)) {
    throw new ClientError('Module directory does not exist')
  }

  const backendZip = JSZip()

  traverse(moduleDir, moduleDir, backendZip)

  return await backendZip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 9
    }
  })
}

export const installModule = async (
  name: string,
  file?: Express.Multer.File
): Promise<void> => {
  if (!file) {
    throw new ClientError('No file uploaded')
  }

  const folderName = _.camelCase(name)

  const pathName = _.kebabCase(name)

  const appsDir = path.resolve(process.cwd(), 'src/apps')

  const moduleDir = path.join(appsDir, folderName)

  if (fs.existsSync(moduleDir)) {
    throw new ClientError(`Module with name ${name} already exists`)
  }

  fs.mkdirSync(moduleDir, { recursive: true })

  const zipFileBuffer = fs.readFileSync(file.path)

  const backendzip = await JSZip.loadAsync(zipFileBuffer)

  const filePromises = Object.keys(backendzip.files).map(async filename => {
    const fileData = await backendzip.file(filename)?.async('nodebuffer')

    if (fileData) {
      const outputPath = path.join(moduleDir, filename)

      fs.mkdirSync(path.dirname(outputPath), { recursive: true })
      fs.writeFileSync(outputPath, fileData)
    }
  })

  await Promise.all(filePromises)

  const appHasAPIIndex = fs.existsSync(path.join(moduleDir, 'index.ts'))

  if (appHasAPIIndex) {
    const routesConfig = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), 'src/core/routes/module.routes.json'),
        'utf-8'
      )
    ) as Record<string, string>

    if (routesConfig[`/${pathName}`]) {
      throw new ClientError(`Route for ${pathName} already exists`)
    }

    routesConfig[`/${pathName}`] = folderName
    fs.writeFileSync(
      path.join(process.cwd(), 'src/core/routes/module.routes.json'),
      JSON.stringify(routesConfig, null, 2)
    )
  }

  fs.unlinkSync(file.path)
}
