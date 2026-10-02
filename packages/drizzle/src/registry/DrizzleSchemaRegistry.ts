import type { Table, View } from 'drizzle-orm'

export type SchemaEntry = Table | View

export interface DrizzleSchemaPart {
  tables: Record<string, SchemaEntry>
  relations: (r: any) => Record<string, any>
}

export class DrizzleSchemaRegistry {
  private static registeredParts: DrizzleSchemaPart[] = []

  static register(part: DrizzleSchemaPart): void {
    DrizzleSchemaRegistry.registeredParts.push(part)
  }

  static get parts(): readonly DrizzleSchemaPart[] {
    return DrizzleSchemaRegistry.registeredParts
  }
}
