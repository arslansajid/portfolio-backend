const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const AgentPageSchema = mongoose.Schema({
  ID: Number,
  city_id: Number,
  location_id: Number,
  name: String,
  video_link: String,
  addresses: [
    {
      address_type: String,
      primary: Boolean,
      location_id: Number,
      city_id: Number,
      street: String
    }
  ],
  gallery: [
    {
      public_id: String,
      url: String,
      image_type: String
    }
  ]
},
{ versionKey: false })

AgentPageSchema.index({ ID: 1 }, {unique: true})

autoIncrement.initialize(mongoose.connection)
AgentPageSchema.plugin(autoIncrement.plugin, { model: 'AgentPages', field: 'ID' })
module.exports = mongoose.model('AgentPages', AgentPageSchema)