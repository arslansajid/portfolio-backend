const AppConfig = require('./AppConfig')
const Cloudinary = require('./Cloudinary')
// const Images = require('mongoose').model('HotelImages')
const LocationResources = require('../models/LocationResources')
let debug = require("debug-levels")("LocationResourcesLib")

const LocationResourcesLib = {

  async saveImage (data) {
    let res = []
    if(data) {
      for(let i = 0; i < data.length; i++) {
        const locationResources = new LocationResources(data[i])    
        await locationResources.save().then(result => {
          if(!result) {
            debug.error("ERROR: Saving Image!")
            return
          }
          debug.info('Image Saved Result', result)
          res.push(result) 
        })
        .catch(error => {
          debug.error("ERROR: Found in Image!", error)
          return
        })
      }
    }
    return res
  },


  async updateImage (data) {
    let res
    let Id = data.ID
    await LocationResources.findOneAndUpdate({
      ID: Id
    },
    data,
    {upsert:false}
    )
    .then(result => {
      if(!result) {
        debug.error("No ID Found or ERROR: updating Image!")
        return
      }
      debug.info('Image Updated Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in updating Image!", error)
      return
    })
    return res
  },

  async createLocationResourceObject (gallery, data) {
    let createResourceObject = []
    if(gallery){
      createResourceObject = gallery.map( resource => {
        let resourceObject = {
          LocationResources_title: data.LocationResources_title,
          location_id: data.location_id,
          resource_type: data.resource_type,
          city_id: data.city_id,
          status: data.status,
          gallery:
          {
            public_id: resource.public_id,
            url: resource.url
          },
        description: data.description,
        created_At: new Date()
        }
        return resourceObject
      })
    }
    return createResourceObject
  },

  async fetchAllImages () {
    let reply 
    await LocationResources.find()
    .exec()
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('LocationResources: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No LocationResources found", error)
      return
    })
    return reply
  },

  async findImageById (ID) {
    let reply 
    await LocationResources.find({
      ID : ID
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Image: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Image found", error)
      return
    })
    return reply
  },

  async findImageByHotelId (hotel_id) {
    hotel_id = Number(hotel_id)
    let hotelData = []
      let reply 
      try {
        hotelData = await LocationResources.aggregate([
          {
            "$match":
            {
              "hotel_id": hotel_id
            }
          },
          { "$group" : 
            { 
              "_id" : "$image_type", 
              "url": { "$push": "$images"},
              "description": { "$push": "$description" } 
            } 
          }
      ])
      } catch (error) {
        debug.info(error)
      }
      
      if(hotelData  && hotelData.length > 0) {
        return hotelData
      } else {
        debug.info('ERROR: No Hotel Data Found To Update Rating!')
        return
      }
  },

  async findImageByType (image_type) {
    let reply 
    await LocationResources.find({
      image_type: image_type
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Image: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Image found", error)
      return
    })
    return reply
  },

  async findImageByTypeAndHotelId (image_type, hotel_id) {
    let reply 
    await LocationResources.find({
      image_type: image_type,
      hotel_id: hotel_id
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Image: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Image found", error)
      return
    })
    return reply
  },

  async deleteImageById (ID) {
    let reply
    await HotelImageLib.deleteImages(ID)
    await LocationResources.findOneAndDelete({ 
      ID: ID 
    })
    .then (res => {
      if (!res) {
        return
      }
      debug.info('Image: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Image found", error)
      return
    })
    return reply
  },

  async deleteImages (Id) {
    let reply
    let image = await HotelImageLib.findImageById(Id)
    if(image) {
      reply = await Cloudinary.deleteMultipleHotelImages(image)
      if(reply) {
        debug.info('Picture Deleted! ', reply)
      } else {
        debug.error("ERROR: No Pictures Found OR Error Deleting Pictures of HotelImages!")
      }
    } else {
      debug.error("ERROR: No ImageData Found To Delete HotelImages!")
    }
  }


}

module.exports = LocationResourcesLib