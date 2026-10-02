import {
  type RelationsBuilder,
  type RelationsBuilderConfig,
  defineRelations
} from 'drizzle-orm'

import { DrizzleSchemaRegistry } from './registry/DrizzleSchemaRegistry'

export function defineModuleSchema<
  TTables extends Record<string, any>,
  TConfig extends RelationsBuilderConfig<TTables>
>(tables: TTables, relations: (r: RelationsBuilder<TTables>) => TConfig) {
  DrizzleSchemaRegistry.register({
    tables: tables as Record<string, any>,
    relations: relations as (r: any) => Record<string, any>
  })

  return defineRelations(tables, relations)
}
