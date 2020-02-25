const AppConfig = require('./AppConfig')
const Cloudinary = require('./Cloudinary')
const Event = require('../models/Event')
// const Event = require('mongoose').model('Cities')
let debug = require("debug-levels")("EventLib")

const EventLib = {

  async saveEvent (data) {
    data.created_At = new Date()
    const event = new Event(data)
    try {
      const eventRes = await event.save()
      if(!eventRes) {
        throw new Error('ERROR: Saving Event!')
      }
      debug.info('Event Saved!', eventRes)
      return eventRes
    } catch (error) {
      debug.error("ERROR: Saving Event!", error)
      return
    }
  },

  async updateEvent (data) {
    data.created_At = new Date()
    try {
      const eventRes = await Event.findOneAndUpdate({
        ID: data.ID
      },
      data,
      {upsert:false}
      )
      if(!eventRes) {
        throw new Error('No ID Found or ERROR: updating Event!')
      }
      debug.info('Event Updated Result', eventRes)
      return eventRes
    } catch (error) {
      debug.error("ERROR: Found in updating Event!", error)
      return
    }
  },

  async fetchAllEvents () {
    try {
      const eventRes = await Event.aggregate(
        [
          {
            $lookup: 
              {
                from: "locations", localField: "location_id", foreignField: "ID", as: "location"
              }
          },
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
            "path": "$location",
            "preserveNullAndEmptyArrays": true
          } 
        },
        { 
          "$unwind": {
            "path": "$city",
            "preserveNullAndEmptyArrays": true
          } 
        },
      ])
      if(!eventRes) {
        throw new Error('No Events Found!')
      }
      debug.info('Events: ', eventRes)
      return eventRes
    } catch (error) {
      debug.error("ERROR: No Events Found!", error)
      return
    }
  },

  async findEventById (ID) {
    ID = parseInt(ID)
    try {
      const eventRes = await Event.aggregate(
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
                from: "locations", localField: "location_id", foreignField: "ID", as: "location"
              }
          },
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
            "path": "$location",
            "preserveNullAndEmptyArrays": true
          } 
        },
        { 
          "$unwind": {
            "path": "$city",
            "preserveNullAndEmptyArrays": true
          } 
        },
      ])
      if(!eventRes) {
        throw new Error('No Event Found!')
      }
      debug.info('Event: ', eventRes)
      return eventRes
    } catch (error) {
      debug.error("ERROR: No Event Found!", error)
      return
    }
  },

  async findEventByDate (start_date, end_start) {
    debug.info(start_date)
    debug.info(end_start)
    try {
      const eventRes = await Event.aggregate(
        [
          {
            $match: 
              { 
                'start_date' : { '$gte' : start_date }
              }
          },
          {
            $lookup: 
              {
                from: "locations", localField: "location_id", foreignField: "ID", as: "location"
              }
          },
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
            "path": "$location",
            "preserveNullAndEmptyArrays": true
          } 
        },
        { 
          "$unwind": {
            "path": "$city",
            "preserveNullAndEmptyArrays": true
          } 
        },
      ])
      if(!eventRes) {
        throw new Error('No Event Found!')
      }
      debug.info('Event: ', eventRes)
      return eventRes
    } catch (error) {
      debug.error("ERROR: No Event Found!", error)
      return
    }
  },

  async findEventByLocation (location_id) {
    location_id = parseInt(location_id)
    try {
      const eventRes = await Event.aggregate(
        [
          {
            $match: 
            {
              location_id: location_id
            }
          },
          {
            $lookup: 
              {
                from: "locations", localField: "location_id", foreignField: "ID", as: "location"
              }
          },
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
            "path": "$location",
            "preserveNullAndEmptyArrays": true
          } 
        },
        { 
          "$unwind": {
            "path": "$city",
            "preserveNullAndEmptyArrays": true
          } 
        },
      ])
      if(!eventRes) {
        throw new Error('No Event Found!')
      }
      debug.info('Event: ', eventRes)
      return eventRes
    } catch (error) {
      debug.error("ERROR: No Event Found!", error)
      return
    }
  },

  async findEventByCity (city_id) {
    city_id = parseInt(city_id)
    try {
      const eventRes = await Event.aggregate(
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
                from: "locations", localField: "location_id", foreignField: "ID", as: "location"
              }
          },
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
            "path": "$location",
            "preserveNullAndEmptyArrays": true
          } 
        },
        { 
          "$unwind": {
            "path": "$city",
            "preserveNullAndEmptyArrays": true
          } 
        },
      ])
      if(!eventRes) {
        throw new Error('No Event Found!')
      }
      debug.info('Event: ', eventRes)
      return eventRes
    } catch (error) {
      debug.error("ERROR: No Event Found!", error)
      return
    }
  },

  async findEventByTitle (title) {
    try {
      const eventRes = await Event.aggregate(
        [
          {
            $match: 
            {
              title: title
            }
          },
          {
            $lookup: 
              {
                from: "locations", localField: "location_id", foreignField: "ID", as: "location"
              }
          },
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
            "path": "$location",
            "preserveNullAndEmptyArrays": true
          } 
        },
        { 
          "$unwind": {
            "path": "$city",
            "preserveNullAndEmptyArrays": true
          } 
        },
      ])
      if(!eventRes) {
        throw new Error('No Events Found!')
      }
      debug.info('Events: ', eventRes)
      return eventRes
    } catch (error) {
      debug.error("ERROR: No Events Found!", error)
      return
    }
  },

  async findRecommendedEvents () {
    try {
      const eventRes = await Event.aggregate(
        [
          {
            $match: 
            {
              recommended: true
            }
          },
          {
            $lookup: 
              {
                from: "locations", localField: "location_id", foreignField: "ID", as: "location"
              }
          },
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
            "path": "$location",
            "preserveNullAndEmptyArrays": true
          } 
        },
        { 
          "$unwind": {
            "path": "$city",
            "preserveNullAndEmptyArrays": true
          } 
        },
      ])
      if(!eventRes) {
        throw new Error('No Events Found!')
      }
      debug.info('Events: ', eventRes)
      return eventRes
    } catch (error) {
      debug.error("ERROR: No Events Found!", error)
      return
    }
  },

  async deleteEventById (ID) {
    try {
      const eventRes = await Event.findOneAndDelete({
        ID: ID
      })
      if(!eventRes) {
        throw new Error('No Events Found!')
      }
      debug.info('Events: ', eventRes)
      return eventRes
    } catch (error) {
      debug.error("ERROR: No Events Found!", error)
      return
    }
  },

  async fetchUrlImages (ID, url) {
    try {
      const eventRes = await Event.findOne({
        ID: ID,
        "gallery.url": url
      })
      if(!eventRes) {
        throw new Error('No Event Found!')
      }
      debug.info('Event: ', eventRes)
      return eventRes
    } catch (error) {
      debug.error("ERROR: No Event Found!", error)
      return
    }
  },

  async fetchCoverUrl (ID, url) {
    try {
      const eventRes = await Event.findOne({
        ID: ID,
        "cover_photo.url": url
      })
      if(!eventRes) {
        throw new Error('No Event Found!')
      }
      debug.info('Event: ', eventRes)
      return eventRes
    } catch (error) {
      debug.error("ERROR: No Event Found!", error)
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

  async deleteEventGallery (ID, url) {
    let image = await EventLib.fetchUrlImages(ID, url)
    if(image) {
      let gallery = await EventLib.deletePictureObject(image, url)
      image.gallery = gallery
      return image
    }
    else {
      debug.error("ERROR: No Event Gallery Data Found To Delete Event Gallery Data!")
    }
  },

  async deleteCoverPhoto (ID, url) {
    let image = await EventLib.fetchCoverUrl(ID, url)
    if(image) {
      image.cover_photo = {}
      return image
    }
    else {
      debug.error("ERROR: No Event Cover Data Found To Delete Event Cover Data!")
    }
  }

}

module.exports = EventLib