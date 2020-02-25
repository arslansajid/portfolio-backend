const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const hotelRatingSchema = mongoose.Schema({
	ID:{
    	type: Number,
      unique:true
  	},
  comment: {
    type: String
	}, 
  status: {
    type: String
	},
  hotel_id: Number,
  rating: Number,
  user_name: String,
  user_id: Number,
  created_At: Date
},
{ versionKey: false })

hotelRatingSchema.index({ ID: 1 }, {unique: true})

autoIncrement.initialize(mongoose.connection)
hotelRatingSchema.plugin(autoIncrement.plugin, { model: 'HotelRatings', field: 'ID' })
module.exports = mongoose.model('HotelRatings', hotelRatingSchema)