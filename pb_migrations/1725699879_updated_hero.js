/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nobn8b9fk57f5ti")

  // remove
  collection.schema.removeField("tudatnjz")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nobn8b9fk57f5ti")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tudatnjz",
    "name": "lvl",
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
