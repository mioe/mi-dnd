/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nsyrsllnjoihfz1")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "2sxbrr8j",
    "name": "silver",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xsfauzgl",
    "name": "electrum",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "smnwr4cb",
    "name": "gold",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xxw5knut",
    "name": "platinum",
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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nsyrsllnjoihfz1")

  // remove
  collection.schema.removeField("2sxbrr8j")

  // remove
  collection.schema.removeField("xsfauzgl")

  // remove
  collection.schema.removeField("smnwr4cb")

  // remove
  collection.schema.removeField("xxw5knut")

  return dao.saveCollection(collection)
})
