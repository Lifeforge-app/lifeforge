import { getTableName } from 'drizzle-orm'
import { pgTable, uuid } from 'drizzle-orm/pg-core'
import { describe, expect, it } from 'vitest'

import { composeRelations } from './composeRelations'
import { defineModuleSchema } from './defineModuleSchema'

const MODULE = 'lifeforge--app'

/** Resolves a module's schema the way the server does (into a global config). */
function buildRelations(
  tables: Record<string, any>,
  relations: (r: any) => Record<string, any>
): any {
  return composeRelations([defineModuleSchema(tables, relations, MODULE)])
}

describe('defineModuleSchema', () => {
  it('leaves core schemas unprefixed (no moduleId)', () => {
    const events = pgTable('events', { id: uuid('id').primaryKey() })

    const definition = defineModuleSchema({ events }, () => ({}))

    expect(definition.keyMap).toBeUndefined()
    expect(Object.keys(definition.tables)).toEqual(['events'])
  })

  it('namespaces table keys and exposes a bare->namespaced keyMap', () => {
    const events = pgTable('app__events', { id: uuid('id').primaryKey() })
    const categories = pgTable('app__categories', {
      id: uuid('id').primaryKey()
    })

    const definition = defineModuleSchema(
      { events, categories },
      () => ({}),
      MODULE
    )

    expect(definition.keyMap).toEqual({
      events: 'app__events',
      categories: 'app__categories'
    })
    expect(Object.keys(definition.tables).sort()).toEqual([
      'app__categories',
      'app__events'
    ])
  })

  it('namespaces forward relation targets', () => {
    const events = pgTable('app__events', {
      id: uuid('id').primaryKey(),
      category_id: uuid('category_id')
    })
    const categories = pgTable('app__categories', {
      id: uuid('id').primaryKey()
    })

    const built = buildRelations({ events, categories }, r => ({
      events: {
        category: r.one.categories({
          from: r.events.category_id,
          to: r.categories.id
        })
      }
    }))

    expect(built['app__events'].relations.category.targetTableName).toBe(
      'app__categories'
    )
    expect(built['app__events'].relations.category.sourceColumns[0].name).toBe(
      'category_id'
    )
  })

  it('resolves reverse relations declared without from/to', () => {
    const events = pgTable('app__events', {
      id: uuid('id').primaryKey(),
      category_id: uuid('category_id')
    })
    const categories = pgTable('app__categories', {
      id: uuid('id').primaryKey()
    })

    const built = buildRelations({ events, categories }, r => ({
      events: {
        category: r.one.categories({
          from: r.events.category_id,
          to: r.categories.id
        })
      },
      categories: { events: r.many.events() }
    }))

    expect(built['app__categories'].relations.events.targetTableName).toBe(
      'app__events'
    )
  })

  it('resolves many-to-many through relations', () => {
    const users = pgTable('app__users', { id: uuid('id').primaryKey() })
    const posts = pgTable('app__posts', { id: uuid('id').primaryKey() })
    const usersToPosts = pgTable('app__users_to_posts', {
      user_id: uuid('user_id'),
      post_id: uuid('post_id')
    })

    const built = buildRelations({ users, posts, usersToPosts }, r => ({
      users: {
        posts: r.many.posts({
          from: r.users.id.through(r.usersToPosts.user_id),
          to: r.posts.id.through(r.usersToPosts.post_id)
        })
      }
    }))

    expect(getTableName(built['app__users'].relations.posts.throughTable)).toBe(
      'app__users_to_posts'
    )
  })

  it('resolves aliased relations to the same target', () => {
    const people = pgTable('app__people', { id: uuid('id').primaryKey() })
    const messages = pgTable('app__messages', {
      id: uuid('id').primaryKey(),
      sender_id: uuid('sender_id'),
      receiver_id: uuid('receiver_id')
    })

    const built = buildRelations({ people, messages }, r => ({
      messages: {
        sender: r.one.people({
          from: r.messages.sender_id,
          to: r.people.id,
          alias: 'sender'
        }),
        receiver: r.one.people({
          from: r.messages.receiver_id,
          to: r.people.id,
          alias: 'receiver'
        })
      }
    }))

    expect(Object.keys(built['app__messages'].relations).sort()).toEqual([
      'receiver',
      'sender'
    ])
  })

  it('resolves self relations', () => {
    const folders = pgTable('app__folders', {
      id: uuid('id').primaryKey(),
      parent_id: uuid('parent_id')
    })

    const built = buildRelations({ folders }, r => ({
      folders: {
        parent: r.one.folders({
          from: r.folders.parent_id,
          to: r.folders.id
        }),
        children: r.many.folders()
      }
    }))

    expect(Object.keys(built['app__folders'].relations).sort()).toEqual([
      'children',
      'parent'
    ])
  })

  it('does not hijack a column named like a table key (collision)', () => {
    const events = pgTable('app__events', {
      id: uuid('id').primaryKey(),
      name: uuid('name')
    })
    const name = pgTable('app__name', { id: uuid('id').primaryKey() })

    const built = buildRelations({ events, name }, r => ({
      events: {
        nameRef: r.one.name({ from: r.events.name, to: r.name.id })
      }
    }))

    expect(built['app__events'].relations.nameRef.targetTableName).toBe(
      'app__name'
    )
    expect(built['app__events'].relations.nameRef.sourceColumns[0].name).toBe(
      'name'
    )
  })
})
