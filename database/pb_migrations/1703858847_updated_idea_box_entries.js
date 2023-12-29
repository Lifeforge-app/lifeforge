/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("g5fdcy099cdntzt")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tzxfjxmw",
    "name": "container",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "10yi8esudwbgz4n",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("g5fdcy099cdntzt")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tzxfjxmw",
    "name": "container",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "10yi8esudwbgz4n",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})
