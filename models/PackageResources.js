const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const packageResourcesSchema = mongoose.Schema({
	ID: {
    	type: Number,
      unique:true
    },
  packageResources_title: String,
  package_id: Number,
  city_id: Number,
  image_type: {
    type: String
  },
  images:
    {
      public_id: String,
      url: String
    },
  description: String,
  created_At: Date
},
{ versionKey: false })

packageResourcesSchema.index({ ID: 1 }, {unique: true})

autoIncrement.initialize(mongoose.connection)
packageResourcesSchema.plugin(autoIncrement.plugin, { model: 'PackageResources', field: 'ID' })
module.exports = mongoose.model('PackageResources', packageResourcesSchema)