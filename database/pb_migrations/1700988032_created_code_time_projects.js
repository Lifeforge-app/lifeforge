/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "mde1cgke4ktc98i",
    "created": "2023-11-26 08:40:32.005Z",
    "updated": "2023-11-26 08:40:32.005Z",
    "name": "code_time_projects",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "mcmnpisn",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("mde1cgke4ktc98i");

  return dao.deleteCollection(collection);
})
