/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "nsyrsllnjoihfz1",
    "created": "2024-09-07 09:06:46.091Z",
    "updated": "2024-09-07 09:06:46.091Z",
    "name": "gold",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "snipmobc",
        "name": "hero",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "nobn8b9fk57f5ti",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "fedrbjix",
        "name": "copper",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": true
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
  const collection = dao.findCollectionByNameOrId("nsyrsllnjoihfz1");

  return dao.deleteCollection(collection);
})
