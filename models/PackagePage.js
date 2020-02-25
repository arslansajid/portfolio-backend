const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const packagePageSchema = mongoose.Schema({
  ID:{
    type: Number,
    unique:true
  },
  agent_id: Number, 
  city_id: Number, 
  location_id: Number,
  package_title: String,
  minimum_price: String,
  price: [
    {
      person: String,
      wifi: Boolean,
      shuttle_service: Boolean,
      breakfast: Boolean,
      buffet: Boolean,
      dinner: Boolean,
      nights_stay: String,
      price: String,
      description: String,
    }
  ],
  description: String, 
  travel_modes: [
    {
      travelmodes_title: String,
      departure: String,
      destination: String,
      travel_time: String,
      distance: String,
      travel_type: String,
      description : String
    }
  ],
  activities: [
    {
      activity_type: String,
      description: String,
      status: Boolean
    }
  ],
  gallery: [
    {
      public_id: String,
      url: String,
      image_type: String
    }
  ], 
  latitude: String,
  longitude: String,
  star_rating: Number,
  views: Number,
  review_count: Number,
  video_link: [],
  summary: String
},
{ versionKey: false })

packagePageSchema.index({ ID: 1 }, {unique: true})

autoIncrement.initialize(mongoose.connection)
packagePageSchema.plugin(autoIncrement.plugin, { model: 'PackagePages', field: 'ID' })
module.exports = mongoose.model('PackagePages', packagePageSchema)