const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const coverBannerSchema = mongoose.Schema({
	ID:{
    type: Number,
    unique:true
  },
  image:{
    public_id: String,
    url: String
  }, 
  hotel_id: Number,
  agency_id: Number,
  start_date: Date,
  end_date: Date
},
{ versionKey: false })

coverBannerSchema.index({ ID: 1 }, {unique: true})

autoIncrement.initialize(mongoose.connection)
coverBannerSchema.plugin(autoIncrement.plugin, { model: 'CoverBanners', field: 'ID' })
module.exports = mongoose.model('CoverBanners', coverBannerSchema)