const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const packageRatingSchema = mongoose.Schema({
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
  package_id: Number,
  rating: Number,
  user_name: String,
  user_id: Number,
  created_At: Date
},
{ versionKey: false })

packageRatingSchema.index({ ID: 1 }, {unique: true})

autoIncrement.initialize(mongoose.connection)
packageRatingSchema.plugin(autoIncrement.plugin, { model: 'PackageRatings', field: 'ID' })
module.exports = mongoose.model('PackageRatings', packageRatingSchema)