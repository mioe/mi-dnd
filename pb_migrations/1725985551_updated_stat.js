/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8oxjhd1fb1mlio3")

  collection.listRule = "hero.player.id = @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8oxjhd1fb1mlio3")

  collection.listRule = null

  return dao.saveCollection(collection)
})
