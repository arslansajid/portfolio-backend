const HotelContact = require('mongoose').model('HotelContact')
let debug = require("debug-levels")("HotelContactLib")

const HotelContactLib = {

  async saveHotelContact (data) {
    let res
    const hotelContact = new HotelContact(data)
    await hotelContact.save().then(result => {
      if(!result) {
        debug.error("ERROR: Saving HotelContact!")
        return
      }
      debug.info('HotelContact Saved Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in HotelContact!", error)
      return
    })
    return res
  },


  async updateHotelContact (data) {
    let res
    await HotelContact.findOneAndUpdate({
      ID: data.ID
    },
    data,
    {upsert:false}
    )
    .then(result => {
      if(!result) {
        debug.error("No ID Found or ERROR: updating HotelContact!")
        return
      }
      debug.info('HotelContact Updated Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in updating HotelContact!", error)
      return
    })
    return res
  },

  async fetchAllHotelContacts () {
    let reply 
    await HotelContact.find()
    .exec()
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('HotelContacts: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelContacts found", error)
      return
    })
    return reply
  },

  async findHotelContactById (ID) {
    let reply 
    await HotelContact.findOne({
      ID : ID
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('HotelContact: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelContact found", error)
      return
    })
    return reply
  },

  async findHotelContactByUserPhone (user_phone) {
    let reply 
    await HotelContact.find({
      user_phone : user_phone
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('HotelContact: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelContact found", error)
      return
    })
    return reply
  },

  async findHotelContactByUserEmail (user_email) {
    let reply 
    await HotelContact.find({
      user_email : user_email
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('HotelContact: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelContact found", error)
      return
    })
    return reply
  },

  async findHotelContactByUserName (user_name) {
    let reply 
    await HotelContact.find({
      user_name : user_name
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('HotelContact: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelContact found", error)
      return
    })
    return reply
  },

  async findHotelContactByRoomID (room_id) {
    let reply 
    await HotelContact.find({
      room_id: room_id
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('HotelContact: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelContact found", error)
      return
    })
    return reply
  },

  async findHotelContactByHotelID (hotel_id) {
    let reply 
    await HotelContact.find({
      hotel_id: hotel_id
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('HotelContact: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelContact found", error)
      return
    })
    return reply
  },

  async findHotelContactByUserID (user_id) {
    let reply 
    await HotelContact.find({
      user_id: user_id
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('HotelContact: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelContact found", error)
      return
    })
    return reply
  },

  async deleteHotelContactById (ID) {
    let reply
    await HotelContact.findOneAndDelete({ 
      ID: ID 
    })
    .then (res => {
      if (!res) {
        return
      }
      debug.info('HotelContact: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelContact found", error)
      return
    })
    return reply
  }


}

module.exports = HotelContactLib