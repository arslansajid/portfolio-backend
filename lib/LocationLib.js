const AppConfig = require('./AppConfig')
const Locations = require('mongoose').model('Locations')
let debug = require("debug-levels")("LocationLib")
const CityLib = require('./CityLib')

const LocationLib = {

  async saveLocation (data) {
    let res
    const locations = new Locations(data)
    await locations.save().then(result => {
      if(!result) {
        debug.error("ERROR: Saving Location!")
        return
      }
      debug.info('Location Saved Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in Location!", error)
      return
    })
    return res
  },

  async updateLocation (data) {
    let res
    await Locations.findOneAndUpdate({
      ID: data.ID
    },
    data,
    {upsert:false}
    )
    .then(result => {
      if(!result) {
        debug.error("No ID Found or ERROR: updating Location!")
        return
      }
      debug.info('Location Updated Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in updating Location!", error)
      return
    })
    return res
  },

  async countLocations () {
    try {
      const locationsRes = await Locations.countDocuments()
      if(!locationsRes) {
        throw new Error('No Locations Found!')
      }
      debug.info('Locations: ', locationsRes)
      return locationsRes
    } catch (error) {
      debug.error("ERROR: No Locations Found!", error)
      return
    }
  },

  async fetchAllLocations () {
    try {
      const locationsRes = await Locations.aggregate([
        {
          $lookup: 
            {
              from: "cities", localField: "city_id", foreignField: "ID", as: "city"
            }
        },  
        {
          $match: 
          {
            details: {$ne: []}
          }
        },
        { 
          "$unwind": {
            "path": "$city",
            "preserveNullAndEmptyArrays": true
          } 
        }
      ])
      if(!locationsRes) {
        throw new Error('No Locations Found!')
      }
      debug.info('Locations: ', locationsRes)
      return locationsRes
    } catch (error) {
      debug.error("ERROR: No Locations Found!", error)
      return
    }
  },

  async fetchPaginationLocations (pageSize, pageNumber) {
    pageNumber = Number(pageNumber)
    pageSize = Number(pageSize)
    try {
      const locationsRes = await Locations.aggregate([
        {
          $lookup: 
            {
              from: "cities", localField: "city_id", foreignField: "ID", as: "city"
            }
        },  
        {
          $match: 
          {
            details: {$ne: []}
          }
        },
        { 
          "$unwind": {
            "path": "$city",
            "preserveNullAndEmptyArrays": true
          } 
        },
        { "$skip":  pageSize * (pageNumber - 1) },
        { "$limit": pageSize }
      ])
      if(!locationsRes) {
        throw new Error('No Locations Found!')
      }
      debug.info('Locations: ', locationsRes)
      return locationsRes
    } catch (error) {
      debug.error("ERROR: No Locations Found!", error)
      return
    }
  },

  async findEightRandomLocations () {
    try {
      const locationsRes = await Locations.aggregate([
        { 
          $sample: { size: 8 } 
        },
        {
          $lookup: 
            {
              from: "cities", localField: "city_id", foreignField: "ID", as: "city"
            }
        },
        { 
          "$unwind": {
            "path": "$city",
            "preserveNullAndEmptyArrays": true
          } 
        },  
        {
          $match: 
          {
            details: {$ne: []}
          }
        },
        { "$limit": pageSize },
        { "$skip": (pageNumber - 1) * pageSize }
      ])
      if(!locationsRes) {
        throw new Error('No Locations Found!')
      }
      debug.info('Locations: ', locationsRes)
      return locationsRes
    } catch (error) {
      debug.error("ERROR: No Locations Found!", error)
      return
    }
  },

  async fetchLocationsWithObjects () {
    let locations = await LocationLib.fetchAllLocations()
    if(locations) {
      let cityIds = locations.map( location => {
        return location.city_id
      })
      let cities = await CityLib.fetchManyCities(cityIds)
      if(cities) {
        let reply = await LocationLib.ManupilateLocationAndCity(locations, cities)
        return reply
      } else {
        debug.error("No Cities found")
        return locations
      }
    } else {
      debug.error("No Locations found")
      return
    }
  },

  async ManupilateLocationAndCity (locations, cities) {
    for(let i = 0; i < locations.length; i++) {
      for(let j = 0; j < cities.length; j++) {
        if(locations[i].city_id == cities[j].ID) {
          //creating new location object but needs to be figure out why
          let newLocation = {
            ID: locations[i].ID,
            city_id: locations[i].city_id,
            name: locations[i].name,
            gallery: locations[i].gallery,
            province: locations[i].province,
            views: locations[i].views,
            star_rating: locations[i].star_rating,
            recommended: locations[i].recommended,
            city: cities[j]
          }
          locations[i] = newLocation
          break
        }
      }
    }
    return locations
  },

  async fetchAllRecommendedLocations () {
    let reply 
    await Locations.find({
      recommended: true
    })
    .exec()
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Locations: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Locations found", error)
      return
    })
    return reply
  },

  async findLocationById (ID) {
    ID = parseInt(ID)
    try {
      const locationsRes = await Locations.aggregate(
        [
          {
            $match: 
            {
              ID: ID
            }
          },
          {
            $lookup: 
              {
                from: "cities", localField: "city_id", foreignField: "ID", as: "city"
              }
          },
          { 
            "$unwind": {
              "path": "$city",
              "preserveNullAndEmptyArrays": true
            } 
          },  
        {
          $match: 
          {
            details: {$ne: []}
          }
        }
      ])
      if(!locationsRes) {
        throw new Error('No Location Found!')
      }
      debug.info('Location: ', locationsRes)
      return locationsRes
    } catch (error) {
      debug.error("ERROR: No Location Found!", error)
      return
    }
  },

  async findLocationByName (name) {
    let reply 
    await Locations.find({
      name: name
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Location: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Location found", error)
      return
    })
    return reply
  },

  async findLocationByCity_id (city_id) {
    city_id = Number(city_id)
    try {
      const locationsRes = await Locations.aggregate(
        [
          {
            $match: 
            {
              city_id: city_id
            }
          },
          {
            $lookup: 
              {
                from: "cities", localField: "city_id", foreignField: "ID", as: "city"
              }
          },
          { 
            "$unwind": {
              "path": "$city",
              "preserveNullAndEmptyArrays": true
            } 
          },  
        {
          $match: 
          {
            details: {$ne: []}
          }
        }
      ])
      if(!locationsRes) {
        throw new Error('No Location Found!')
      }
      debug.info('Location: ', locationsRes)
      return locationsRes
    } catch (error) {
      debug.error("ERROR: No Location Found!", error)
      return
    }
  },

  async deleteLocationById (ID) {
    let reply
    await Locations.findOneAndDelete({ 
      ID: ID 
    })
    .then (res => {
      if (!res) {
        return
      }
      debug.info('Location: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Location found", error)
      return
    })
    return reply
  },

  async fetchUrlImages (ID, url) {
    try {
      const locationRes = await Locations.findOne({
        ID: ID,
        "gallery.url": url
      })
      if(!locationRes) {
        throw new Error('No Location Found!')
      }
      debug.info('Location: ', locationRes)
      return locationRes
    } catch (error) {
      debug.error("ERROR: No Location Found!", error)
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

  async deleteLocationGallery (ID, url) {
    let image = await LocationLib.fetchUrlImages(ID, url)
    if(image) {
      let gallery = await LocationLib.deletePictureObject(image, url)
      image.gallery = gallery
      return image
    }
    else {
      debug.error("ERROR: No Location Gallery Data Found To Delete Location Gallery Data!")
    }
  },


}

module.exports = LocationLib