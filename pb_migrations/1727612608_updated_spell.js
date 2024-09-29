/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7azull2gccid8t6")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dxfjbdmh",
    "name": "link",
    "type": "url",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": null,
      "onlyDomains": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7azull2gccid8t6")

  // remove
  collection.schema.removeField("dxfjbdmh")

  return dao.saveCollection(collection)
})
