/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8oxjhd1fb1mlio3")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "5le0vcpb",
    "name": "armorType",
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
  const collection = dao.findCollectionByNameOrId("8oxjhd1fb1mlio3")

  // remove
  collection.schema.removeField("5le0vcpb")

  return dao.saveCollection(collection)
})
