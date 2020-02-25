const router = require('express').Router()
let debug = require("debug-levels")("hotelRatingApi")
const HotelRating = require('../models/HotelRating')
const HotelRatingLib = require('../lib/HotelRatingLib')
const AppConfig = require('../lib/AppConfig')


// Saving HotelRating
router.post("/save/hotelRating-save", async (req, res) => {
	if (!req.body.hotelRating) {
    debug.error("ERROR: No Data found in HotelRating request!")
    res.status(500).send("ERROR: No Data found in HotelRating request!")
  }
  let data = JSON.parse(req.body.hotelRating)
  // let data = req.body  // for test on Postman
  let reply = await HotelRatingLib.saveHotelRating(data)
  if (data.status !== "ACCEPTED") {
    res.status(200).send('HotelRating Saved')
  } else {
    if (reply) {
      let response = await HotelRatingLib.aggregateHotelRating(data.hotel_id)
      if(response) {
        let review_count = await HotelRatingLib.getreview_count(data.hotel_id)
        let updateHotel = await HotelRatingLib.updateHotelData(response, review_count)
        if(updateHotel) {
          res.status(200).send('HotelRating Saved And Hotel Updated!')
        } else {
          res.status(500).send('ERROR: Hotel Rating Saved but Updating Hotel Document!')
        }
      } else {
        res.status(500).send('ERROR: Hotel Rating Saved but Error calculating Hotel Rating!')
      }
    } else {
      res.status(500).send('ERROR: Duplicate Field Found or Error Saving HotelRating!')
    }
  }
})

// Updating HotelRating
router.patch("/update/hotelRating-update", async (req, res) => {
	if (!req.body.hotelRating) {
    debug.error("ERROR: No Data found in HotelRating request!")
    res.status(500).send("ERROR: No Data found in HotelRating request!")
  }
  let data = JSON.parse(req.body.hotelRating)
  // let data = req.body  // for test on Postman
  let reply = await HotelRatingLib.updateHotelRating(data)
  if (data.status !== "ACCEPTED") {
    res.status(200).send('HotelRating Updated')
  } else {
    if (reply) {
      let response = await HotelRatingLib.aggregateHotelRating(data.hotel_id)
      if(response) {
        let review_count = await HotelRatingLib.getreview_count(data.hotel_id)
        let updateHotel = await HotelRatingLib.updateHotelData(response, review_count)
        if(updateHotel) {
          res.status(200).send('HotelRating Updated And Hotel Updated!')
        } else {
          res.status(500).send('ERROR: Hotel Rating Updated but Updating Hotel Document!')
        }
      } else {
        res.status(500).send('ERROR: Hotel Rating Updated but Error calculating Hotel Rating!')
      }
    } else {
      res.status(500).send('ERROR: Duplicate Field Found or Error Updating HotelRating!')
    }
  }
})

// fetching all HotelRating
router.get('/fetch/hotelRating-fetch', async(req, res) => {
  let reply = await HotelRatingLib.fetchAllHotelRatings()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelRating Found Or Error Fetching HotelRating!')
  }
})

// fetching HotelRating by ID
router.get('/fetchById/hotelRating-fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in HotelRating request!")
    res.status(500).send("ERROR: No ID found in HotelRating request!")
  }
  let reply = await HotelRatingLib.findHotelRatingById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelRating Found Or Error Fetching HotelRating By ID!')
  }
})

// fetching HotelRating by User ID
router.get('/fetchByUserId/hotelRating-fetchByUserId/:user_id', async(req, res) => {
  let user_id = req.params.user_id
  if (!user_id) {
    debug.error("ERROR: No user_id found in HotelRating request!")
    res.status(500).send("ERROR: No user_id found in HotelRating request!")
  }
  let reply = await HotelRatingLib.findHotelRatingByUserId(user_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelRating Found Or Error Fetching HotelRating By user_id!')
  }
})

// fetching HotelRating by fetchByHotelId
router.get('/fetchByHotelId/hotelRating-fetchByHotelId/:hotel_id', async(req, res) => {
  let hotel_id = req.params.hotel_id
  if (!hotel_id) {
    debug.error("ERROR: No hotel_id found in HotelRating request!")
    res.status(500).send("ERROR: No hotel_id found in HotelRating request!")
  }
  let reply = await HotelRatingLib.findHotelRatingById(hotel_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelRating Found Or Error Fetching HotelRating By hotel_id!')
  }
})

// fetching HotelRating by fetchAcceptedHotel rating
router.get('/fetchAcceptedHotelById/hotelRating-fetchAcceptedHotelById/:hotel_id', async(req, res) => {
  let hotel_id = req.params.hotel_id
  if (!hotel_id) {
    debug.error("ERROR: No hotel_id found in HotelRating request!")
    res.status(500).send("ERROR: No hotel_id found in HotelRating request!")
  }
  let reply = await HotelRatingLib.findAcceptedHotelRatingByHotelId(hotel_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelRating Found Or Error Fetching HotelRating By hotel_id!')
  }
})

// fetching HotelRating by fetchByHotelIdAndUserId
router.get('/fetchByHotelIdAndUserId/hotelRating-hotelId/:hotel_id/userId/:user_id', async(req, res) => {
  let hotel_id = req.params.hotel_id
  let user_id = req.params.user_id
  if (!hotel_id || !user_id) {
    debug.error("ERROR: No hotel_id or user_id found in HotelRating request!")
    res.status(500).send("ERROR: No hotel_id or user_id found in HotelRating request!")
  }
  let reply = await HotelRatingLib.findHotelRatingByHotelIdAndUserId(hotel_id, user_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelRating Found Or Error Fetching HotelRating By hotel_id or user_id!')
  }
})

// fetching all Pending HotelRating
router.get('/fetchAllPending/hotelRating-fetchAllPending', async(req, res) => {
  let reply = await HotelRatingLib.findPendingHotelRatings()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelRating Found Or Error Fetching HotelRating Pending!')
  }
})

// fetching all Rejected HotelRating
router.get('/fetchAllRejected/hotelRating-fetchAllRejected', async(req, res) => {
  let reply = await HotelRatingLib.findRejectedHotelRatings()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelRating Found Or Error Fetching HotelRating Rejected!')
  }
})

// fetching all Pending HotelRating
router.get('/fetchAllAccepted/hotelRating-fetchAllAccepted', async(req, res) => {
  let reply = await HotelRatingLib.findAcceptedHotelRatings()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelRating Found Or Error Fetching HotelRating Accepted!')
  }
})

//Delete HotelRating by ID
router.delete('/delete/hotelRating-deleteById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in HotelRating request!")
    res.status(500).send("ERROR: No ID found in HotelRating request!")
  }
  let reply = await HotelRatingLib.deleteHotelRatingById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelRating Found Or Deleting HotelRating!')
  }
})

module.exports = router
