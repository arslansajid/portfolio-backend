const AppConfig = require('./AppConfig')
const HotelRating = require('mongoose').model('HotelRatings')
let debug = require("debug-levels")("HotelRatingLib")
const Hotel = require('./HotelLib')

const HotelRatingLib = {

  async saveHotelRating (data) {
    let res
    const hotelRating = new HotelRating(data)
    await hotelRating.save().then(result => {
      if(!result) {
        debug.error("ERROR: Saving HotelRating!")
        return
      }
      debug.info('HotelRating Saved Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in HotelRating!", error)
      return
    })
    return res
  },

  async updateHotelRating (data) {
    let res
    await HotelRating.findOneAndUpdate({
      ID: data.ID
    },
    data,
    {upsert:false}
    )
    .then(result => {
      if(!result) {
        debug.error("No ID Found or ERROR: updating HotelRating!")
        return
      }
      debug.info('HotelRating Updated Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in updating HotelRating!", error)
      return
    })
    return res
  },

  async findAcceptedHotelRatingByHotelId (hotel_id) {
    let reply 
    await HotelRating.find({
      hotel_id: hotel_id,
      status: "ACCEPTED"
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('HotelRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelRating found", error)
      return
    })
    return reply
  },

  async getreview_count (hotel_id) {
    try {
      const hotelRes = await HotelRating.find(
        {
          hotel_id : hotel_id,
          status: 'ACCEPTED'
        }).count()
      if(!hotelRes) {
        throw new Error('No ID Found or ERROR: Review Count hotel_id!')
      }
      debug.info('hotel_id Review Count Result', hotelRes)
      return hotelRes
    } catch (error) {
      debug.error("ERROR: Found in Review Count hotel_id!", error)
      return
    }
  },

  // need to refactor again hotel_id always goes to else part
  async aggregateHotelRating (ID) {
    let hotel_id = ID
    // if(hotel_id) {
      const ratingData = await HotelRating.aggregate([
        {
          $match:
          {
            "hotel_id": hotel_id
          } 
        },
        {
          $group: {
            _id : "$hotel_id",
            avg: {$avg: "$rating" }
          }
        }
      ])
      if(ratingData && ratingData.length > 0) {
        debug.info(ratingData)
        return ratingData
      } else {
        debug.info('ERROR: No Hotel Data Found To Update Rating!')
        return
      }
    // } else {
    //   debug.error('ERROR: No Hotel_ID Found!')
    //   return
    // }
  },

  async updateHotelData (response, review_count) {
    let hotel_id
    let avgRating 
    response.map( res => {
      hotel_id = res._id
      avgRating = res.avg
    })
    let fetchHotel = await Hotel.findHotelById(hotel_id)
    if(fetchHotel) {
      fetchHotel.star_rating = avgRating
      fetchHotel.review_count = review_count || 0
      let updateHotel = await Hotel.updateHotel(fetchHotel)
      if (updateHotel) {
        debug.info('Hotel Updated: ', updateHotel)
        return updateHotel
      } else {
        return
      }
    } else {
      return
    }
  },

  async fetchAllHotelRatings () {
    let reply 
    await HotelRating.find()
    .exec()
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('HotelRatings: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelRatings found", error)
      return
    })
    return reply
  },

  async findHotelRatingById (ID) {
    let reply 
    await HotelRating.findOne({
      ID : ID
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('HotelRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelRating found", error)
      return
    })
    return reply
  },

  async findHotelRatingByUserId (user_id) {
    let reply 
    await HotelRating.find({
      user_id: user_id
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('HotelRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelRating found", error)
      return
    })
    return reply
  },

  async findHotelRatingByHotelId (hotel_id) {
    let reply 
    await HotelRating.find({
      hotel_id: hotel_id
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('HotelRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelRating found", error)
      return
    })
    return reply
  },

  async findHotelRatingByHotelIdAndUserId (hotel_id, user_id) {
    let reply 
    await HotelRating.findOne({
      hotel_id: hotel_id,
      user_id: user_id
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('HotelRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelRating found", error)
      return
    })
    return reply
  },

  async findPendingHotelRatings () {
    let reply 
    await HotelRating.find({
      status: "PENDING"
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('HotelRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelRating found", error)
      return
    })
    return reply
  },

  async findAcceptedHotelRatings () {
    let reply 
    await HotelRating.find({
      status: "ACCEPTED"
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('HotelRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelRating found", error)
      return
    })
    return reply
  },

  async findRejectedHotelRatings () {
    let reply 
    await HotelRating.find({
      status: "REJECTED"
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('HotelRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelRating found", error)
      return
    })
    return reply
  },

  async deleteHotelRatingById (ID) {
    let reply
    await HotelRating.findOneAndDelete({ 
      ID: ID 
    })
    .then (res => {
      if (!res) {
        return
      }
      debug.info('HotelRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelRating found", error)
      return
    })
    return reply
  }


}

module.exports = HotelRatingLib