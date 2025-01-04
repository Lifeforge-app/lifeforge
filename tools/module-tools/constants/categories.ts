import fs from 'fs'

const ROUTES = JSON.parse(fs.readFileSync('./src/routes_config.json', 'utf-8'))
const CATEGORIES = ROUTES.map((e: any) => e.title).filter((e: string) => e)

export { CATEGORIES }
