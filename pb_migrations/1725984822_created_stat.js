/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "8oxjhd1fb1mlio3",
    "created": "2024-09-10 16:13:42.467Z",
    "updated": "2024-09-10 16:13:42.467Z",
    "name": "stat",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "o1vujtcl",
        "name": "initiative",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
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
  const collection = dao.findCollectionByNameOrId("8oxjhd1fb1mlio3");

  return dao.deleteCollection(collection);
})
