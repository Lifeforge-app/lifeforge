/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uavs54y13au2nqb")

  // remove
  collection.schema.removeField("kjarmfe9")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dzmg0upf",
    "name": "event_time",
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
  const collection = dao.findCollectionByNameOrId("uavs54y13au2nqb")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kjarmfe9",
    "name": "event_time",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // remove
  collection.schema.removeField("dzmg0upf")

  return dao.saveCollection(collection)
})
