/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nobn8b9fk57f5ti")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pn5stepx",
    "name": "eyes",
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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nobn8b9fk57f5ti")

  // remove
  collection.schema.removeField("pn5stepx")

  return dao.saveCollection(collection)
})
