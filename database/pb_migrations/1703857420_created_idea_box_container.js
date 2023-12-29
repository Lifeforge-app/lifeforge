/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "10yi8esudwbgz4n",
    "created": "2023-12-29 13:43:40.874Z",
    "updated": "2023-12-29 13:43:40.874Z",
    "name": "idea_box_container",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "raujcrkq",
        "name": "icon",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "hvuukigw",
        "name": "color",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "spxeebso",
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
    "indexes": [
      "CREATE UNIQUE INDEX `idx_o6dotbA` ON `idea_box_container` (`name`)"
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("10yi8esudwbgz4n");

  return dao.deleteCollection(collection);
})
