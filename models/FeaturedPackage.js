const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const featuredPackageSchema = mongoose.Schema({
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
  package_id: Number,
  starting_price: Number
},
{ versionKey: false })

featuredPackageSchema.index({ ID: 1 }, {unique: true})

autoIncrement.initialize(mongoose.connection)
featuredPackageSchema.plugin(autoIncrement.plugin, { model: 'FeaturedPackages', field: 'ID' })
module.exports = mongoose.model('FeaturedPackages', featuredPackageSchema)