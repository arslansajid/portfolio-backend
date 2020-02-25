const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autoIncrement = require('mongoose-auto-increment')

let locationResourcesSchema = new Schema({
	ID: {
		type: Number,
		unique:true
  },
  LocationResources_title: String,
  location_id: Number,
  resource_type: String,
  city_id: Number,
  status: String,
  gallery:
    {
      public_id: String,
      url: String,
      image_type: String
    },
  description: String,
  created_At: Date
  },
{ 
	versionKey: false 
})

locationResourcesSchema.index({ ID: 1 }, {unique: true})

autoIncrement.initialize(mongoose.connection)
locationResourcesSchema.plugin(autoIncrement.plugin, { model: 'Location_Resources', field: 'ID' })
module.exports = mongoose.model('Location_Resources', locationResourcesSchema)