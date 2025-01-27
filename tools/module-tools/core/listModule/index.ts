import listModules from './functions/listModules'
import summarizeModules from './functions/summarizeModule'
import { getVisibleLength } from '../../utils/strings'

async function listModule(t: (key: string) => string): Promise<void> {
  const table = listModules(t)

  summarizeModules(t, getVisibleLength(table.split('\n').shift() ?? '') ?? 0)
}

export default listModule
