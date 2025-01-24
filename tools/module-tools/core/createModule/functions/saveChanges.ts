/* eslint-disable prefer-const */
import fs from 'fs'
import saveTranslation from './saveTranslations'

const ROUTES = JSON.parse(fs.readFileSync('./src/routes_config.json', 'utf-8'))

async function saveChanges({
  login,
  moduleID,
  modulePath,
  moduleNameEN,
  moduleNameInOtherLangs,
  moduleDescInOtherLangs,
  moduleCategory,
  togglable,
  moduleIcon
}: {
  login: { token: string }
  moduleID: string
  modulePath: string
  moduleNameEN: { moduleName: string }
  moduleNameInOtherLangs: {
    moduleNameZHCN: string
    moduleNameZHTW: string
    moduleNameMS: string
  }
  moduleDescInOtherLangs: {
    moduleDescEN: string
    moduleDescZHCN: string
    moduleDescZHTW: string
    moduleDescMS: string
  }
  moduleCategory: { moduleCategory: string }
  togglable: { value: boolean }
  moduleIcon: string
}): Promise<boolean> {
  ROUTES.find((e: any) => e.title === moduleCategory.moduleCategory).items.push(
    {
      name: moduleNameEN.moduleName,
      icon: moduleIcon,
      routes: {
        [modulePath]: modulePath
      },
      togglable: togglable.value
    }
  )

  fs.writeFileSync('./src/routes_config.json', JSON.stringify(ROUTES, null, 2))

  if (fs.existsSync(`./src/modules/${moduleID}`)) {
    console.error('Module already exists')
    return false
  }

  fs.mkdirSync(`./src/modules/${moduleID}`)

  const indexTSXTemplate = `import React from 'react'
          import ModuleHeader from '@components/Module/ModuleHeader'
          import ModuleWrapper from '@components/Module/ModuleWrapper'
        
          function ${moduleID}(): React.ReactElement {
            return (
              <ModuleWrapper>
                <ModuleHeader title="${moduleNameEN.moduleName}" icon="${moduleIcon}"  />
              </ModuleWrapper>
            )
          }
        
          export default ${moduleID}
          `

  fs.writeFileSync(`./src/modules/${moduleID}/index.tsx`, indexTSXTemplate)

  const componentsFile = fs.readFileSync('./src/Components.tsx', 'utf-8')

  let [otherImports, importStatements, exportStatements] =
    componentsFile.split('\n\n')

  importStatements += `
        const ${moduleID} = lazy(
          async () => await import('./modules/${moduleID}')
        )
        `

  exportStatements =
    exportStatements.trim().slice(0, -2) +
    `,\n  '${modulePath}': {\n    '${modulePath}': ${moduleID}\n  }\n};`

  fs.writeFileSync(
    './src/Components.tsx',
    `${otherImports}\n\n${importStatements}\n\n${exportStatements}`
  )

  const isModuleNameSaved = await saveTranslation({
    key: `modules.${moduleID[0].toLowerCase() + moduleID.slice(1)}`,
    en: moduleNameEN.moduleName,
    'zh-CN': moduleNameInOtherLangs.moduleNameZHCN,
    'zh-TW': moduleNameInOtherLangs.moduleNameZHTW,
    ms: moduleNameInOtherLangs.moduleNameMS,
    login
  })

  if (!isModuleNameSaved) {
    return false
  }

  const isModuleDescSaved = await saveTranslation({
    key: `modules.descriptions.${
      moduleID[0].toLowerCase() + moduleID.slice(1)
    }`,
    en: moduleDescInOtherLangs.moduleDescEN,
    'zh-CN': moduleDescInOtherLangs.moduleDescZHCN,
    'zh-TW': moduleDescInOtherLangs.moduleDescZHTW,
    ms: moduleDescInOtherLangs.moduleDescMS,
    login
  })

  if (!isModuleDescSaved) {
    return false
  }

  return true
}

export default saveChanges
