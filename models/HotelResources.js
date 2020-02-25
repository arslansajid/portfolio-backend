const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const hotelResourcesSchema = mongoose.Schema({
	ID: {
    	type: Number,
      unique:true
    },
  hotelResources_title: String,
  hotel_id: Number,
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

hotelResourcesSchema.index({ ID: 1 }, {unique: true})

autoIncrement.initialize(mongoose.connection)
hotelResourcesSchema.plugin(autoIncrement.plugin, { model: 'HotelResources', field: 'ID' })
module.exports = mongoose.model('HotelResources', hotelResourcesSchema)