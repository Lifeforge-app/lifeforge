/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "3hetaz0cl3kkbm4",
    "created": "2023-12-02 09:03:08.169Z",
    "updated": "2023-12-02 09:03:08.169Z",
    "name": "university_analytics_univerity_list",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "nwewb6ec",
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
      },
      {
        "system": false,
        "id": "7fsp2cyo",
        "name": "location",
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
        "id": "cwrs2xqp",
        "name": "QS_ranking",
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
        "id": "ha51tqp1",
        "name": "THE_ranking",
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
        "id": "ifuyv7zp",
        "name": "website",
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
        "id": "ptdkaruv",
        "name": "campus",
        "type": "file",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 99,
          "maxSize": 5242880,
          "mimeTypes": [],
          "thumbs": [],
          "protected": false
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
  const collection = dao.findCollectionByNameOrId("3hetaz0cl3kkbm4");

  return dao.deleteCollection(collection);
})
