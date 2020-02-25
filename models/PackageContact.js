const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const packageContactSchema = mongoose.Schema({
	ID:{
    	type: Number,
      unique:true
  	},
  package_id: Number,
  start_date: Date,
  end_date: Date,
  duration: Number,
  user_id: Number,
  user_phone: Number,
  user_name: String,
  user_email: String
},
{ versionKey: false })

packageContactSchema.index({ ID: 1 }, {unique: true})

autoIncrement.initialize(mongoose.connection)
packageContactSchema.plugin(autoIncrement.plugin, { model: 'PackageContact', field: 'ID' })
module.exports = mongoose.model('PackageContact', packageContactSchema)