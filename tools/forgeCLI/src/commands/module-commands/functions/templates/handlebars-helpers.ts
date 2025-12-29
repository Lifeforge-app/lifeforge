import Handlebars from 'handlebars'
import _ from 'lodash'

export function registerHandlebarsHelpers(): void {
  Handlebars.registerHelper('kebab', _.kebabCase)
  Handlebars.registerHelper('pascal', (str: string) =>
    _.startCase(str).replace(/ /g, '')
  )
  Handlebars.registerHelper('camel', _.camelCase)
  Handlebars.registerHelper('snake', _.snakeCase)
}
