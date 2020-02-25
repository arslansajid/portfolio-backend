const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const featuredHotelSchema = mongoose.Schema({
	ID:{
    type: Number,
    unique:true
  },
  start_date: {
    type: Date
	},
  end_date: {
    type: Date
  },
  createdAt: {
    type: Date
  },
  hotel_id: Number,
  starting_price: Number
},
{ versionKey: false })

featuredHotelSchema.index({ ID: 1 }, {unique: true})

autoIncrement.initialize(mongoose.connection)
featuredHotelSchema.plugin(autoIncrement.plugin, { model: 'FeaturedHotels', field: 'ID' })
module.exports = mongoose.model('FeaturedHotels', featuredHotelSchema)