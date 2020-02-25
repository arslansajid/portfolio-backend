const AppConfig = require('./AppConfig')
// const FeaturedHotel = require('mongoose').model('FeaturedHotels')
const Hotel = require('mongoose').model('Hotels')
const FeaturedHotel = require('../models/FeaturedHotel')
let debug = require("debug-levels")("FeaturedHotelLib")

const FeaturedHotelLib = {

  async saveFeaturedHotel(data) {
    let res
    data.createdAt = new Date()
    const featuredHotel = new FeaturedHotel(data)
    await featuredHotel.save().then(result => {
      if(!result) {
        debug.error("ERROR: Saving FeaturedHotel!")
        return
      }
      debug.info('FeaturedHotel Saved Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in FeaturedHotel!", error)
      return
    })
    return res
  },

  async updateFeaturedHotel(data) {
    let res
    await FeaturedHotel.findOneAndUpdate({
      ID: data.ID
    },
    data,
    {upsert:false}
    )
    .then(result => {
      if(!result) {
        debug.error("No ID Found or ERROR: updating FeaturedHotel!")
        return
      }
      debug.info('FeaturedHotel Updated Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in updating FeaturedHotel!", error)
      return
    })
    return res
  },

  async fetchAllFeaturedHotels () {
    let reply 
    await FeaturedHotel.find()
    .exec()
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('FeaturedHotels: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No FeaturedHotels found", error)
      return
    })
    return reply
  },

  async findThreeRandomFeaturedHotels () {
    try {
      const featuredHotelsRes = await PackagePages.aggregate(
        [
          { 
            $sample: { size: 3 } 
          },
          {
            $lookup: 
              {
                from: "hotels", localField: "hotel_id", foreignField: "ID", as: "hotel"
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
            "path": "$hotel",
            "preserveNullAndEmptyArrays": true
          } 
        },
        { "$limit": pageSize },
        { "$skip": (pageNumber - 1) * pageSize }
      ])
      if(!featuredHotelsRes) {
        throw new Error('No FeaturedHotels Found!')
      }
      debug.info('FeaturedHotels: ', featuredHotelsRes)
      return featuredHotelsRes
    } catch (error) {
      debug.error("ERROR: No FeaturedHotels Found!", error)
      return
    }
  },

  async findFeaturedHotelById (ID) {
    let reply 
    await FeaturedHotel.find({
      ID : ID
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('FeaturedHotel: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No FeaturedHotel found", error)
      return
    })
    return reply
  },

  async findValidFeaturedHotelByDate () {
    var newDate = new Date()
    let reply 
    await FeaturedHotel.find({
      start_date: {
        "$lte": newDate 
      },
      end_date: {
        "$gte": newDate
      }
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('FeaturedHotel: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No FeaturedHotel found", error)
      return
    })
    return reply
  },

  async findExpiredFeaturedHotelByDate () {
    var newDate = new Date()
    let reply 
    await FeaturedHotel.find({
      start_date: {
        "$gte": newDate 
      },
      end_date: {
        "$lte": newDate
      }
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('FeaturedHotel: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No FeaturedHotel found", error)
      return
    })
    return reply
  },

  async getIds(data) {
    let ids = []
    if(data && data.length > 0) {
      data.map(featured => {
        let id = featured.hotel_id
        ids.push(id)
      })
      return ids
    }
    return
  },

  async findFeaturedHotels(data) {
    let ids = await FeaturedHotelLib.getIds(data)
    if(ids) {
      let reply 
      await Hotel.find({
        ID : { $in: ids }
      })
      .then(res => {
        if (res.length == 0) {
          return
        }
        debug.info('FeaturedPackage: ', res)
        reply = res
      })
      .catch(error => {
        debug.error("No FeaturedPackage found", error)
        return
    })
    return reply
    } else {
      return
    }
  },

  async deleteFeaturedHotelById (ID) {
    let reply
    await FeaturedHotel.findOneAndDelete({ 
      ID: ID 
    })
    .then (res => {
      if (!res) {
        return
      }
      debug.info('FeaturedHotel: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No FeaturedHotel found", error)
      return
    })
    return reply
  }


}

module.exports = FeaturedHotelLib