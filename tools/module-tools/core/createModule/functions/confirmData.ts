import chalk from 'chalk'
import prompts from 'prompts'
import table from 'table'

async function confirmData({
  moduleID,
  modulePath,
  moduleIcon,
  moduleNameEN,
  moduleNameInOtherLangs,
  moduleDescInOtherLangs,
  moduleCategory,
  togglable
}: {
  moduleID: string
  modulePath: string
  moduleIcon: string
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
}): Promise<boolean> {
  const data = [
    ['Module ID', moduleID],
    ['Module Path', modulePath],
    ['Module Icon', moduleIcon],
    ['Module Name (EN)', moduleNameEN.moduleName],
    ['Module Name (ZH-CN)', moduleNameInOtherLangs.moduleNameZHCN],
    ['Module Name (ZH-TW)', moduleNameInOtherLangs.moduleNameZHTW],
    ['Module Name (MS)', moduleNameInOtherLangs.moduleNameMS],
    ['Module Description (EN)', moduleDescInOtherLangs.moduleDescEN],
    ['Module Description (ZH-CN)', moduleDescInOtherLangs.moduleDescZHCN],
    ['Module Description (ZH-TW)', moduleDescInOtherLangs.moduleDescZHTW],
    ['Module Description (MS)', moduleDescInOtherLangs.moduleDescMS],
    ['Module Category', moduleCategory.moduleCategory],
    ['Togglable', togglable.value ? 'Yes' : 'No']
  ]

  console.log(
    table.table(data, {
      columns: {
        0: {
          alignment: 'right',
          width: 30
        },
        1: {
          alignment: 'left',
          width: 50
        }
      }
    })
  )

  const confirm = await prompts({
    type: 'confirm',
    name: 'value',
    message: 'Are you sure you want to create this module?'
  })

  if (!confirm.value) {
    console.log(chalk.red('✖ Module creation cancelled'))
    return false
  }

  return true
}

export default confirmData
