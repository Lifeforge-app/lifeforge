/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mde1cgke4ktc98i")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rv6com9j",
    "name": "duration",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mde1cgke4ktc98i")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rv6com9j",
    "name": "total_minutes",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
})
