const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const experienceRatingSchema = mongoose.Schema({
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
  experience_id: Number,
  rating: Number,
  user_name: String,
  user_id: Number,
  created_At: Date
},
{ versionKey: false })

experienceRatingSchema.index({ ID: 1 }, {unique: true})

autoIncrement.initialize(mongoose.connection)
experienceRatingSchema.plugin(autoIncrement.plugin, { model: 'ExperienceRatings', field: 'ID' })
module.exports = mongoose.model('ExperienceRatings', experienceRatingSchema)