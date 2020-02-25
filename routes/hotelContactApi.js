const router = require('express').Router()
let debug = require("debug-levels")("hotelContactApi")
const HotelContact = require('../models/HotelContact')
const hotelContactLib = require('../lib/HotelContactLib')
const nodeMailer = require('../lib/NodeMailer')
const checkAuth = require('../middleware/check-auth')


// Saving hotelContact
router.post("/save/hotelContact-save", async (req, res) => {
  let data = JSON.parse(req.body.hotelContact)
  let response
  // let data = req.body  // for test on Postman
	if (!data) {
    debug.error("ERROR: No Data found in HotelContact request!")
    res.status(500).send("ERROR: No Data found in HotelContact request!")
  }
  let reply = await hotelContactLib.saveHotelContact(data)
  if (reply) {
    debug.info('HotelContact Saved!')
    response = await nodeMailer.createHotelEmail(data)
  } else {
    res.status(500).send('ERROR: Duplicate Field Found or Error Saving HotelContact!')
  }
  response = []
  if (response) {
    res.status(200).send('HotelContact Saved!')
  } else {
    res.status(500).send('ERROR: Email Sent Failed!')
  }
})

// Updating hotelContact
router.patch("/update/hotelContact-update", async (req, res) => {
  let data = JSON.parse(req.body.hotelContact)
  // let data = req.body   //for testing in postman
	if (!data) {
    debug.error("ERROR: No Data found in HotelContact request!")
    res.status(500).send("ERROR: No Data found in HotelContact request!")
  }
  let reply = await hotelContactLib.updateHotelContact(data)
  if (reply) {
    res.status(200).send('HotelContact Updated!')
  } else {
    res.status(500).send('ERROR: No ID Found or Error Updating HotelContact!')
  }
})

// fetching all hotelContact
router.get('/fetch/hotelContact-fetch', async(req, res) => {
  let reply = await hotelContactLib.fetchAllHotelContacts()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelContact Found Or Error Fetching HotelContact!')
  }
})

// fetching hotelContact by ID
router.get('/fetchById/hotelContact-fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in HotelContact request!")
    res.status(500).send("ERROR: No ID found in HotelContact request!")
  }
  let reply = await hotelContactLib.findHotelContactById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelContact Found Or Error Fetching HotelContact By ID!')
  }
})

// fetching hotelContact by Room_ID
router.get('/fetchByRoomId/hotelContact-fetchByRoomId/:room_id', async(req, res) => {
  let room_id = req.params.room_id
  if (!room_id) {
    debug.error("ERROR: No ID found in HotelContact request!")
    res.status(500).send("ERROR: No ID found in HotelContact request!")
  }
  let reply = await hotelContactLib.findHotelContactByRoomID(room_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelContact Found Or Error Fetching HotelContact By ID!')
  }
})

// fetching hotelContact by Hotel_ID
router.get('/fetchByHotelId/hotelContact-fetchByHotelId/:hotel_id', async(req, res) => {
  let hotel_id = req.params.hotel_id
  if (!hotel_id) {
    debug.error("ERROR: No hotel_id found in HotelContact request!")
    res.status(500).send("ERROR: No hotel_id found in HotelContact request!")
  }
  let reply = await hotelContactLib.findHotelContactByHotelID(hotel_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelContact Found Or Error Fetching HotelContact By hotel_id!')
  }
})

// fetching hotelContact by User_ID
router.get('/fetchByUserId/hotelContact-fetchByUserId/:user_id', async(req, res) => {
  let user_id = req.params.user_id
  if (!user_id) {
    debug.error("ERROR: No user_id found in HotelContact request!")
    res.status(500).send("ERROR: No user_id found in HotelContact request!")
  }
  let reply = await hotelContactLib.findHotelContactByUserID(user_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelContact Found Or Error Fetching HotelContact By ID!')
  }
})

// fetching hotelContact by user phone
router.get('/fetchByUserPhone/hotelContact-fetchByUserPhone/:user_phone', async(req, res) => {
  let user_phone = req.params.user_phone
  if (!user_phone) {
    debug.error("ERROR: No user_phone found in HotelContact request!")
    res.status(500).send("ERROR: No user_phone found in HotelContact request!")
  }
  let reply = await hotelContactLib.findHotelContactByUserPhone(user_phone)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelContact Found Or Error Fetching HotelContact By user_phone!')
  }
})

// fetching hotelContact by user email
router.get('/fetchByUserEmail/hotelContact-fetchByUserEmail/:user_email', async(req, res) => {
  let user_email = req.params.user_email
  if (!user_email) {
    debug.error("ERROR: No user_email found in HotelContact request!")
    res.status(500).send("ERROR: No user_email found in HotelContact request!")
  }
  let reply = await hotelContactLib.findHotelContactByUserEmail(user_email)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelContact Found Or Error Fetching HotelContact By user_email!')
  }
})

// fetching hotelContact by user name
router.get('/fetchByUserName/hotelContact-fetchByUserName/:user_name', async(req, res) => {
  let user_name = req.params.user_name
  if (!user_name) {
    debug.error("ERROR: No user_name found in HotelContact request!")
    res.status(500).send("ERROR: No user_name found in HotelContact request!")
  }
  let reply = await hotelContactLib.findHotelContactByUserName(user_name)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelContact Found Or Error Fetching HotelContact By user_name!')
  }
})

//Delete hotelContact by ID 
router.delete('/delete/hotelContact-deleteById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in HotelContact request!")
    res.status(500).send("ERROR: No ID found in HotelContact request!")
  }
  let reply = await hotelContactLib.deleteHotelContactById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelContact Found Or Deleting HotelContact!')
  }
})

module.exports = router
