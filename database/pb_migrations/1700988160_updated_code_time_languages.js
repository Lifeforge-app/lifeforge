/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yxs5srmdf2ot8yk")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fsr7opin",
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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yxs5srmdf2ot8yk")

  // remove
  collection.schema.removeField("fsr7opin")

  return dao.saveCollection(collection)
})
