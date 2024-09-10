/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8oxjhd1fb1mlio3")

  collection.updateRule = "hero.player.id = @request.auth.id"

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "q38d4udf",
    "name": "hero",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "nobn8b9fk57f5ti",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8oxjhd1fb1mlio3")

  collection.updateRule = null

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "q38d4udf",
    "name": "field",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "nobn8b9fk57f5ti",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})
