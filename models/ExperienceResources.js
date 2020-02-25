const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const experienceResourcesSchema = mongoose.Schema({
	ID: {
    	type: Number,
      unique:true
    },
  experienceResources_title: String,
  experience_id: Number,
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

experienceResourcesSchema.index({ ID: 1 }, {unique: true})

autoIncrement.initialize(mongoose.connection)
experienceResourcesSchema.plugin(autoIncrement.plugin, { model: 'ExperienceResources', field: 'ID' })
module.exports = mongoose.model('ExperienceResources', experienceResourcesSchema)