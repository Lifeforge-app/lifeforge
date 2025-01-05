/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import listModules from './functions/listModules'
import summarizeModules from './functions/summarizeModule'
import loginUser from '../../utils/loginUser'
import { getVisibleLength } from '../../utils/strings'

async function listModule(
  username: string,
  password: string,
  t: (key: string) => string
): Promise<void> {
  const [loggedIn] = await loginUser(username, password, t)

  if (!loggedIn) {
    return
  }

  const table = listModules(t)

  summarizeModules(t, getVisibleLength(table.split('\n').shift() ?? '') ?? 0)
}

export default listModule
