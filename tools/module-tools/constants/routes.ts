import fs from 'fs'
import { type IRoutes } from '@interfaces/routes_interfaces'

const ROUTES: IRoutes[] = JSON.parse(
  fs.readFileSync('./src/routes_config.json', 'utf-8')
)
const CATEGORIES = ROUTES.map((e: any) => e.title).filter((e: string) => e)

export { ROUTES, CATEGORIES }
