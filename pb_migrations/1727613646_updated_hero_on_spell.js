/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5heszd0879ettrv")

  // remove
  collection.schema.removeField("ruyajscz")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5heszd0879ettrv")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ruyajscz",
    "name": "currentCount",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": true
    }
  }))

  return dao.saveCollection(collection)
})
