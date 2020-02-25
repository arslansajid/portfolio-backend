const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const experienceSchema = mongoose.Schema({
	ID:{
    	type: Number,
      unique:true
  	},
  experience_title: {
    type: String
  },
  user_id: Number,
  menu: String,
  estimated_time: String,
  user_name: {
    type: String
  },
  time: String,
  phone_number: String,
  important_information: String,
  location_id: Number,
  city_id: Number,
  spoken_languages: [],
  created_At: Date,
  recommended: Boolean,
  latitude: String,
  longitude: String,
  todo: [
    {
      todo_title: String,
      description: String
    }
  ],
  star_rating: Number,
  gallery: [
    {
      public_id: String,
      url: String,
      image_Title: String
    }
  ],
  review_count: Number,
  guest_gallery: [
    {
      public_id: String,
      url: String,
      image_Title: String
    }
  ],
  description: String,
  video_link: []
},
{ versionKey: false })

experienceSchema.index({ ID: 1 }, {unique: true})
experienceSchema.index({ user_name: 1 })

autoIncrement.initialize(mongoose.connection)
experienceSchema.plugin(autoIncrement.plugin, { model: 'Experiences', field: 'ID' })
module.exports = mongoose.model('Experiences', experienceSchema)