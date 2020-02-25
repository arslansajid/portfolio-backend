const AppConfig = require('./AppConfig')
const Cloudinary = require('./Cloudinary')
const City = require('../models/City')
// const City = require('mongoose').model('Cities')
let debug = require("debug-levels")("CityLib")

const CityLib = {

  async saveCity (data) {
    let res
    data.created_At = new Date()
    const city = new City(data)
    await city.save().then(result => {
      if(!result) {
        debug.error("ERROR: Saving City!")
        return
      }
      debug.info('City Saved Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in City!", error)
      return
    })
    return res
  },


  async updateCity (data) {
    let res
    let Id = data.ID
    await City.findOneAndUpdate({
      ID: Id
    },
    data,
    {upsert:false}
    )
    .then(result => {
      if(!result) {
        debug.error("No ID Found or ERROR: updating City!")
        return
      }
      debug.info('City Updated Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in updating City!", error)
      return
    })
    return res
  },

  async fetchManyCities (data) {
    let reply 
    await City.find({
      ID: { $in: data }
    })
    .exec()
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Cities: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Cities found", error)
      return
    })
    return reply
  },

  async fetchAllCities () {
    let reply 
    await City.find()
    .exec()
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Cities: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No cities found", error)
      return
    })
    return reply
  },

  async countCities () {
    try {
      const cityRes = await City.countDocuments()
      if(!cityRes) {
        throw new Error('No Cities Found!')
      }
      debug.info('Cities: ', cityRes)
      return cityRes
    } catch (error) {
      debug.error("ERROR: No Cities Found!", error)
      return
    }
  },

  async fetchPaginationCitiess (pageSize, pageNumber) {
    pageNumber = Number(pageNumber)
    pageSize = Number(pageSize)
    try {
      const cityRes = await City.find()
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      if(!cityRes) {
        throw new Error('No Cities Found!')
      }
      debug.info('Cities: ', cityRes)
      return cityRes
    } catch (error) {
      debug.error("ERROR: No Cities Found!", error)
      return
    }
  },

  async findCityById (ID) {
    let reply 
    await City.find({
      ID : ID
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('City: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No City found", error)
      return
    })
    return reply
  },

  async findCityByName (name) {
    let reply 
    await City.find({ 
        name: 
        { 
          $regex: name, $options: 'i'
        } 
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('City: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No City found", error)
      return
    })
    return reply
  },

  async findCityByProvince (province) {
    let reply 
    await City.find({
      province: province
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('City: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No City found", error)
      return
    })
    return reply
  },

  async deleteCityById (ID) {
    let reply
    await CityLib.deleteImages(ID)
    await City.findOneAndDelete({ 
      ID: ID 
    })
    .then (res => {
      if (!res) {
        return
      }
      debug.info('City: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No City found", error)
      return
    })
    return reply
  },

  async deleteImages (Id) {
    let reply
    let city = await CityLib.findCityById(Id)
    if(city) {
      reply = Cloudinary.deleteMultipleImages(city)
      if(reply) {
        debug.info('Picture Deleted! ', reply)
      } else {
        debug.error("ERROR: No Pictures Found OR Error Deleting Pictures of City!")
      }
    } else {
      debug.error("ERROR: No City Found To Delete Images!")
    }
  },

  async fetchUrlImages (ID, url) {
    try {
      const cityRes = await City.findOne({
        ID: ID,
        "gallery.url": url
      })
      if(!cityRes) {
        throw new Error('No City Found!')
      }
      debug.info('City: ', cityRes)
      return cityRes
    } catch (error) {
      debug.error("ERROR: No City Found!", error)
      return
    }
  },

  async deletePictureObject (image, url) {
    let newArrayObject = []
    let gallery = image.gallery
    gallery.map( galleryObject => {
      if(galleryObject.url !== url) {
        newArrayObject.push(galleryObject)
      }
    })
    return newArrayObject
  },

  async deleteCityGallery (ID, url) {
    let image = await CityLib.fetchUrlImages(ID, url)
    if(image) {
      let gallery = await CityLib.deletePictureObject(image, url)
      image.gallery = gallery
      return image
    }
    else {
      debug.error("ERROR: No City Gallery Data Found To Delete City Gallery Data!")
    }
  },


}

module.exports = CityLib