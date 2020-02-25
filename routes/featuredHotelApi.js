const router = require('express').Router()
let debug = require("debug-levels")("featuredHotelLibApi")
const FeaturedHotel = require('../models/FeaturedHotel')
const FeaturedHotelLib = require('../lib/FeaturedHotelLib')
const AppConfig = require('../lib/AppConfig')
const checkAuth = require('../middleware/check-auth')


// Saving FeaturedHotel
router.post("/save/featuredHotel-save", checkAuth, async (req, res) => {
  let data = JSON.parse(req.body.featuredHotel)
  // let data = req.body  // for test on Postman
	if (!data) {
    debug.error("ERROR: No Data found in FeaturedHotel request!")
    res.status(500).send("ERROR: No Data found in FeaturedHotel request!")
  }
  let reply = await FeaturedHotelLib.saveFeaturedHotel(data)
  if (reply) {
    res.status(200).send('FeaturedHotel Saved!')
  } else {
    res.status(500).send('ERROR: Duplicate Field Found or Error Saving FeaturedHotel!')
  }
})

// Updating FeaturedHotel
router.patch("/update/featuredHotel-update", checkAuth, async (req, res) => {
  let data = JSON.parse(req.body.featuredHotel)
  // let data = req.body   //for testing in postman
	if (!data) {
    debug.error("ERROR: No Data found in FeaturedHotel request!")
    res.status(500).send("ERROR: No Data found in FeaturedHotel request!")
  }
  let reply = await FeaturedHotelLib.updateFeaturedHotel(data)
  if (reply) {
    res.status(200).send('FeaturedHotel Updated!')
  } else {
    res.status(500).send('ERROR: No ID Found or Error Updating FeaturedHotel!')
  }
})

// fetching all FeaturedHotel
router.get('/fetch/featuredHotel-fetch', async(req, res) => {
  let reply = await FeaturedHotelLib.fetchAllFeaturedHotels()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No FeaturedHotel Found Or Error Fetching FeaturedHotels!')
  }
})

// fetching 3 Random FeaturedHotel
router.get('/fetchThreeRandom/featuredHotel-fetchThreeRandom', async(req, res) => {
  let reply = await FeaturedHotelLib.findThreeRandomFeaturedHotels()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No FeaturedHotel Found Or Error Fetching FeaturedHotels!')
  }
})

// fetching FeaturedHotel by ID
router.get('/fetchById/featuredHotel-fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in FeaturedHotel request!")
    res.status(500).send("ERROR: No ID found in FeaturedHotel request!")
  }
  let reply = await FeaturedHotelLib.findFeaturedHotelById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No FeaturedHotel Found Or Error Fetching FeaturedHotel By ID!')
  }
})

//Delete FeaturedHotel by ID
router.delete('/delete/featuredHotel-deleteById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in FeaturedHotel request!")
    res.status(500).send("ERROR: No ID found in FeaturedHotel request!")
  }
  let reply = await FeaturedHotelLib.deleteFeaturedHotelById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No FeaturedHotel Found Or Deleting FeaturedHotel!')
  }
})

module.exports = router
