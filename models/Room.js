const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const roomSchema = mongoose.Schema({
  ID: {
    type: Number,
    unique: true
  },
  hotel_id: Number,
  title: String,
  persons: Number,
  beds: Number,
  bed_type: String,
  description: String,
  gallery: [
    {
      public_id: String,
      url: String,
      image_type: String
    }
  ],
  price_per_night: Number,
  pets_allowed: Boolean,
  smoking_allowed: Boolean,
  room_amenities: [
    {
      value: Boolean,
      name: String
    },
    {
      value: Boolean,
      name: String
    }
  ],
  packages: [
    {
      packege_title: String,
      wifi: Boolean,
      shuttle_service: Boolean,
      breakfast: Boolean,
      buffet: Boolean,
      nights_stay: Number,
      price: Number,
      description: String,
    }
  ]},
{ versionKey: false })

roomSchema.index({ ID: 1 }, {unique: true})

autoIncrement.initialize(mongoose.connection)
roomSchema.plugin(autoIncrement.plugin, { model: 'Rooms', field: 'ID' })
module.exports = mongoose.model('Rooms', roomSchema)