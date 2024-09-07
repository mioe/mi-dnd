/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nobn8b9fk57f5ti")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cz03iodj",
    "name": "sex",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nobn8b9fk57f5ti")

  // remove
  collection.schema.removeField("cz03iodj")

  return dao.saveCollection(collection)
})
