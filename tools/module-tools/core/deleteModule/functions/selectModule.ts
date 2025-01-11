import prompts from 'prompts'
import cancelOperation from './cancelOperation'
import { ROUTES } from '../../../constants/routes'

async function selectModule(t: (key: string) => string): Promise<string> {
  const modules = ROUTES.flatMap(route =>
    route.items.filter(e => e.togglable).map(item => item.name)
  ).sort((a, b) => a.localeCompare(b))

  const { module } = await prompts(
    {
      type: 'autocomplete',
      name: 'module',
      message: t('moduleTools.features.delete.prompts.selectModule'),
      choices: modules.map(module => ({ title: module, value: module })),
      validate: value =>
        value !== undefined && value !== '' ? true : 'Module is required'
    },
    {
      onCancel: () => {
        cancelOperation(t)
      }
    }
  )

  if (module === undefined || module === '') {
    throw new Error('Module selection failed')
  }

  return module
}

export default selectModule
